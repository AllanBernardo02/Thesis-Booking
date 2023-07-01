const { Router } = require("express");
const Admin = require("../models/admin.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patientModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuth } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/register", async (req, res) => {
  req.body.profileImage = "/testimage.png";
  try {
    // const isEmailRegistered = await Promise.any([
    //   Patient.exists({ email: req.body.email }),
    //   Admin.exists({ email: req.body.email }),
    //   Doctor.exists({ email: req.body.email }),
    // ]);

    const isEmailRegistered = false;

    if (isEmailRegistered) {
      return res.status(409).json({ error: "ERR_DUPLICATE_EMAIL" });
    } else {
      try {
        await Patient.create(req.body);
      } catch (err) {
        if (err.code === 11000) {
          return res.status(404).json({ error: "ERR_DUPLICATE_EMAIL" });
        }
      }
    }
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(404).json({ error: "ERR_DUPLICATE_EMAIL" });
    }
    console.log("err", err);
    return res.status(400).json({ message: "err_register" });
  }
});

async function findUserByEmail(email) {
  const userModelTypes = [Admin, Patient, Doctor];

  let user = null;
  let userType = null;

  for (const modelType of userModelTypes) {
    const foundModel = await modelType.findOne({ email });
    if (foundModel) {
      user = foundModel;
      if (modelType === Admin) {
        userType = "admin";
      } else if (modelType === Patient) {
        userType = "patient";
      } else if (modelType === Doctor) {
        userType = "doctor";
      }
      break;
    }
  }

  return { user, userType };
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, userType } = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "invalid email or password" });
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      return res.status(404).json({ message: "invalid email or password" });
    }
    const token = jwt.sign(
      { _id: user._id.toString(), userType },
      process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    const userProfile = user.getProfile();
    userProfile.userType = userType;

    return res.status(200).json({ user: userProfile });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "err_login" });
  }
});

router.post("/logout", isAuth, async (req, res) => {
  const userModelType = {
    admin: Admin,
    patient: Patient,
    doctor: Doctor,
  };

  try {
    const user = await userModelType[req.userType].findById(req.body.userId);
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json("err logout");
  }
});

module.exports = router;
