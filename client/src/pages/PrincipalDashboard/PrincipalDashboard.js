import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourseInfo } from "../../redux/course/courseAction";
import SideBar from './SideBar';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  TablePagination,
  Snackbar,
  Alert,
  Container,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid
} from "@mui/material";
import { Bar, Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard3 = () => {
  const courseData = useSelector((state) => state.course.courseInfo);
  const [data, setData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [principal, setPrincipal] = useState([]);
  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ userName: "", email: "" });
  const [schoolName, setSchoolName] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCourseInfo());
  }, [dispatch]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
  }, []);

  const email = userData?.email;

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosInstance.get('/schoolRegistration/list');
        const schoolsData = response.data;
        const school = schoolsData.find(school => school.Principal_email === email);
        if (school) {
          setSchools([school]);
          setSchoolName(school.school_name);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    if (email) {
      fetchSchools();
    }
  }, [email]);

  useEffect(() => {
    if (schoolName) {
      fetchStudentData();
      fetchTeacherData();
    }
  }, [schoolName]);

  const fetchStudentData = async () => {
    try {
      const response = await axiosInstance.get('/users/student', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const filteredStudents = response.data.studentInfo.filter(student => student.schoolName === schoolName);
      setStudentData(filteredStudents);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const response = await axiosInstance.get("/users/teacher", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const filteredTeachers = response.data.teacherInfo.filter(teacher => teacher.schoolName === schoolName);
      setTeacherData(filteredTeachers);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  const fetchUserCounts = async () => {
    try {
      const response = await axiosInstance.get("/users/principal", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const studentsCount = response.data.studentInfo.length;
      const teachersCount = response.data.teacherInfo.length;

      setData(response.data.principalInfo);
      setStudents(studentsCount);
      setTeachers(teachersCount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchPrincipals = async () => {
    try {
      const response = await axiosInstance.get("/users/allprincipal", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setPrincipal(response.data.studentInfo.length);
    } catch (error) {
      console.error("Error fetching principals:", error);
    }
  };

  const fetchSchoolsData = async () => {
    try {
      const response = await axiosInstance.get('/schoolRegistration/list');
      setSchoolData(response.data); // Storing school data
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchPrincipals();
    fetchUserCounts();
    fetchSchoolsData();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ userName: student.userName, email: student.email });
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/users/principal/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setStudentData(studentData.filter((student) => student._id !== id));
      setStudents(students - 1); // Decrement the student count
      setSnackbarMessage("Student deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error deleting student");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedStudent = await axiosInstance.put(`/users/principal/${selectedStudent._id}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setStudentData(studentData.map((student) => (student._id === selectedStudent._id ? updatedStudent.data : student)));
      setSnackbarMessage("Student updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbarMessage("Error updating student");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const chartData = {
    labels: ['Students', 'Teachers', 'Principal', 'Courses'],
    datasets: [
      {
        label: '# of Users/Courses',
        data: [students, teachers, 1, courseData.length], // Including courses data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const lineData = {
    labels: ['Students', 'Teachers', 'Principal', 'Courses'],
    datasets: [
      {
        label: 'User/Course Created',
        data: [students, teachers, 1, courseData.length], // Including courses data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieData = {
    labels: ['Students', 'Teachers', 'Principal', 'Courses'],
    datasets: [
      {
        label: 'User/Course Distribution',
        data: [students, teachers, 1, courseData.length], // Including courses data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
<div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
        <div className="app-main">
          <SideBar />
          <div className="col mt-4">
          <div className="row">
              
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-midnight-bloom">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Courses</div>
                        <div className="widget-subheading">Number of total active courses</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span style={{ margin: "60px" }}>{courseData.length}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-arielle-smile">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Teacher</div>
                        <div className="widget-subheading">Number of Teachers enrolled</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span style={{ margin: "60px" }}>{teachers}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-grow-early">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Students</div>
                        <div className="widget-subheading">Number of Students enrolled</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span style={{ margin: "60px" }}>{studentData.length}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-night-fade">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Principals</div>
                        <div className="widget-subheading">Number of Principals enrolled</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span style={{ margin: "60px" }}>{principal}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-arielle-smile">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Reviews</div>
                        <div className="widget-subheading">Total submitted reviews</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span style={{ margin: "60px" }}>0</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card mb-3 widget-content bg-premium-dark">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div className="widget-heading">Transaction</div>
                        <div className="widget-subheading">Total transaction amount</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-warning"><span style={{ margin: "60px" }}>$0</span></div>
                      </div>
                    </div>
                  </div>
                </div>
          
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="card mb-5">
                    <div className="card-body">

                    <h4 className="mb-2 text-center">Students of the {schoolName}</h4>
                    <div className="table-responsive-lg">   
            <table className="table table-bordered">
              <thead>
              <tr className="text-center">
                              <th scope="col">User Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Class</th>
                              <th scope="col">Purchased Courses</th>
                              <th scope="col">Created At</th>
                              <th scope="col">Status</th>

                            </tr>
              </thead>
              <tbody className="text-center">
                {studentData.map((student) => (
                    <tr key={student._id}>
                    <td>{student.userName}</td>
                    <td>{student.email}</td>
                    <td>{student.studentClass}</td>
                    <td>{student.purchasedCourses ? student.purchasedCourses.length : 0}</td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="statusItem">
                        <div className="circleDot animatedCompleted"></div>
                        <div className="statusText">
                          <span className="stutsCompleted">Active</span>
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="card mb-5">
                    <div className="card-body">
            <h4 className="mb-2 text-center">Teachers of the {schoolName}</h4>
            <div className="table-responsive-lg">
            <table className="table table-bordered">
              <thead>
              <tr className="text-center">
                              <th scope="col">Teacher Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Class</th>

                              <th scope="col">Created At</th>
                              <th scope="col">Status</th>

                            </tr>
              </thead>
              <tbody className="text-center">
                {teacherData.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>{teacher.userName}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.studentClass}</td>
                                {/* <td>{student.purchasedCourses ? student.purchasedCourses.length : 0}</td> */}
                                <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="statusItem">
                                    <div className="circleDot animatedCompleted"></div>
                                    <div className="statusText">
                                      <span className="stutsCompleted">Active</span>
                                    </div>
                                  </div>
                                </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div className="row">
                        <div className="col-md-6 mb-5">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Teacher, Student, and Course Overview (Bar Chart)</h5>
                                    <div className="chart-container" style={{ position: 'relative', height: '40vh' }}>
                                        <Bar data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-5">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Teacher, Student, and Course Overview (Line Chart)</h5>
                                    <div className="chart-container" style={{ position: 'relative', height: '40vh' }}>
                                        <Line data={lineData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
          </div>
        </div>
   

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Student/Teacher</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            value={editForm.userName}
            onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>

    </div>

  );
};

export default Dashboard3;
