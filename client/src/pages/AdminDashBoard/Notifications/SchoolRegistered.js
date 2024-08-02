import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../SideBar';

const SchoolTable = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [formData, setFormData] = useState({});
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await axiosInstance.get('/schoolRegistration/list');
                setSchools(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching schools:', error);
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    const handleEditOpen = (school) => {
        setSelectedSchool(school);
        setFormData(school);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedSchool(null);
        setFormData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/schoolRegistration/${selectedSchool._id}`, formData);
            setSchools(prevSchools => prevSchools.map(school => school._id === selectedSchool._id ? response.data : school));
            handleEditClose();
        } catch (error) {
            console.error('Error updating school:', error);
        }
    };

    const handleDelete = async (schoolId) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axiosInstance.delete(`/schoolRegistration/${schoolId}`);
                setSchools(prevSchools => prevSchools.filter(school => school._id !== schoolId));
                console.log('Deleted successfully');
            } catch (error) {
                console.error('Error deleting school:', error);
            }
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

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
                                        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">School Registered</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="row" id="deleteTableItem">
                                <div className="col-md-12">
                                    <div className="card mb-5">
                                        <div className="card-body">
                                            <Container>

                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ fontWeight: 'bold' }}>School Name</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>School Phone</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Principal Name</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Principal Email</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Principal Phone</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Id Proof</TableCell>
                                                                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {schools.map((school) => (
                                                                <TableRow key={school._id}>
                                                                    <TableCell>{school.school_name}</TableCell>
                                                                    <TableCell>{school.school_address}</TableCell>
                                                                    <TableCell>{school.school_email}</TableCell>
                                                                    <TableCell>{school.school_phone}</TableCell>
                                                                    <TableCell>{school.Principal_name}</TableCell>
                                                                    <TableCell>{school.Principal_email}</TableCell>
                                                                    <TableCell>{school.Principal_phone}</TableCell>
                                                                    <TableCell>
                                                                        <a href={school.school_address_file} target="_blank" rel="noopener noreferrer">View File</a>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <IconButton onClick={() => handleEditOpen(school)} color="primary">
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => handleDelete(school._id)} color="secondary">
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit School</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditSubmit}>
                        <TextField
                            label="School Name"
                            name="school_name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.school_name || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Address"
                            name="school_address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.school_address || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Email"
                            name="school_email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.school_email || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Phone"
                            name="school_phone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.school_phone || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Principal Name"
                            name="Principal_name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.Principal_name || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Principal Email"
                            name="Principal_email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.Principal_email || ''}
                            onChange={handleEditChange}
                        />
                         <TextField
                            label="Principal Phone"
                            name="Principal_phone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.Principal_phone || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="School Address File URL"
                            name="school_address_file"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.school_address_file || ''}
                            onChange={handleEditChange}
                        />
                        <DialogActions>
                            <Button onClick={handleEditClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SchoolTable;





