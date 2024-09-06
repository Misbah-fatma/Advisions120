const {
  postCourse__controller,
  getCourses__controller,
  getOneCourse__controller,
  deleteCourse__Controller,
  getAllData,
  getItems__controller,
  updateCourse,
  getCoursesByUserId,
  createLectures,
  updateLecture,
  deleteLecture,
  getCoursesWithDetails

} = require("../controllers/courseController");

const { adminAuthentication } = require("../middlewares/authentication");
const { requireLogin } = require("../middlewares/requireLogin");
const User = require("../model/UserModel");
const Course = require("../model/CourseModel");
const DetailsCourses  = require("../model/DetailsCoursesModel");
const router = require("express").Router();
const upload = require("../middlewares/multer");
const cloudinary=require('../middlewares/cloudinary');


router.post(
  "/post-course",
  (req, res, next) => {
    const lectureFields = Array.from({ length: 10 }, (_, i) => ({
      name: `lecturePdf-${i}`, maxCount: 1
    }));
    upload.fields([
      { name: 'img', maxCount: 1 },
      { name: 'pdf', maxCount: 3 },
      ...lectureFields
    ])(req, res, function (err) {
      if (err) {
        // Multer error
        console.error('Multer error3:', err);
        return res.status(500).json({ error: 'File upload error' });
      }
      // No Multer error, proceed to next middleware
      next();
    });
  },
requireLogin,
  postCourse__controller
);

router.get("/get-data-courses", getCourses__controller);

router.post("/data-courses", getItems__controller);

router.get("/get-courses", getAllData);

router.get("/get-course/:courseId",requireLogin, getOneCourse__controller);

router.delete('/delete', requireLogin, deleteCourse__Controller);

router.put('/updateCourse', 
updateCourse
);

router.get('/getCourse', async (req, res) => {
  try {
      const course = await Course.findOne(); // Fetch a single course document
      res.json(course);
  } catch (error) {
      res.status(500).send('Error fetching course data');
  }
});

router.get('/get-teacher-courses',requireLogin, getCoursesByUserId);

router.post('/courses/:courseId/lectures', requireLogin, upload.array('pdfFiles'), createLectures);


router.put('/lectures/:lectureId',requireLogin,  upload.single('pdf'), updateLecture);

router.delete('/lectures/:lectureId',requireLogin, deleteLecture);

router.get('/api/user/:userId/courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('courses');
    res.json(user.courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user courses' });
  }
});


router.put('/courses/:id', upload.fields([{ name: 'courseThumbnail', maxCount: 1 },
   { name: 'coursePdf', maxCount: 3 }]), async (req, res) => {
  const { courseName, courseDescription, coursePrice, courseLink } = req.body;

  try {
      // Find the course by ID
      let course = await Course.findById(req.params.id);
      if (!course) {
          return res.status(404).json({ msg: 'Course not found' });
      }

      // Update the course fields
      course.courseName = courseName;
      course.courseDescription = courseDescription;
      course.coursePrice = coursePrice;
      course.courseLink = courseLink;

      if (req.files) {
          if (req.files.courseThumbnail) {
              const imgFile = req.files.courseThumbnail[0];
              // Upload new courseThumbnail to Cloudinary
              const img = await cloudinary.uploader.upload(imgFile.path);
              course.courseThumbnail = img.secure_url;
          }

          if (req.files.coursePdf) {
              const pdfFiles = req.files.coursePdf;
              // Upload new PDFs to Cloudinary
              const pdfUrls = await Promise.all(pdfFiles.map(async (file) => {
                  const pdf = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' });
                  return pdf.secure_url;
              }));

              // Join the URLs into a single string, separated by commas
              course.coursePdf = pdfUrls.join(',');
          }
      }

      // Save the updated course
      await course.save();

      // Return the updated course
      res.json(course);
  } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Course not found' });
      }
      res.status(500).send('Server Error');
  }
});

router.get('/api/purchasecourse/:courseId',requireLogin, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    console.log('Received courseId:', courseId);
    const course = await Course.findById(req.params.courseId).populate('lectures');
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.json(course);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.get('/getcoursedetails/:id', async (req, res) => {
  try {
      const courseid = req.params.id;
      const course = await Course.findById(courseid).populate('details'); // Assuming you populate details if it's a reference

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.json(course);
  } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.get('/courses', getCoursesWithDetails);

router.get('/:courseId', async (req, res) => {
  try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course.details || {});
  } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:courseId/details', async (req, res) => {
  try {
      const { courseId } = req.params;
      const { title, text, features, overview, cards } = req.body;

      // Find the course by ID
      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      let updatedDetails;

      // Check if course details already exist
      if (course.details) {
          // Update the existing details
          updatedDetails = await DetailsCourses.findByIdAndUpdate(
              course.details,
              { title, text, features, overview, cards },
              { new: true, runValidators: true }
          );

          if (!updatedDetails) {
              return res.status(404).json({ message: 'Details not found' });
          }
      } else {
          // Create new details and associate them with the course
          const newDetails = new DetailsCourses({ title, text, features, overview, cards });
          updatedDetails = await newDetails.save();

          // Update the course with the new details ID
          course.details = updatedDetails._id;
          await course.save();
      }

      // Respond with the updated or newly created details
      res.status(200).json(updatedDetails);
  } catch (error) {
      console.error('Error updating course details:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
