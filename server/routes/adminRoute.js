const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel.js");
const doctorModel = require("../models/doctor.model.js");
const { isAdmin, isAuth } = require("../middlewares/authMiddleware");
const patientModel = require("../models/patientModel.js");
const consultationModel = require("../models/consultationModel.js");
const doctorAccountModel = require("../models/doctorAccountModel.js");
const clinicServiceModel = require("../models/clinicServiceModel.js");
const Admin = require("../models/admin.model");
const Patient = require("../models/patientModel.js");
const Customization = require("../models/customModel.js");
const multer = require("multer");

router.get("/get-all-doctors", isAuth, async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "ERROR", success: false, error });
  }
});

router.get("/get-all-users", isAuth, async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ message: "Error fetching users", success: false, error });
  }
});

router.post("/change-doctor-status", isAuth, async (req, res) => {
  try {
    const { doctorId, status, userId } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, {
      status,
    });
    // res.status(200).send({
    //   message: "Doctor status updated successfully",
    //   success: true,
    //   data: doctor,
    // });
    const user =
      (await userModel.findOne({ _id: doctor.userId })) ||
      (await doctorAccountModel.findOne({ _id: doctor.userId }));
    console.log("???", user);

    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "new-doctor-request-changed",
      message: `Your Doctor Account has been ${status}`,

      onclickPath: "/notifications",
    });

    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    res.status(200).send({
      message: "Doctor status updated successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ message: "Error fetching users", success: false, error });
  }
});

