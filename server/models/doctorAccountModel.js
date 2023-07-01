const mongoose = require('mongoose');

const doctorAccountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    logDoctor: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    seenNotification: {
      type: Array,
      default: [],
    },
    unseenNotification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const doctorAccountModel = mongoose.model('doctorAccount', doctorAccountSchema);

module.exports = doctorAccountModel;
