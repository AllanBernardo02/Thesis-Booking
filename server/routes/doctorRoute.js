const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../middlewares/authMiddleware");
const doctorModel = require("../models/doctor.model.js");
const Appointment = require("../models/appointmentModel");
const { async } = require("q");
const adminModel = require("../models/admin.model");
const Patient = require("../models/patientModel");

router.post("/get-doctor-info-by-user-id", isAuth, async (req, res) => {
  console.log("ano ang laman", req.body.userId);
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.userId });
    console.log("laman", doctor);
    res.status(200).send({
      success: true,
      message: "Doctor info Fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

router.post("/update-doctor-profile", isAuth, async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { _id: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile Updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

router.post("/get-doctor-info-by-id", isAuth, async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    console.log("laman", doctor);
    res.status(200).send({
      success: true,
      message: "Doctor info Fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
});

// approve appointment
router.post("/approve-appointment", isAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "err_appointment_not_found" });

    appointment.status = "approved";
    await appointment.save();

    // pushing notifications to doctor based on his/her userId
    const user = await Patient.findOne({ _id: req.body.patientId });
    console.log("Sino ang user ?", user);
    user.unseenNotification.push({
      type: "new-appointment-request",

      message: `Your appointment request with Doctor ${req.body.doctorFirstName} ${req.body.doctorLastName} has been approved.`,
      onClickPath: "/appointments",
    });
    await user.save();

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_approve_appointment" });
  }
});

// done appointment
router.post("/done-appointment", isAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "err_appointment_not_found" });

    appointment.status = "done";
    await appointment.save();

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_done_appointment" });
  }
});

// get all appointments
router.get("/appointments", isAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.body.userId,
    })
      .populate("patientId", "firstname lastname")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "err_get_appointments" });
  }
});

router.get("/all-appointments", isAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("patientId doctorId", "firstname lastname")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "err_get_appointments" });
  }
});

router.get("/profile/:doctorId", isAuth, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await doctorModel.findById(doctorId);

    return res.status(200).json({ doctor: doctor.getProfile() });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err_get_doctor_profile" });
  }
});

// update doctor profile
router.put("/profile/:doctorId", isAuth, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ doctor: { ...doctor.getProfile(), userType: "doctor" } });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err_update_doctor_profile" });
  }
});

// get doctor schedules
router.get("/get-schedules/:doctorId", isAuth, async (req, res) => {
  const admin = await adminModel.find({});
  try {
    const doctor = await doctorModel.findById(req.params.doctorId);
    res.status(200).json({
      schedules: doctor.schedules || [],
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      specialization: doctor.specialization,
      clinicServices: admin[0].clinicServices,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      return res.status(200).json({
        schedules: [],
        firstname: doctor.firstname,
        lastname: doctor.lastname,
        specialty: doctor.specialty,
        clinicServices: admin[0].clinicServices,
      });
    }
    res.status(400).json({ message: "err_get_schedule" });
  }
});

// add Doctor schedule
router.post("/add-schedule", isAuth, async (req, res) => {
  try {
    const { date, time } = req.body;

    const doctor = await doctorModel.findById(req.body.userId);

    // find the matching date
    let indexOfDate = null;
    doctor.schedules.forEach((sched, i) => {
      if (sched.date.toISOString().split("T")[0] === date) {
        indexOfDate = i;
      }
    });

    try {
      // ----------- do not remove, used for testing -------
      // for (const timeSched of time) {
      //   if (!doctor?.schedules[indexOfDate]?.time?.includes(timeSched)) {
      //     doctor.schedules[indexOfDate].time = timeSched;
      //   }
      // }
      doctor.schedules[indexOfDate].time = time;
    } catch (err) {
      if (err instanceof TypeError && indexOfDate === null) {
        doctor.schedules.push({ date, time });
      }
    }
    await doctor.save();

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_add_schedule" });
  }
});

router.get("/all-doctor-patients/:doctorId", isAuth, async (req, res) => {
  try {
    const appointMents = await Appointment.find({
      doctorId: req.params.doctorId,
      status: "done",
    }).populate("patientId", "-password -tokens");

    // const patients = appointMents.map((app) => app.patientId);

    // return res.status(200).json({ patients });
    const patients = {};
    appointMents.forEach((app) => {
      patients[app.patientId._id] = app.patientId;
    });

    const uniquePatients = Object.values(patients);

    return res.status(200).json({ patients: uniquePatients });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_get_all_patients" });
  }
});

module.exports = router;
