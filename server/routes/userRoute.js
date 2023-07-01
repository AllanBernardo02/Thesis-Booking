const express = require("express");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAdmin, isAuth } = require("../middlewares/authMiddleware");
const { response } = require("express");
const doctorModel = require("../models/doctor.model.js");
const message = require("../sms/sms.js");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const doctorAccountModel = require("../models/doctorAccountModel.js");
const appointmentModel = require("../models/appointmentModel");
const { sendSms } = require("../sms/sendSms.js");
const Patient = require("../models/patientModel.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({
      message: "User created successfully",
      success: true,
      result: newUser,
    });
  } catch (error) {
    console.log("Register error", error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

// -------------- new login feature is in auth.js file ----------------

// router.post('/login', async (req, res) => {
//   const { email, password, usertype } = req.body;

//   if (usertype === 'patient') {
//     try {
//       const user = await userModel.findOne({ email });
//       if (!user) {
//         return res
//           .status(200)
//           .send({ message: 'User not found', success: false });
//       }

//       if (user.isBlocked) {
//         return res.send({
//           message: 'Your account is blocked, please contact Administrator',
//           success: false,
//           data: null,
//         });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res
//           .status(200)
//           .send({ message: 'Password is incorrect', success: false });
//       } else {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: '8h',
//         });
//         res.send({ message: 'Login successful', success: true, data: token });
//       }
//     } catch (error) {
//       console.log('login error', error);
//       res
//         .status(500)
//         .send({ message: 'Error logging In', success: false, error });
//     }
//   } else if (usertype === 'doctor') {
//     try {
//       const user = await doctorAccountModel.findOne({ email });
//       if (!user) {
//         return res
//           .status(200)
//           .send({ message: 'Doctor not found', success: false });
//       }

//       if (user.isBlocked) {
//         return res.send({
//           message: 'Your account is blocked, please contact Administrator',
//           success: false,
//           data: null,
//         });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res
//           .status(200)
//           .send({ message: 'Password is incorrect', success: false });
//       } else {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: '8h',
//         });
//         res.send({ message: 'Login successful', success: true, data: token });
//       }
//     } catch (error) {
//       console.log('login error', error);
//       res
//         .status(500)
//         .send({ message: 'Error logging In', success: false, error });
//     }
//   } else if (usertype === 'admin') {
//     try {
//       const user = await userModel.findOne({ email });
//       if (!user) {
//         return res
//           .status(200)
//           .send({ message: 'User not found', success: false });
//       }

//       if (user.isBlocked) {
//         return res.send({
//           message: 'Your account is blocked, please contact Administrator',
//           success: false,
//           data: null,
//         });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res
//           .status(200)
//           .send({ message: 'Password is incorrect', success: false });
//       } else {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: '8h',
//         });
//         res.send({ message: 'Login successful', success: true, data: token });
//       }
//     } catch (error) {
//       console.log('login error', error);
//       res
//         .status(500)
//         .send({ message: 'Error logging In', success: false, error });
//     }
//   }
// });

router.post("/get-user-info-by-id", isAuth, async (req, res) => {
  try {
    const user =
      (await userModel.findOne({ _id: req.body.userId })) ||
      (await doctorAccountModel.findOne({ _id: req.body.userId }));
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post("/applyDoctor-account", isAuth, message, async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });

    const unseenNotification = adminUser.unseenNotification;
    unseenNotification.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onclickPath: "/admin/doctorslist",
    });
    await userModel.findByIdAndUpdate(adminUser._id, { unseenNotification });
    res.status(200).send({
      success: true,
      message: "Doctors account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post("/mark-all-notifications-as-seen", isAuth, async (req, res) => {
  try {
    // const userId = req.body.userId;
    // const user =
    //   (await doctorModel.findOne({ _id: userId })) ||
    //   Patient.findOne({ _id: userId });
    // console.log("mark", user);
    let user;

    if (req.body.userType === "doctor") {
      user = await doctorModel.findOne({ _id: req.body.userId });
    } else if (req.body.userType === "patient") {
      user = await Patient.findOne({ _id: req.body.userId });
    } else {
      // Handle the case when userType is not specified
      return res.status(400).send({
        success: false,
        message: "User type not specified",
      });
    }

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const unseenNotification = user.unseenNotification || [];
    const seenNotification = user.seenNotification || [];
    seenNotification.push(...unseenNotification);
    user.unseenNotification = [];
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-notifications", isAuth, async (req, res) => {
  try {
    // const notification = await doctorModel.findOne({
    //   unseenNotification: req.body._id,
    // });

    // const notification =
    //   // (await doctorModel.find({ _id: req.body.userId })) ||
    //   await Patient.find({ _id: req.body.userId });

    // console.log("notif", notification);

    const userId = req.body.userId; // Assuming the userId is provided in the request body

    const user =
      (await Patient.findOne({ _id: userId })) ||
      (await doctorModel.findOne({ _id: userId }));

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    const notification = user.unseenNotification;

    console.log("notif", notification);

    res.status(200).send({
      message: "Patient fetched Succesfully",
      success: true,
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(406).send({ message: "ERROR", success: false, error });
  }
});

router.get("/get-notifications-seen", isAuth, async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming the userId is provided in the request body

    const user =
      (await Patient.findOne({ _id: userId })) ||
      (await doctorModel.findOne({ _id: userId }));

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    const notification = user.seenNotification;

    console.log("notif", notification);

    res.status(200).send({
      message: "Patient fetched Succesfully",
      success: true,
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(406).send({ message: "ERROR", success: false, error });
  }
});

router.post("/delete-all-notifications", isAuth, async (req, res) => {
  try {
    // const user = await doctorModel.findOne({ _id: req.body.userId });

    let user;

    if (req.body.userType === "doctor") {
      user = await doctorModel.findOne({ _id: req.body.userId });
    } else if (req.body.userType === "patient") {
      user = await Patient.findOne({ _id: req.body.userId });
    } else {
      // Handle the case when userType is not specified
      return res.status(400).send({
        success: false,
        message: "User type not specified",
      });
    }

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.seenNotification = [];
    user.unseenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-approved-doctors", isAuth, async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error fecthed approved doctors",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", isAuth, message, async (req, res) => {
  try {
    const pendingAppointment = await Appointment.findOne({
      patientId: req.body.userId,
      doctorId: req.body.doctorId,
      status: { $in: ["pending", "approved"] },
    });

    if (pendingAppointment) {
      return res.status(400).json({
        message:
          "Booking failed, you currently have pending booking with same Doctor",
      });
    }

    req.body.patientId = req.body.userId;
    const newAppointment = new Appointment(req.body);
    console.log("Appointment", req.body);

    //check if overlapping
    const overlappingAppointment = await Appointment.findOne({
      doctorId: { $ne: req.body.doctorId },
      date: req.body.date,
      time: req.body.time,
    });

    if (overlappingAppointment) {
      return res.status(400).json({
        message:
          "The selected appointment time slot is already booked with another doctor.",
      });
    }

    // add appointment to doctors model
    const doctor = await doctorModel.findById(newAppointment.doctorId);
    doctor.appointments.push(newAppointment);
    await doctor.save();

    let indexOfDate = null;
    doctor.schedules.forEach((sched, i) => {
      if (
        sched.date.toISOString().split("T")[0] === req.body.date.split("T")[0]
      ) {
        indexOfDate = i;
      }
    });

    try {
      doctor.schedules[indexOfDate].occupied.push(req.body.time);
    } catch (err) {
      if (err instanceof TypeError) {
        doctor.schedules[indexOfDate].occoupied.push(req.body.time);
      }
    }
    await doctor.save();

    await newAppointment.save();

    // pushing notifications to doctor based on his/her userId
    const user = await doctorModel.findOne({ _id: req.body.doctorId });
    user.unseenNotification.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.patientFirstName}  ${req.body.patientLastName}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();

    res.status(201).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "err_booking" });
  }
});

// router.post("/book-appointment", isAuth, message, async (req, res) => {
//   try {
//     // check if user has pending appointment
//     const pendingAppointment = await Appointment.find({
//       patientId: req.body.userId,
//       status: { $in: ["pending", "approved"] },
//     });

//     if (pendingAppointment.length) {
//       return res
//         .status(400)
//         .json({ message: "err_appointment_has_pending_or_active_appointment" });
//     }

//     req.body.patientId = req.body.userId;
//     const newAppointment = new Appointment(req.body);

//     // add appointment to doctors model
//     const doctor = await doctorModel.findById(newAppointment.doctorId);
//     doctor.appointments.push(newAppointment);

//     // Save the doctor model
//     await doctor.save();

//     // Update doctor's schedules
//     let indexOfDate = null;
//     doctor.schedules.forEach((sched, i) => {
//       if (
//         sched.date.toISOString().split("T")[0] === req.body.date.split("T")[0]
//       ) {
//         indexOfDate = i;
//       }
//     });

//     try {
//       doctor.schedules[indexOfDate].occupied.push(req.body.time);
//     } catch (err) {
//       if (err instanceof TypeError) {
//         doctor.schedules[indexOfDate].occoupied.push(req.body.time);
//       }
//     }

//     // Save the doctor model again
//     await doctor.save();

//     // Save the new appointment
//     await newAppointment.save();

//     // Push a notification to the doctor
//     const user = await doctorModel.findOne({ _id: req.body.doctorInfo.userId });
//     user.unseenNotification.push({
//       type: "new-appointment-request",
//       message: `A new appointment request has been made by ${req.body.userInfo.name}`,
//       onClickPath: "/doctor/appointments",
//     });

//     // Save the doctor model with the notification
//     await user.save();

//     res.status(201).json({ message: "success" });
//   } catch (error) {
//     console.log(error);
//     res.status(404).send({ message: "err_booking" });
//   }
// });

router.post("/check-booking-availability", isAuth, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "hh:mm a")
      .subtract(59, "minutes")
      .toISOString();
    const toTime = moment(req.body.time, "hh:mm a")
      .add(59, "minutes")
      .toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointment available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ message: "Error Booking Appointment", success: false, error });
  }
});

