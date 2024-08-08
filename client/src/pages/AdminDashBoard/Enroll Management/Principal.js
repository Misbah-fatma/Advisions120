import React, { useEffect, useState } from "react";
import Sidebar from '../SideBar';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { 
  IconButton, 
  Snackbar, 
  Alert, 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button, 
  TextField 
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const Principal = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ userName: "", email: "" });

  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const userList = async () => {
    try {
      const user = await axiosInstance.get("/users/allprincipal", {
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

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ userName: student.userName, email: student.email });
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/users/principal/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      });
      setData(data.filter((student) => student._id !== id));
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
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      });
      setData(data.map((student) => (student._id === selectedStudent._id ? updatedStudent.data : student)));
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

  const columns = [
    { field: 'userName', headerName: 'Student', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'updatedAt', headerName: 'Last Activity', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <div className="statusItem">
          <div className="circleDot animatedCompleted"></div>
          <div className="statusText">
            <span className="stutsCompleted">Active</span>
          </div>
        </div>
      ) 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon color="primary"/>
          </IconButton>
        </>
      )
    }
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
                        
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                  <DialogTitle>Edit Student</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      label="Student Name"
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
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar 
                  open={snackbarOpen} 
                  autoHideDuration={6000} 
                  onClose={() => setSnackbarOpen(false)}
                >
                  <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                  >
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    
  );
};

export default Principal;
