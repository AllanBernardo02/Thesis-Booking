const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: "string",
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    selectedFile: {
      type: String,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isApplyDoctor: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
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

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
