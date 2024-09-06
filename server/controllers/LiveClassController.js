// controllers/liveClassController.js
const LiveClass = require('../model/LiveClass');

exports.createLiveClass = async (req, res) => {
    try {
      const { title, link, dateTime, teacherId, role } = req.body;
 
      // Save the live class details in the database
      const newLiveClass = new LiveClass({
        title,
        dateTime,
        teacherId,
        link ,
        role
      });
  
      await newLiveClass.save();
  
      res.status(201).json({ message: 'Live class created', link });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create live class', error });
    }
  };

exports.getLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({}).exec();
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
