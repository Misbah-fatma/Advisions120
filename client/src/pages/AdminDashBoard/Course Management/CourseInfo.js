import React, { useEffect, useState, useMemo } from "react";
import Sidebar from '../SideBar';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourseInfo, deleteCourseItem } from "../../../redux/course/courseAction";
import { Link } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { IconButton, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import EditCourseDetailsModal from './DetailsEditModeal';


const CourseInfo = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentCourseThumbnail, setCurrentCourseThumbnail] = useState("");
    const [currentCoursePdf, setCurrentCoursePdf] = useState([]);
    const [currentLecturePdf, setCurrentLecturePdf] = useState(null);
    const [openDeleteCourseDialog, setOpenDeleteCourseDialog] = useState(false);
    const [openDeleteLectureDialog, setOpenDeleteLectureDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [lectureToDelete, setLectureToDelete] = useState(null);

    const confirmDeleteoneCourse = (courseId) => {
        setCourseToDelete(courseId);
        setOpenDeleteCourseDialog(true);
        dispatch(fetchAllCourseInfo());
    };

    const confirmDeleteLecture = (lectureId) => {
        setLectureToDelete(lectureId);
        setOpenDeleteLectureDialog(true);
    };

    const handleCloseDeleteCourseDialog = () => {
        setOpenDeleteCourseDialog(false);
        setCourseToDelete(null);
    };

    const handleCloseDeleteLectureDialog = () => {
        setOpenDeleteLectureDialog(false);
        setLectureToDelete(null);
    };

    const handleconfirmDeleteoneCourse = () => {
        dispatch(deleteCourseItem(courseToDelete));
        handleCloseDeleteCourseDialog();
    };

    const handleConfirmDeleteLecture = async () => {
        try {
            const response = await axiosInstance.delete(`/lectures/${lectureToDelete}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                },
            });

            if (response.status === 200) {
                console.log("Lecture deleted successfully");
                dispatch(fetchAllCourseInfo()); // Refresh course info after deletion
            } else {
                console.error('Failed to delete lecture');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        handleCloseDeleteLectureDialog();
    };


    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            setUserData(JSON.parse(userDataFromStorage));
        }
    }, []);

    const userId = userData ? userData._id : null;
    const courseData = useSelector((state) => state.course.courseInfo || []);
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    useEffect(() => {
        dispatch(fetchAllCourseInfo());
    }, [dispatch]);

    const editLectureHandler = (lecture) => {
        setCurrentLecture(lecture);
        setOpenEditDialog(true);
    };

    const editCourseHandler = (course) => {
        setCurrentCourse(course);
        setOpenEditCourseDialog(true);
    };


    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setCurrentLecture(null);
        setCurrentLecturePdf(null); // Reset lecture PDF state
    };

    const handleEditCourseDialogClose = () => {
        setOpenEditCourseDialog(false);
        setCurrentCourse(null);
    };

    const handleLectureSave = async () => {
        try {
            const formData = new FormData();
            formData.append("title", currentLecture.title);
            formData.append("description", currentLecture.description);
            formData.append("videoUrl", currentLecture.videoUrl);
            if (currentLecturePdf) {
                formData.append("pdf", currentLecturePdf);
            }

            const response = await axiosInstance.put(`/lectures/${currentLecture._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                },
            });

            if (response.status === 200) {
                const updatedLecture = response.data;
                setCurrentLecture(updatedLecture);
                handleEditDialogClose();
                dispatch(fetchAllCourseInfo()); // Refresh course info after update
            } else {
                console.error('Failed to update lecture');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCourseSave = async () => {
        try {
            const formData = new FormData();
            formData.append("courseName", currentCourse.courseName);
            formData.append("courseDescription", currentCourse.courseDescription);
            formData.append("coursePrice", currentCourse.coursePrice);
            formData.append("courseLink", currentCourse.courseLink);
            if (currentCourseThumbnail) {
                formData.append("courseThumbnail", currentCourseThumbnail);
            }
            for (let i = 0; i < currentCoursePdf.length; i++) {
                formData.append("coursePdf", currentCoursePdf[i]);
            }

            const response = await axiosInstance.put(`/courses/${currentCourse._id}`, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                const updatedCourse = response.data;
                setCurrentCourse(updatedCourse);
                setCurrentCourseThumbnail(""); // Reset current course thumbnail state
                setCurrentCoursePdf([]); // Reset current course PDF state
                handleEditCourseDialogClose();
                dispatch(fetchAllCourseInfo()); // Refresh course info after update
            } else {
                console.error('Failed to update course');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]; // Assuming single file upload
        setCurrentCourseThumbnail(file);
    };

    const handlePdfChange = (e) => {
        const files = e.target.files;
        setCurrentCoursePdf([...files]);
    };

    const handleLecturePdfChange = (e) => {
        const file = e.target.files[0];
        setCurrentLecturePdf(file);
    };

    const handleLectureChange = (e) => {
        const { name, value } = e.target;
        setCurrentLecture(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prevState => ({ ...prevState, [name]: value }));
    };


    const [expandedCourses, setExpandedCourses] = useState({});

    const toggleExpandCourse = (courseId) => {
        setExpandedCourses((prevExpanded) => ({
            ...prevExpanded,
            [courseId]: !prevExpanded[courseId],
        }));
    };
    const [openModal, setOpenModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const handleEditDetails = (courseId) => {
        setSelectedCourseId(courseId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCourseId(null);
    };

    const handleSaveDetails = (updatedDetails) => {
        dispatch(fetchAllCourseInfo());
        console.log('Updated details:', updatedDetails);
    };


    return (
        <div>
            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
                <div className="app-main">
                    <Sidebar />
                    <div className="app-main-outer">
                        <div className="app-main-inner">
                            <div className="page-title-actions px-3 d-flex">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Course</li>
                                    </ol>
                                </nav>
                                <div className="ms-auto mb-3">
                                    <Link to="/newteachercourses" className="btn-shadow mr-3 btn btn-dark ms-auto">
                                        + New Course
                                    </Link>
                                </div>
                            </div>

                            <div className="row" id="deleteTableItem">
                                <div className="col-md-12">
                                    <div className="card mb-5">
                                        <div className="card-body">
                                            <TableContainer component={Paper} sx={{ marginTop: 3, marginBottom: 6 }}>
                                                <Table aria-label="course table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell style={{ width: '20px' }}><strong>Course</strong></TableCell>

                                                            <TableCell><strong>Description</strong></TableCell>
                                                            <TableCell><strong>Price</strong></TableCell>
                                                            <TableCell><strong>Creator</strong></TableCell>
                                                            <TableCell><strong> Link</strong></TableCell>
                                                            <TableCell style={{ width: '130px' }}><strong>View Pdf </strong></TableCell>
                                                            <TableCell style={{ width: '130px' }}><strong>Add Lectures</strong></TableCell>
                                                            <TableCell style={{ width: '130px' }}><strong> Action</strong></TableCell>
                                                            <TableCell><strong> Show</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {courseData.map((course) => (
                                                            <React.Fragment key={course._id}>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <div className="listproduct-section">
                                                                            <div className="listproducts-image">
                                                                                <img
                                                                                    style={{ height: '40px', width: '60px', objectFit: 'contain' }}
                                                                                    src={course.courseThumbnail}
                                                                                    alt=""
                                                                                />
                                                                            </div>
                                                                            <div className="product-pera">
                                                                                <p>{course.courseName}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {course.courseDescription}
                                                                    </TableCell>
                                                                    <TableCell>{course.coursePrice}</TableCell>
                                                                    <TableCell>{course.teacher?.userName}</TableCell>
                                                                    <TableCell><a href={course.courseLink}>Course Link</a></TableCell>
                                                                    <TableCell><a href={course.coursePdf}>Pdf Url</a></TableCell>
                                                                    <TableCell>
                                                                        <div className="action-icon">
                                                                            <Link to={`/createAdminLectures/`} state={course._id} title="Edit Course">
                                                                                Add Lectures
                                                                            </Link>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="action-icon" style={{ display: 'flex' }}>
                                                                            <IconButton onClick={() => confirmDeleteoneCourse(course._id)}>
                                                                                <DeleteIcon style={{ color: 'red' }} />
                                                                            </IconButton>
                                                                            <IconButton onClick={() => editCourseHandler(course)}>
                                                                                <EditIcon color="primary" />
                                                                            </IconButton>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <div className="action-icon">
                                                                            <Button onClick={() => toggleExpandCourse(course._id)}>
                                                                                {expandedCourses[course._id] ? 'Hide Details' : 'Show Details & Lectures'}
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {expandedCourses[course._id] && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={8}>
                                                                            <div>
                                                                                {/* Lectures Table */}
                                                                                <Typography variant="h6" gutterBottom>Lectures</Typography>
                                                                                <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                                                                                    {course.lectures.map((lecture, index) => (
                                                                                        <Accordion key={index}>
                                                                                            <AccordionSummary
                                                                                                expandIcon={<ExpandMoreIcon />}
                                                                                                aria-controls={`panel${index}-content`}
                                                                                                id={`panel${index}-header`}
                                                                                            >
                                                                                                <Typography>{lecture.title}</Typography>
                                                                                            </AccordionSummary>
                                                                                            <AccordionDetails>
                                                                                                <Table>
                                                                                                    <TableHead>
                                                                                                        <TableRow>
                                                                                                            <TableCell>Description</TableCell>
                                                                                                            <TableCell>Video URL</TableCell>
                                                                                                            <TableCell>Pdf URL</TableCell>
                                                                                                            <TableCell>Edit</TableCell>
                                                                                                            <TableCell>Delete</TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableHead>
                                                                                                    <TableBody>
                                                                                                        <TableRow>
                                                                                                            <TableCell>{lecture.description}</TableCell>
                                                                                                            <TableCell><a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer">{lecture.videoUrl}</a></TableCell>
                                                                                                            <TableCell><a href={lecture.pdfUrl}>Pdf Url</a></TableCell>
                                                                                                            <TableCell>
                                                                                                                <IconButton onClick={() => editLectureHandler(lecture)}>
                                                                                                                    <EditIcon color="primary" />
                                                                                                                </IconButton>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <IconButton onClick={() => confirmDeleteLecture(lecture._id)}>
                                                                                                                    <DeleteIcon style={{ color: 'red' }} />
                                                                                                                </IconButton>
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </AccordionDetails>
                                                                                        </Accordion>
                                                                                    ))}
                                                                                </TableContainer>

                                                                                {/* Course Details */}
                                                                                <Typography variant="h6" gutterBottom>Course Details</Typography>
                                                                                <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                                                                                    <Table>
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                                <TableCell>Title</TableCell>
                                                                                                <TableCell>Description</TableCell>
                                                                                                <TableCell>Features</TableCell>
                                                                                                <TableCell>Overview</TableCell>
                                                                                                <TableCell>Actions</TableCell>
                                                                                                <TableCell>Cards</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            <TableRow>
                                                                                                <TableCell>{course.details?.title || 'N/A'}</TableCell>
                                                                                                <TableCell>{course.details?.text || 'N/A'}</TableCell>
                                                                                                <TableCell>
                                                                                                    {course.details?.features
                                                                                                        ? course.details.features.split(' ').slice(0, 30).join(' ') + (course.details.features.split(' ').length > 30 ? '...' : '')
                                                                                                        : 'N/A'}
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    {course.details?.overview
                                                                                                        ? course.details.overview.split(' ').slice(0, 30).join(' ') + (course.details.overview.split(' ').length > 30 ? '...' : '')
                                                                                                        : 'N/A'}
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <Button onClick={() => handleEditDetails(course._id)}>Edit/Add Details</Button>
                                                                                                </TableCell>
                                                                                                <TableCell>{course.details?.cards?.length > 0 ? 'See below' : 'No Cards'}</TableCell>
                                                                                            </TableRow>
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>

                                                                                {Array.isArray(course.details?.cards) && course.details.cards.length > 0 && (
                                                                                    <>
                                                                                        <Typography variant="h6" gutterBottom>Card Details</Typography>
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table>
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell>Card Icon</TableCell>
                                                                                                        <TableCell>Card Heading</TableCell>
                                                                                                        <TableCell>Card Description</TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    {course.details.cards.map((card, index) => (
                                                                                                        <TableRow key={index}>
                                                                                                            <TableCell>
                                                                                                                <i className={card.icon} style={{ width: '30px', height: '30px' }}></i>
                                                                                                            </TableCell>
                                                                                                            <TableCell>{card.heading}</TableCell>
                                                                                                            <TableCell>{card.description}</TableCell>
                                                                                                        </TableRow>
                                                                                                    ))}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {currentLecture && (
                <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                    <DialogTitle>Edit Lecture</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please update the lecture details.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            value={currentLecture.title}
                            onChange={handleLectureChange}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            value={currentLecture.description}
                            onChange={handleLectureChange}
                        />
                        <TextField
                            margin="dense"
                            name="videoUrl"
                            label="Video URL"
                            type="text"
                            fullWidth
                            value={currentLecture.videoUrl}
                            onChange={handleLectureChange}
                        />
                        <input
                            type="file"
                            className="form-control"
                            name="lecturePdf"
                            onChange={handleLecturePdfChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleLectureSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {currentCourse && (
                <Dialog open={openEditCourseDialog} onClose={handleEditCourseDialogClose}>
                    <DialogTitle>Edit Course</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please update the course details.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="courseName"
                            label="Course Name"
                            type="text"
                            fullWidth
                            value={currentCourse.courseName}
                            onChange={handleCourseChange}
                        />
                        <TextField
                            margin="dense"
                            name="courseDescription"
                            label="Course Description"
                            type="text"
                            fullWidth
                            value={currentCourse.courseDescription}
                            onChange={handleCourseChange}
                        />
                        <TextField
                            margin="dense"
                            name="coursePrice"
                            label="Course Price"
                            type="number"
                            fullWidth
                            value={currentCourse.coursePrice}
                            onChange={handleCourseChange}
                        />
                        <TextField
                            margin="dense"
                            name="courseLink"
                            label="Course Link"
                            type="text"
                            fullWidth
                            value={currentCourse.courseLink}
                            onChange={handleCourseChange}
                        />
                        <input
                            type="file"
                            className="form-control"
                            name="courseThumbnail"
                            onChange={handleThumbnailChange}
                        />
                        <input
                            type="file"
                            className="form-control"
                            name="coursePdf"
                            multiple
                            onChange={handlePdfChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditCourseDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleCourseSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Dialog open={openDeleteCourseDialog} onClose={handleCloseDeleteCourseDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this course?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteCourseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleconfirmDeleteoneCourse} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteLectureDialog} onClose={handleCloseDeleteLectureDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this lecture?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteLectureDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeleteLecture} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <EditCourseDetailsModal
                open={openModal}
                onClose={handleCloseModal}
                courseId={selectedCourseId}
                onSave={handleSaveDetails}
            />

        </div>
    );
}

export default CourseInfo;