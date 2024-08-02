const {
  login__controller,
  register__controller,
  details__controller,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const registerValidator = require("../middlewares/registerValidator");
const loginValidator = require("../middlewares/loginValidator");
const UserModel = require("../model/UserModel");
const router = require("express").Router();

// Login route
router.post("/login", loginValidator.login_validator, login__controller);

// Register route
router.post("/register", registerValidator.register_validator, register__controller);

// Details route for creating user details
router.post('/details', details__controller);

// Update user details by ID
router.put('/details/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      address,
      description,
      links,
      identityVerifications,
      phoneNumber,
      schoolName,
      studentClass
    } = req.body;

    // Find the user by ID
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.address = address;
    user.description = description;
    user.links = links;
    user.identityVerifications = identityVerifications;
    user.phoneNumber = phoneNumber;
    user.schoolName = schoolName;
    user.studentClass = studentClass;

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user details by ID
router.get('/details/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user details (duplicate put route removed)
router.put('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;
    const user = await UserModel.findByIdAndUpdate(id, updatedDetails, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(400).send('Error updating user details');
  }
});

router.post('/reset-password', resetPassword);
const PendingRequestModel = require('../model/PendingRequestModel');


router.post('/notify', async (req, res) => {
  const { userId, schoolId } = req.body;

  try {
    // Save the request in a PendingRequest collection
    const pendingRequest = new PendingRequestModel({
      userId,
      schoolId,
      status: 'Pending' // or any other status you prefer
    });
    await pendingRequest.save();

    // Optionally, send an email or another form of notification
    // e.g., sendEmailToPrincipal(schoolId);

    res.status(200).send({ message: 'Notification sent to principal.' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to send notification.', error });
  }
});

// In the same routes/principal.js
router.get('/pending-requests', async (req, res) => {
  try {
    const pendingRequests = await PendingRequestModel.find({ status: 'Pending' }).populate('userId schoolId');
    res.status(200).send(pendingRequests);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching pending requests.', error });
  }
});

router.post('/approve', async (req, res) => {
  const { requestId } = req.body;

  try {
    const pendingRequest = await PendingRequestModel.findById(requestId).populate('schoolId');
    if (pendingRequest) {
      pendingRequest.status = 'Approved';
      await pendingRequest.save();

      // Update the student's schoolName and status
      const user = await UserModel.findById(pendingRequest.userId);
      if (user) {
        user.schoolName = pendingRequest.schoolId.school_name;
        user.status = 'Active';
        await user.save();
      }

      res.status(200).send({ message: 'Request approved successfully.' });
    } else {
      res.status(404).send({ message: 'Request not found.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error approving request.', error });
  }
});


router.post('/reject', async (req, res) => {
  const { requestId } = req.body;

  try {
    const pendingRequest = await PendingRequestModel.findById(requestId);
    if (pendingRequest) {
      pendingRequest.status = 'Rejected';
      await pendingRequest.save();

      // Optionally, inform the student about the rejection

      res.status(200).send({ message: 'Request rejected successfully.' });
    } else {
      res.status(404).send({ message: 'Request not found.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error rejecting request.', error });
  }
});

module.exports = router;
