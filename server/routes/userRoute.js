const {
  getStudent__controller,
  getTeacher__controller,
  deleteTeacher__controller,
  createUser,
  updateUserRole,
  deleteUser,
  updateUserPassword,
  updateUserActiveStatus,
  createTeacherOrStudent,
  editTeacherOrStudent,
  updateTeacherOrStudentRole,
  deleteTeacherOrStudent,
  getUsers,
  getPrincipal__controller,
  getallPrincipal__controller
} = require("../controllers/userController");
const UserModel = require('../model/UserModel');
const bcrypt = require("bcryptjs");

const {
  login__controller,
  register__controller,
  details__controller,
} = require("../controllers/authController");

const registerValidator = require("../middlewares/registerValidator");
const loginValidator = require("../middlewares/loginValidator");

const { adminAuthentication, principalAuthentication, teacherAuthentication, studentAuthentication, allAuthentication } = require("../middlewares/authentication");
const { requireLogin } = require("../middlewares/requireLogin");

const router = require("express").Router();

router.get(
  "/student",
  requireLogin,
  getStudent__controller
);

router.get(
  "/teacher",
  requireLogin,
  getTeacher__controller
);

router.get(
  "/principal",
  requireLogin,
  getPrincipal__controller
);

router.get(
  "/allprincipal",
  requireLogin,
  getallPrincipal__controller
);


router.get('/users/allstudentcode', async (req, res) => {
  try {
    const users = await UserModel.find({})
      .populate('codeHistory') // if you need details of codes
      .exec();
    const students = users.map(user => ({
      ...user.toObject(),
      codeCount: user.codeHistory.length,
      roomsCreated: user.roomsCreated
    }));
    res.json({ studentInfo: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.delete('/principal/:id', requireLogin, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).send('Server error');
  }
});

// PUT /users/principal/:id
router.put('/principal/:id', requireLogin, async (req, res) => {
  try {
    const updatedStudent = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', requireLogin, async (req, res) => {
  try {
    const { userName, email, schoolName } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { userName, email, schoolName });
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student' });
  }
});


router.delete(
  "/delete-teacher",
  requireLogin,
  adminAuthentication,
  deleteTeacher__controller
);

router.post(
  '/createUser',
  requireLogin,
  adminAuthentication,
  registerValidator.register_validator,
  register__controller
);

router.put(
  '/updateRole', 
  requireLogin,

  updateUserRole
);

router.put(
  '/updatePassword', 
  requireLogin,
  updateUserPassword
);

router.delete(
  '/:userId', 
  requireLogin,
  adminAuthentication,
  deleteUser
);

router.put(
  '/:id/active', 
  requireLogin,
  updateUserActiveStatus
);

// Principal specific routes
router.post(
  '/principal/createTeacherOrStudent',
  requireLogin,
  principalAuthentication,
  registerValidator.register_validator,
  createTeacherOrStudent
);

router.put(
  '/principal/editTeacherOrStudent/:userId',
  requireLogin,
  principalAuthentication,
  editTeacherOrStudent
);

router.put(
  '/principal/updateTeacherOrStudentRole',
  requireLogin,

  updateTeacherOrStudentRole
);

router.delete(
  '/principal/deleteTeacherOrStudent/:userId',
  requireLogin,
  principalAuthentication,
  deleteTeacherOrStudent
);

router.get('/getusers', getUsers);

router.put('/principal/updateTeacherOrStudent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { userName, email, password:hash , role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// User's code history route
router.get('/user/history', requireLogin, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const user = await UserModel.findById(userId).populate('codeHistory');
    res.json({ files: user.codeHistory.map(code => code.fileName) });
  } catch (error) {
    console.error('Error fetching user code history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
