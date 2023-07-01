const mongoose = require('mongoose');

const clinicService = mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
    required: true,
  },
});

const clinicServiceModel = mongoose.model('ClinicService', clinicService);

module.exports = clinicServiceModel;
