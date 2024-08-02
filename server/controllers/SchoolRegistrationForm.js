// controllers/schoolRegistrationController.js
const SchoolRegistration = require('../model/SchoolModel.js');
const cloudinary=require('../middlewares/cloudinary');

// Handle form submission
exports.createSchoolRegistration = async (req, res) => {
  try {
    const { body, file } = req;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    // Create a new school registration entry
    const newRegistration = new SchoolRegistration({
      ...body,
      school_address_file: result.secure_url, // Store the URL of the uploaded file
    });
    await newRegistration.save();

    res.status(201).send({ message: 'School registered successfully', data: newRegistration });
  } catch (error) {
    res.status(400).send({ error: 'Failed to register school', details: error.message });
  }
};
