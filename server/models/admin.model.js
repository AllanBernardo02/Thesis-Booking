const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  clinicServices: [
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  profileImage: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

adminSchema.methods.getProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;
