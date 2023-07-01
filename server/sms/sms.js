const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const app = express();
const router = express.Router();
const doctorModel = require('../models/doctor.model.js');
app.use(express.json());

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const numbersToMessage = [
  '+639913688280',
  '+639552814152',
  '+639482393588',
  '+639053323518',
];

// router.get("/book-appointment", authMiddleware, (req, res) => {
//   const { phoneNumber } = req.body;
//   console.log(phoneNumber);

//   client.messages
//     .create({
//       body: "SMS NOTIFICATION SUCCESSFUL",
//       from: "+13253269420",
//       to: phoneNumber,
//     })
//     .then((message) => console.log(message))
//     .catch((err) => console.log(err));
// });

// const message = (req, res, next) => {
//   router;
//   next();
// };

const tama = () => {
  numbersToMessage.forEach(function (number) {
    client.messages
      .create({
        body: 'Uwi kana hindi na ako galit, Miss na kita',
        from: '+13253269420',
        to: number,
      })
      .then((message) => console.log(message));
  });
};

const message = async (req, res, next) => {
  tama();
  next();
};

// const message = async (req, res, next) => {
//   client.messages
//     .create({
//       body: "Please tell some doctors that have new appointment",
//       from: "+13253269420",
//       to: numbersToMessage,
//     })
//     .then((message) => console.log(message));
//   next();
// };

module.exports = message;
