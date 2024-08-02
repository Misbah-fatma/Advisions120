// controllers/schoolController.js

const School = require('../model/SchoolRegisterModel');

const registerSchool = async (req, res) => {
    const { name, address, email, phone } = req.body;
    const principalId = req.user._id ; 

    try {
        const newSchool = new School({ name, address, email, phone, principalId });
        await newSchool.save();
        res.status(201).json({ message: 'School registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

const getSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.status(200).json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

const updateSchool = async (req, res) => {
    try {
      const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      res.status(200).json(school);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const deleteSchool = async (req, res) => {
    try {
      const school = await School.findByIdAndDelete(req.params.id);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      res.status(200).json({ message: 'School deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    registerSchool,
    getSchools,
    updateSchool,
    deleteSchool
};



  
  // Delete a school

