const express = require('express');
const { createMeeting } = require('../BB');

const router = express.Router();

// Route to create a meeting and return join links
router.post('/create', async (req, res) => {
  const { meetingID, meetingName } = req.body;
  const result = await createMeeting(meetingID, meetingName);

  if (result.success) {
    res.json({
      message: result.message,
      joinAsModerator: result.joinAsModerator,
      joinAsAttendee: result.joinAsAttendee,
    });
  } else {
    res.status(500).json({ message: result.message });
  }
});

module.exports = router;
