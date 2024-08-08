import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Snackbar,
} from "@mui/material";

import Sidebar from "../SideBar";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const TeacherDataTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/teacher/data`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditOpen = (teacher) => {
        setCurrentTeacher(teacher);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentTeacher(null);
    };

    const handleDeleteOpen = (teacher) => {
        setCurrentTeacher(teacher);
        setDeleteDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        setCurrentTeacher(null);
    };

    const handleEditSubmit = async () => {
        try {
            await axiosInstance.put(`/teacher/${currentTeacher._id}`, currentTeacher);
            setAlertMessage("Teacher updated successfully!");
            setAlertOpen(true);
            setData(data.map(item => item._id === currentTeacher._id ? currentTeacher : item));
        } catch (error) {
            console.error("Error updating teacher:", error);
            setAlertMessage("Error updating teacher.");
            setAlertOpen(true);
        } finally {
            handleEditClose();
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axiosInstance.delete(`/teacher/${currentTeacher._id}`);
            setAlertMessage("Teacher deleted successfully!");
            setAlertOpen(true);
            setData(data.filter(item => item._id !== currentTeacher._id));
        } catch (error) {
            console.error("Error deleting teacher:", error);
            setAlertMessage("Error deleting teacher.");
            setAlertOpen(true);
        } finally {
            handleDeleteClose();
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <div>
            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
                <div className="app-main">
                    <Sidebar />
                    <div className="col mt-4">
                    <div className="row">
                            <div className="page-title-actions px-3 d-flex">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Teacher Registered</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="row" id="deleteTableItem">
                                <div className="col-md-12">
                                    <div className="card mb-5">
                                        <div className="card-body">
                                            <Container maxWidth="xl">

                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>First Name</strong></TableCell>
                                                                <TableCell><strong>Last Name</strong></TableCell>
                                                                <TableCell><strong>Email</strong></TableCell>
                                                                <TableCell><strong>Address</strong></TableCell>
                                                                <TableCell><strong>Phone Number</strong></TableCell>
                                                                <TableCell><strong>Gender</strong></TableCell>
                                                                <TableCell><strong>Upload</strong></TableCell>
                                                                <TableCell><strong>Actions</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data.map((item) => (
                                                                <TableRow key={item._id}>
                                                                    <TableCell>{item.firstName}</TableCell>
                                                                    <TableCell>{item.lastName}</TableCell>
                                                                    <TableCell>{item.email}</TableCell>
                                                                    <TableCell>{item.address}</TableCell>
                                                                    <TableCell>{item.phoneNumber}</TableCell>
                                                                    <TableCell>{item.gender}</TableCell>
                                                                    <TableCell>
                                                                        {item.idProof && (
                                                                            <a href={item.idProof} target="_blank" rel="noopener noreferrer">
                                                                                View File
                                                                            </a>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <IconButton onClick={() => handleEditOpen(item)}>
                                                                            <Edit color="primary" />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => handleDeleteOpen(item)}>
                                                                            <Delete color="secondary" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                                {/* Edit Dialog */}
                                                <Dialog open={editDialogOpen} onClose={handleEditClose}>
                                                    <DialogTitle>Edit Teacher</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="First Name"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.firstName || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, firstName: e.target.value })}
                                                        />
                                                        <TextField
                                                            margin="dense"
                                                            label="Last Name"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.lastName || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, lastName: e.target.value })}
                                                        />
                                                        <TextField
                                                            margin="dense"
                                                            label="Email"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.email || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                                                        />
                                                        <TextField
                                                            margin="dense"
                                                            label="Address"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.address || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, address: e.target.value })}
                                                        />
                                                        <TextField
                                                            margin="dense"
                                                            label="Phone Number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.phoneNumber || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, phoneNumber: e.target.value })}
                                                        />
                                                        <TextField
                                                            margin="dense"
                                                            label="Gender"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentTeacher?.gender || ""}
                                                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, gender: e.target.value })}
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleEditClose}>Cancel</Button>
                                                        <Button onClick={handleEditSubmit}>Save</Button>
                                                    </DialogActions>
                                                </Dialog>

                                                {/* Delete Dialog */}
                                                <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
                                                    <DialogTitle>Confirm Delete</DialogTitle>
                                                    <DialogContent>
                                                        Are you sure you want to delete this teacher?
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleDeleteClose}>Cancel</Button>
                                                        <Button onClick={handleDeleteSubmit} color="error">Delete</Button>
                                                    </DialogActions>
                                                </Dialog>

                                                {/* Alert Snackbar */}
                                                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
                                                    <Alert onClose={() => setAlertOpen(false)} severity={alertMessage.includes('success') ? 'success' : 'error'}>
                                                        {alertMessage}
                                                    </Alert>
                                                </Snackbar>
                                            </Container>
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

export default TeacherDataTable;