router.post("/update-user-permissions", isAuth, async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      message: "User permissions updated successfully",
      success: true,
      data: null,
    });
  } catch {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

router.post("/patient-record", isAuth, async (req, res) => {
  const patient = req.body;

  const newPatient = new patientModel({ ...patient });

  try {
    await newPatient.save();
    res.status(201).send({
      success: true,
      message: "Patient saved successfully",
      data: newPatient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-patient", isAuth, async (req, res) => {
  try {
    const patient = await patientModel.find({ userId: req.body.userId });

    res.status(200).send({
      message: "Patient fetched Succesfully",
      success: true,
      data: patient,
    });
  } catch (error) {
    console.log(error);
    res.status(406).send({ message: "ERROR", success: false, error });
  }
});

router.delete("/delete-patient-record/:id", isAuth, async (req, res) => {
  const id = req.params.id;
  const deletePatient = await consultationModel.findByIdAndRemove(id);

  res.status(201).send({
    message: "Delete patient successfully",
    success: true,
    data: deletePatient,
  });
});

router.post("/get-patient-info-by-id", isAuth, async (req, res) => {
  try {
    const patient = await patientModel.findOne({ _id: req.body.patientId });

    res.status(200).send({
      success: true,
      message: "Patient info Fetched successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

router.post("/get-patient-info-by-patient-id", isAuth, async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      patientId: req.body.patientId,
    });
    console.log("ano kaya?", patient);

    res.status(200).send({
      success: true,
      message: "Patient info Fetched successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

router.patch("/update-patient-profile/:id", isAuth, async (req, res) => {
  const id = req.params.id;
  const {
    consultationName,
    bloodPressure,
    weight,
    temparature,
    pulseRate,
    twoSaturation,
    height,
    respiratoryRate,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatePatient = {
    consultationName,
    bloodPressure,
    weight,
    temparature,
    pulseRate,
    twoSaturation,
    height,
    respiratoryRate,
    _id: id,
  };
  try {
    const patient = await consultationModel.findByIdAndUpdate(
      id,
      updatePatient
    );
    res.status(200).send({
      success: true,
      message: "Patient profile Updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

router.post("/patient-consulation-history", isAuth, async (req, res) => {
  const patientConsultation = req.body; //get data from client

  const newPatientConsultation = new consultationModel({
    ...patientConsultation,
  });

  try {
    await newPatientConsultation.save();
    res.status(201).send({
      success: true,
      message: "Patient Consultation saved successfully",
      data: newPatientConsultation,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error for saving Patient Consultation",
      success: false,
      error,
    });
  }
});

router.post("/get-patient-consultations-history", isAuth, async (req, res) => {
  try {
    const patientConsultation = await consultationModel
      .find({
        patientId: req.body.patientId,
        userId: req.body.userId,
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "Patient Consultation fetched Succesfully",
      success: true,
      data: patientConsultation,
    });
  } catch (error) {
    console.log(error);
    res.status(406).send({ message: "ERROR", success: false, error });
  }
});

router.post(
  "/get-patient-consultations-history-admin",
  isAuth,
  async (req, res) => {
    try {
      const patientConsultation = await consultationModel.find({
        patientId: req.body.patientId,
        // userId: req.body.userId,
      });

      res.status(200).send({
        message: "Patient Consultation fetched Succesfully",
        success: true,
        data: patientConsultation,
      });
    } catch (error) {
      console.log(error);
      res.status(406).send({ message: "ERROR", success: false, error });
    }
  }
);

router.post(
  "/get-patient-consultation-history-by-id",
  isAuth,
  async (req, res) => {
    try {
      const patient = await consultationModel.findOne({
        _id: req.body.patientId,
      });

      res.status(200).send({
        success: true,
        message: "Consultation info Fetched successfully",
        data: patient,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error getting doctor info",
        success: false,
        error,
      });
    }
  }
);

// addding a doctor account
router.post("/create-doctor-account", isAdmin, async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ email: req.body.email });
    console.log(req.userType, " << userType");

    if (doctor) {
      return res.status(400).json({ message: "email already registered" });
    }

    await doctorModel.create(req.body);

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err_create_doctor" });
  }
});

router.get("/get-doctors-account", isAuth, async (req, res) => {
  try {
    const doctors = await doctorAccountModel.find({});
    res.status(200).send({
      message: "Doctor fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ message: "Error fetching users", success: false, error });
  }
});

router.post("/create-clinic-services", isAuth, async (req, res) => {
  const clinic = req.body;
  const clinicService = new clinicServiceModel({ ...clinic });

  try {
    await clinicService.save();
    res.status(202).send({
      message: "Clinic was successfully created",
      success: true,
      data: clinicService,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
      success: false,
      error,
    });
  }
});

//get clinic service
router.get("/get-clinic-services", isAuth, async (req, res) => {
  try {
    const clinicService = await clinicServiceModel.find({});
    res.status(200).send({
      message: "Clinic Services fetched Successfully",
      success: true,
      data: clinicService,
    });
  } catch (error) {
    res.status(404).send({
      message: "Clinic Services fetched Error",
      success: false,
      error,
    });
  }
});

router.delete("/delete-clinic-service/:id", isAuth, async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const clinicService = await clinicServiceModel.findByIdAndRemove(id);

  res.status(201).send({
    message: "Clinic service deleted successfully",
    success: true,
    data: clinicService,
  });
});

router.patch("/update-clinic-service/:id", isAuth, async (req, res) => {
  const id = req.params.id;
  const { serviceName, serviceDescription } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateClinicService = {
    serviceName,
    serviceDescription,
    _id: id,
  };

  try {
    const clinic = await clinicServiceModel.findByIdAndUpdate(
      id,
      updateClinicService
    );
    res.status(200).send({
      success: true,
      message: "Clinic service updated successfully",
      data: clinic,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating",
      success: false,
      error,
    });
  }
});

router.get("/get-clinic-service-name", isAuth, async (req, res) => {
  try {
    const clinicService = await clinicServiceModel.find({});
    res.status(200).send({
      message: "Clinic Services fetched Successfully",
      success: true,
      data: clinicService,
    });
  } catch (error) {
    res.status(404).send({
      message: "Clinic Services fetched Error",
      success: false,
      error,
    });
  }
});

// register admin
router.post("/register", async (req, res) => {
  try {
    const admin = await Admin.create(req.body);

    res.status(201).json(admin);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_register_admin" });
  }
});

// get all ACTIVE doctors
router.get("/all-active-doctors", isAuth, async (req, res) => {
  try {
    const doctors = await doctorModel.find(
      { status: { $ne: "blocked" } },
      "-tokens -password"
    );
    res.status(200).json({ doctors });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err_get_all_active_doctors" });
  }
});

// get all doctors
router.get("/all-doctors", isAuth, async (req, res) => {
  try {
    const doctors = await doctorModel.find({}, "-tokens -password");
    console.log("patient", doctors);
    res.status(200).json({ doctors });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err_get_all_doctors" });
  }
});

// get all patients
router.get("/all-patients", isAdmin, async (req, res) => {
  try {
    const patients = await Patient.find({}, "-tokens -password");
    console.log("patient", patients);
    res.status(200).json({ patients });
  } catch (err) {
    a;
    console.log(err);
    return res.status(400).json({ message: "err_get_all_patients" });
  }
});

// add clinic service
router.post("/add-clinic-service", isAdmin, async (req, res) => {
  try {
    const newClinicService = req.body.clinicService;

    req.user.clinicServices.push(newClinicService);
    await req.user.save();

    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

// add clinic service
router.post("/update-clinic-service/:clinicId", isAdmin, async (req, res) => {
  try {
    const newClinicService = req.body.clinicService;
    const clinicId = req.params.clinicId;
    newClinicService._id = clinicId;

    const index = req.user.clinicServices.findIndex(
      (service) => service._id.toString() === clinicId
    );
    if (index === -1) {
      return res.status(404).send("service not found");
    }
    req.user.clinicServices[index] = {
      ...req.user.clinicServices[index],
      ...newClinicService,
      _id: clinicId,
    };
    await req.user.save();

    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

router.patch("/update-doctor-account/:id", isAdmin, async (req, res) => {
  const newDoctor = req.body.doctorAccount;
  const id = req.params.id;

  console.log("docsss", newDoctor);
  console.log("docsss_id", id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateDoctor = {
    newDoctor,
    _id: id,
  };

  console.log("Ayaw", updateDoctor);
  try {
    const doctor = await doctorModel.findByIdAndUpdate(id, newDoctor);
    console.log("oksss", doctor);
    res.status(200).send({
      success: true,
      message: "Doctor Updated successfully",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

router.patch("/update-patient-account/:id", isAdmin, async (req, res) => {
  const newPatient = req.body.patientAccount;
  const id = req.params.id;

  console.log("docsss", newPatient);
  console.log("docsss_id", id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateDoctor = {
    newPatient,
    _id: id,
  };

  console.log("Ayaw", updateDoctor);
  try {
    const patient = await Patient.findByIdAndUpdate(id, newPatient);
    console.log("oksss", patient);
    res.status(200).send({
      success: true,
      message: "Doctor Updated successfully",
      data: patient,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

router.patch("/update-patient-account-doctor/:id", isAuth, async (req, res) => {
  const newPatient = req.body.patientAccountDoctor;
  const id = req.params.id;

  console.log("docsss", newPatient);
  console.log("docsss_id", id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateDoctor = {
    newPatient,
    _id: id,
  };

  console.log("Ayaw", updateDoctor);
  try {
    const patient = await Patient.findByIdAndUpdate(id, newPatient);
    console.log("oksss", patient);
    res.status(200).send({
      success: true,
      message: "Doctor Updated successfully",
      data: patient,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

// delete clinic service
router.post("/delete-clinic-service/:clinicId", isAdmin, async (req, res) => {
  try {
    const clinicId = req.params.clinicId;

    const index = req.user.clinicServices.findIndex(
      (service) => service._id.toString() === clinicId
    );
    if (index === -1) {
      return res.status(404).send("service not found");
    }
    req.user.clinicServices = req.user.clinicServices.filter(
      (service) => service._id.toString() !== clinicId
    );
    await req.user.save();

    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_clinic_service" });
  }
});

// get clinic service
router.get("/get-services", isAuth, async (req, res) => {
  try {
    const admin = await Admin.find({});

    const clinicServices = admin[0].clinicServices;
    return res.status(200).json({ clinicServices });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_get_clinic_service" });
  }
});

//block or unblock doctor
router.put("/doctor-status/:doctorId", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await doctorModel.findById(req.params.doctorId);

    if (!doctor)
      return res.status(404).json({ message: "err_doctor_not_found" });
    doctor.status = status;
    await doctor.save();

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_doctor_status" });
  }
});

router.put("/menu-color", isAdmin, async (req, res) => {
  try {
    const { color } = req.body;

    // Save the color in the database
    await Customization.findOneAndUpdate({}, { color }, { upsert: true });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// // Create an instance of multer
// const upload = multer({
//   // dest: "/server/uploads", // Set the destination folder where uploaded files will be stored
//   limits: {
//     fileSize: 20 * 1024 * 1024, // Set the maximum file size (in bytes)
//   },
// });

// router.post(
//   "/add-logo",
//   isAuth,
//   upload.single("selectedFile"),
//   async (req, res) => {
//     try {
//       // Access the uploaded file using req.file
//       const file = req.file;

//       if (!file) {
//         return res.status(400).json({
//           message: "No file uploaded",
//           success: false,
//         });
//       }

//       // Process the uploaded file as needed (e.g., save to MongoDB, perform operations)
//       const custom = new Customization({ ...file });
//       await custom.save();

//       res.status(200).send({
//         message: "Image created successfully",
//         success: true,
//         data: file, // Return the uploaded file information or any other desired response
//       });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .send({ message: "Error uploading image", success: false });
//     }
//   }
// );

router.post("/add-logo", isAuth, async (req, res) => {
  try {
    // const cus = req.body;
    // const custom = new Customization({ ...cus });
    // await custom.save();
    const { selectedFile, backgroundColor } = req.body;

    // Save the selectedFile and backgroundColor to the database
    const customization = new Customization({
      selectedFile,
      backgroundColor,
    });
    await customization.save();
    res.status(200).send({
      message: "Image created successfully",
      success: true,
      data: custom,
    });
  } catch (error) {}
});

router.get("/get-logo", isAuth, async (req, res) => {
  try {
    // const clinicLogo = await Customization.findOne({}).sort({ createdAt: -1 });

    // res.status(200).send({
    //   message: "Clinic Logo fetched Successfully",
    //   success: true,
    //   data: clinicLogo,
    // });

    const customization = await Customization.findOne({}).sort({
      createdAt: -1,
    });
    const backgroundColor = customization?.backgroundColor || "defaultColor";

    res.status(200).send({
      message: "Clinic Logo fetched Successfully",
      success: true,
      data: {
        clinicLogo: customization,
        backgroundColor: backgroundColor,
      },
    });
  } catch (error) {
    res.status(404).send({
      message: "Clinic Logo fetched Error",
      success: false,
      error,
    });
  }
});

module.exports = router;
