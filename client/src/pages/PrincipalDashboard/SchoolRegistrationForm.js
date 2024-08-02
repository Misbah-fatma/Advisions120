import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SchoolRegistrationForm = () => {
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [schoolData, setSchoolData] = useState({ name: '', address: '', email: '', phone: '' });
  const [schools, setSchools] = useState([]);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      try {
        const parsedData = JSON.parse(userDataFromStorage);
        setUserData(parsedData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const userId = userData ? userData._id : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolData({
      ...schoolData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/schools/register',{ ...schoolData, principalId: userId },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
          },
        }
      );
      console.log(response.data);
      alert('School registered successfully!');
      fetchSchools(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert('There was an error registering the school.');
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axiosInstance.get('/schools/allschools');
      setSchools(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleEditClick = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axiosInstance.delete(`/schools/${id}`);
      fetchSchools(); // Refresh the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/schools/${selectedSchool._id}`, selectedSchool);
      fetchSchools(); // Refresh the list
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedSchool({
      ...selectedSchool,
      [name]: value
    });
  };

  return (
    <div>
      <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
        <div className="app-main">
          <SideBar />
          <div className="app-main-outer">
            <div className="app-main-inner">
              <div className="page-title-actions px-3 d-flex">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                    <li className="breadcrumb-item"><a href="/">School Registration</a></li>
                  </ol>
                </nav>
              </div>
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="main-card card d-flex h-100 flex-column">
                    <div className="card-body">
                      <h5 className="card-title py-2">Create New User</h5>
                      <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="row">
                          <div className="col-4">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input
                                name="name"
                                value={schoolData.name}
                                onChange={handleChange}
                                required className="form-control"
                                placeholder="Enter user name"
                              />
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="mb-3">
                              <label className="form-label">Email</label>
                              <input
                                name="email"
                                value={schoolData.email}
                                onChange={handleChange}
                                required className="form-control"
                                placeholder="Enter user email"
                              />
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="mb-3">
                              <label className="form-label">Address</label>
                              <input
                                name="address"
                                value={schoolData.address}
                                onChange={handleChange}
                                required className="form-control"
                                placeholder="Enter Password"
                              />
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="mb-3">
                              <label className="form-label">Phone Number</label>
                              <input
                                type="text"
                                name="phone"
                                value={schoolData.phone}
                                onChange={handleChange}
                                required className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <button type="submit" className="btn bgBlue btn-dipBlue text-black">Create</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="main-card card d-flex h-100 flex-column">
                    <div className="card-body">
                      <h3>Schools Created</h3>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Address</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Phone</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {schools.filter(user => user.principalId === userId).map((school) => (
                              <TableRow key={school._id}>
                                <TableCell>{school.name}</TableCell>
                                <TableCell>{school.address}</TableCell>
                                <TableCell>{school.email}</TableCell>
                                <TableCell>{school.phone}</TableCell>
                                <TableCell>
                                  <IconButton onClick={() => handleEditClick(school)}>
                                    <EditIcon color="primary" />
                                  </IconButton>
                                  <IconButton onClick={() => handleDeleteClick(school._id)}>
                                    <DeleteIcon color="secondary" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </div>
              <Modal open={open} onClose={handleModalClose}>
                <Box sx={{ ...modalStyle, width: 400 }}>
                  <h2>Edit School</h2>
                  {selectedSchool && (
                    <form onSubmit={handleModalSubmit}>
                      <TextField
                        name="name"
                        label="Name"
                        value={selectedSchool.name}
                        onChange={handleModalChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        name="address"
                        label="Address"
                        value={selectedSchool.address}
                        onChange={handleModalChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        name="email"
                        label="Email"
                        value={selectedSchool.email}
                        onChange={handleModalChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        name="phone"
                        label="Phone"
                        value={selectedSchool.phone}
                        onChange={handleModalChange}
                        fullWidth
                        margin="normal"
                      />
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                      <Button onClick={handleModalClose} variant="contained" color="secondary">
                        Cancel
                      </Button>
                    </form>
                  )}
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default SchoolRegistrationForm;
