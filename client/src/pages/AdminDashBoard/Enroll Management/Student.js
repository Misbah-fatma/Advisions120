import React, { useEffect, useState } from "react";
import Sidebar from '../SideBar';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Snackbar, Alert, Box, Typography, Modal, TextField, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const StudentList = () => {
  const [data, setData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const userList = async () => {
    try {
      const user = await axiosInstance.get("/users/student", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      });
      setData(user.data.studentInfo);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    userList();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Do you want to delete?")) {
      try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        setSnackbarMessage("Student deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        userList();
      } catch (error) {
        setSnackbarMessage("Failed to delete student");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditUser = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEditSubmit = async () => {
    try {
      await axiosInstance.put(`/users/${selectedStudent._id}`, selectedStudent,{
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      });
      setSnackbarMessage("Student updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditModalOpen(false);
      userList();
    } catch (error) {
      setSnackbarMessage("Failed to update student");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleShow = (student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedStudent(null);
  };

  const columns = [
    { field: 'userName', headerName: 'Student', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'schoolName', headerName: 'School Name', width: 200 },
    { field: 'updatedAt', headerName: 'Last Activity', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div className="statusItem">
          <div className="circleDot animatedCompleted"></div>
          <div className="statusText">
            <span className="stutsCompleted">{params.row.active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleDeleteUser(params.row._id)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleEditUser(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <Typography variant="body2" component="a" href="#" onClick={() => handleShow(params.row)}>
            Details
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
      <div className="app-main">
        <Sidebar />
        <div className="col mt-4">
        <div className="row">
            <div className="page-title-actions px-3 d-flex">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Enrollment</li>
                </ol>
              </nav>
            </div>
            <div className="row" id="deleteTableItem">
              <div className="col-md-12">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="table-responsive-lg">
                      <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row._id}
                      />
                    </div>
                  </div>
                </div>
                <Modal open={editModalOpen} onClose={handleEditModalClose}>
                  <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
                    <Typography variant="h6" component="h2">Edit Student</Typography>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Student Name"
                      name="userName"
                      value={selectedStudent?.userName || ""}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Email"
                      name="email"
                      value={selectedStudent?.email || ""}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="School Name"
                      name="schoolName"
                      value={selectedStudent?.schoolName || ""}
                      onChange={handleInputChange}
                    />
                    <Box mt={2}>
                      <Button variant="contained" color="primary" onClick={handleEditSubmit}>Save</Button>
                      <Button variant="outlined" color="secondary" onClick={handleEditModalClose} sx={{ ml: 2 }}>Cancel</Button>
                    </Box>
                  </Box>
                </Modal>
                <Modal open={detailModalOpen} onClose={handleDetailModalClose}>
                  <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
                    <Typography variant="h6" component="h2">Student Details</Typography>
                    <Typography>Name: {selectedStudent?.userName}</Typography>
                    <Typography>Email: {selectedStudent?.email}</Typography>
                    <Typography>School: {selectedStudent?.schoolName}</Typography>
                    <Typography>Last Activity: {selectedStudent?.updatedAt}</Typography>
                    <Box mt={2}>
                      <Button variant="outlined" color="secondary" onClick={handleDetailModalClose}>Close</Button>
                    </Box>
                  </Box>
                </Modal>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
