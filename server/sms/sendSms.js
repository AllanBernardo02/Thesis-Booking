const axios = require('axios');
require('dotenv').config();

exports.sendSms = async (patients) => {
  const API_KEY = process.env.SMS_KEY;
  const url = process.env.SEMAPHORE_URL;

  for (const patient of patients) {
    const { phoneNumber, time, fullName } = patient;
    const message = `Dear ${fullName}, this is a reminder that you have an appointment today at StarWheal Medical Clinic at ${time}. Please arrive 10-15 minutes early to allow for check-in procedures. We look forward to seeing you!`;

    try {
      const response = await axios.post(url, {
        apikey: API_KEY,
        number: phoneNumber,
        message: message,
      });
      console.log(response.data);
    } catch (error) {
      console.error(
        `Error sending appointment message to ${fullName} (${phoneNumber}): ${error.message}`
      );
    }
  }
};