router.get("/get-appointments-by-user-id", isAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error fetching appointments",
      success: false,
      error,
    });
  }
});

// router.get("/", (req, res) => {
//   res.send("Welcome Allan API");
// });

// router.get("/", isAuth, async (req, res) => {
//   await userModel
//     .find()
//     .then((use) => {
//       res.send(use);
//     })
//     .catch((err) => {
//       res.status(600), send({ message: err.message });
//     });
// });

// ---------

const canCancel = (dateString, timeString) => {
  const date = new Date(dateString);

  const timeRegex = /(\d{1,2}):(\d{2})\s([ap]m)/i;
  const [, hours, minutes, amPm] = timeString.match(timeRegex);

  let hours24 = parseInt(hours, 10);
  if (amPm.toLowerCase() === "pm" && hours24 < 12) {
    hours24 += 12;
  } else if (amPm.toLowerCase() === "am" && hours24 === 12) {
    hours24 = 0;
  }

  date.setUTCHours(hours24, minutes, 0);
  const currentDate = new Date();
  const timeDiff = date.getTime() - currentDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff >= 24;
};

// cancel appointment
router.post("/cancel-appointment", isAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.body.appointmentId
    ).populate("doctorId");

    if (!appointment)
      return res.status(404).json({ message: "err_appointment_not_found" });

    appointment.status = "cancelled";
    const appointmentTime = appointment.time;
    const appointmentDate = appointment.date;

    const apTime = appointmentTime.split(" ");

    // check if schedule is less than 24 hours --> deny cancel
    if (!canCancel(appointmentDate, apTime[0].trim() + " " + apTime[3])) {
      return res.status(400).json({ message: "24_ERR" });
    }

    const doctor = await doctorModel.findById(appointment.doctorId);

    doctor.schedules.forEach((sched, i) => {
      console.log(sched.date);
      if (sched.date.toISOString() === appointmentDate.toISOString()) {
        doctor.schedules[i].occoupied = doctor.schedules[i].occoupied.filter(
          (sched) => sched !== appointmentTime
        );
      }
    });

    await doctor.save();

    await appointment.save();

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_approve_appointment" });
  }
});

