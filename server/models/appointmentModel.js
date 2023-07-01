const { Schema, Types, model } = require('mongoose');

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enums: ['pending', 'approved', 'cancelled', 'done'],
    },
    clinicService: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = model('Apointment', appointmentSchema);

module.exports = appointmentModel;
