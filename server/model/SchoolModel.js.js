// models/SchoolRegistration.js
const mongoose = require('mongoose');

// Define the schema for School Registration
const schoolRegistrationSchema = new mongoose.Schema({
  school_name: { type: String, required: true },
  school_address: { type: String, required: true },
  school_email: { type: String, required: true },
  school_phone: { type: String, required: true },
  school_info: { type: String },
  Principal_name: { type: String, required: true },
  gender: { type: String, required: true },
  Principal_phone: { type: String, required: true },
  Principal_email: { type: String, required: true },
  Principal_password: { type: String, required: true },
  school_address_file: { type: String, required: true }, // URL from Cloudinary
});

// Create and export the model
module.exports = mongoose.model('SchoolRegistration', schoolRegistrationSchema);