router.post("/cancel-appointment-doctor", isAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.body.appointmentId
    ).populate("doctorId");

    if (!appointment)
      return res.status(404).json({ message: "err_appointment_not_found" });

    appointment.status = "cancelled";
    const appointmentTime = appointment.time;
    const appointmentDate = appointment.date;

    const apTime = appointmentTime.split(" ");

    // check if schedule is less than 24 hours --> deny cancel
    // if (!canCancel(appointmentDate, apTime[0].trim() + " " + apTime[3])) {
    //   return res.status(400).json({ message: "24_ERR" });
    // }

    const doctor = await doctorModel.findById(appointment.doctorId);

    doctor.schedules.forEach((sched, i) => {
      console.log(sched.date);
      if (sched.date.toISOString() === appointmentDate.toISOString()) {
        doctor.schedules[i].occoupied = doctor.schedules[i].occoupied.filter(
          (sched) => sched !== appointmentTime
        );
      }
    });

    await doctor.save();

    await appointment.save();

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_approve_appointment" });
  }
});

router.get("/get-appointments", isAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.body.userId,
    })
      .populate("doctorId", "firstname lastname")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_get_appointment" });
  }
});

router.post("/get-user-info-by-user-id", isAuth, async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.body.userId });
    console.log("laman", patient);
    res.status(200).send({
      success: true,
      message: "Patient info Fetched successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting patient info",
      success: false,
      error,
    });
  }
});

router.post("/update-patient-profile", isAuth, async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.body.userId },
      req.body
    );

    console.log(patient);
    res.status(200).send({
      success: true,
      message: "Patient profile Updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting patient info",
      success: false,
      error,
    });
  }
});

//sending of sms
router.get("/send-sms", async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const appointments = await Appointment.find({
      date: { $gte: start, $lt: end },
      status: "approved",
    }).populate("patientId", "firstname lastname mobileNumber");

    const phoneNumbers = appointments.map((appointment) => {
      const { patientId, time } = appointment;
      const { firstname, lastname, mobileNumber } = patientId;
      const fullName = `${firstname} ${lastname}`;
      return { phoneNumber: mobileNumber, time, fullName };
    });
    if (phoneNumbers.length > 0) {
      await sendSms(phoneNumbers);
    }

    // sending of sms
    res.status(200).json({ phoneNumbers, message: "SMS sent" });
  } catch (err) {
    res.status(400).json({ message: "err_send_sms" });
  }
});

module.exports = router;
