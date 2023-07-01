const express = require("express");
const ChatModel = require("../models/chatModel.js");
const doctorAccountModel = require("../models/doctorAccountModel.js");
const userModel = require("../models/doctor.model.js");
const Patient = require("../models/patientModel.js");
const doctorModel = require("../models/doctor.model.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;
  const chatExists = await ChatModel.findOne({
    members: [senderId, receiverId],
  });
  if (chatExists) {
    return res
      .status(200)
      .send({ message: "chat already exists", success: false });
  }
  const newChat = new ChatModel({
    members: [senderId, receiverId],
  });
  // console.log('bads', { ...req.body });
  // const userExists = await userModel.findOne({ name: req.body.name });
  // console.log(userExists.name);
  // console.log("One", newChat.members[1]);
  // if (userExists.name === newChat.members[1]) {

  console.log("chat", chatExists);
  try {
    // if (newChat) {
    //   return res
    //     .status(200)
    //     .send({ message: "chat already exists", success: false });
    // }
    const result = await newChat.save();
    res.status(200).send({
      message: "messsage created successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
  // }
});

router.get("/:userId", async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    // res.status(200).send({
    //   message: "Message was fetched successfully",
    //   success: true,
    //   data: chat,
    // });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:firstId/:secondId", async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).send({ chat });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user =
      (await Patient.findById(id)) || (await doctorModel.findById(id));

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
