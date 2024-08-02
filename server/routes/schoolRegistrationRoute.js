// routes/schoolRegistrationRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const cloudinary = require('../middlewares/cloudinary');
const SchoolRegistration = require('../model/SchoolModel.js');

router.post('/create', upload.single('school_address_file'), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'school_files',
    });

    // Create new school registration document with file URL
    const newSchool = new SchoolRegistration({
      school_name: req.body.school_name,
      school_address: req.body.school_address,
      school_email: req.body.school_email,
      school_phone: req.body.school_phone,
      school_info: req.body.school_info,
      Principal_name: req.body.Principal_name,
      gender: req.body.gender,
      Principal_address: req.body.Principal_address,
      Principal_phone: req.body.Principal_phone,
      Principal_email: req.body.Principal_email,
      Principal_password: req.body.Principal_password,
      school_address_file: result.secure_url, // Store the URL from Cloudinary
    });

    // Save the school registration document to the database
    await newSchool.save();
    res.status(201).json({ message: 'School registration successful!', school: newSchool });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during registration.' });
  }
});

router.get('/list', async (req, res) => {
    try {
      const schools = await SchoolRegistration.find();
      res.status(200).json(schools);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching school registrations.' });
    }
  });

  // PUT /schoolRegistration/:id
  router.put('/:id', async (req, res) => {
    try {
        const school = await SchoolRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: 'Error updating school', error });
    }
});


// DELETE /schoolRegistration/:id
router.delete('/:id', async (req, res) => {
    try {
        await SchoolRegistration.findByIdAndDelete(req.params.id);
        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting school', error });
    }
});


module.exports = router;
