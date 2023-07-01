const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    lastname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    civilStatus: {
      type: String,
      // required: true,
    },
    gender: {
      type: String,
      required: true,
      enums: ["male", "female"],
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    birthPlace: {
      type: String,
      // required: true,
    },
    seenNotification: {
      type: Array,
      default: [],
    },
    unseenNotification: {
      type: Array,
      default: [],
    },
    agreeToTerms: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

patientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

patientSchema.methods.getProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
