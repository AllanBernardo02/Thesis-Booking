const { Schema, Types, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enums: ["pending", "approved", "blocked"],
      default: "approved",
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      // required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    feeConsultation: {
      type: Number,
      // required: true,
    },
    shift: {
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    notifications: [
      {
        status: {
          type: String,
          default: "unseen",
        },
        message: {
          type: String,
        },
      },
    ],
    seenNotification: {
      type: Array,
      default: [],
    },
    unseenNotification: {
      type: Array,
      default: [],
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    schedules: [
      {
        date: {
          type: Date,
        },
        time: [],
        occoupied: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

doctorSchema.methods.getProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const doctorModel = model("Doctor", doctorSchema);

module.exports = doctorModel;
