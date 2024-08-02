// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary=require('../middlewares/cloudinary');
const Teacher = require("../model/TeacherModel");

router.post('/register', upload.single('school_address_file'), async (req, res) => {
    try {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'teacher_files',
      });
  
      // Create new teacher document with file URL
      const newTeacher = new Teacher({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        idProof: result.secure_url, // Store the URL from Cloudinary
      });
  
      // Save the teacher document to the database
      await newTeacher.save();
      res.status(201).json({ message: 'Registration successful!', teacher: newTeacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error during registration.' });
    }
  });

  router.get('/data', async (req, res) => {
    try {
      const teachers = await Teacher.find(); // Assuming you are using Mongoose
      res.json(teachers);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedTeacher);
    } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Route to delete teacher data
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Teacher.findByIdAndDelete(id);
      res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



module.exports = router;
