// controllers/teacherController.js
const Teacher = require('../model/TeacherModel');


exports.registerTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, phoneNumber, gender } = req.body;
    const idProof = req.file ? req.file.path : null;

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password


    // Create a new teacher
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      gender,
      idProof
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
