const mongoose = require("mongoose");

const menuColorSchema = new mongoose.Schema(
  {
    selectedFile: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const Customization = mongoose.model("Customization", menuColorSchema);

module.exports = Customization;
