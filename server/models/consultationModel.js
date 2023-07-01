const mongoose = require("mongoose");

const consultationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    consultationName: {
      type: String,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    temparature: {
      type: String,
      required: true,
    },
    pulseRate: {
      type: String,
      required: true,
    },
    twoSaturation: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    respiratoryRate: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const consultationModel = mongoose.model(
  "patientConsultation",
  consultationSchema
);

module.exports = consultationModel;
