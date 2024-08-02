import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SideBar from "./SideBar";

const CreateTeacherStudent = () => {


  const school = localStorage.getItem('schoolName');

console.log(school)

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    schoolName : school,
    role: 'Student', // Set default role to 'Student'
  });
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({ userName: '', email: '', role: 'Student', password: '' });
  const [editUserId, setEditUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableVisible, setTableVisible] = useState(false);

  const user = useSelector(state => state.auth);

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

  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users/getusers', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/users/principal/createTeacherOrStudent', { ...formData, principalId: userId }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
        },
      });
      setUsers([...users, response.data]); // Update the users state with the new user
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/users/principal/deleteTeacherOrStudent/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
        },
      });
      setUsers(users.filter(user => user._id !== id)); // Update the users state after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditOpen = (user) => {
    setEditData({ ...user, password: '' });
    setEditUserId(user._id);
    setOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/users/principal/updateTeacherOrStudent/${editUserId}`, editData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
        },
      });
      setUsers(users.map(user => (user._id === editUserId ? response.data : user))); // Update the users state with the edited user
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleTableVisibility = () => {
    setTableVisible(!tableVisible);
  };

  const filteredUsers = users.filter(user =>
    user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
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
                      <li className="breadcrumb-item"><a href="/">principal</a></li>
                      <li className="breadcrumb-item active" aria-current="page">Create</li>
                    </ol>
                  </nav>
                </div>
                <div className="row" id="deleteTableItem">
                  <div className="col-md-12">
                    <div className="main-card card d-flex h-100 flex-column">
                      <div className="card-body">
                        <h5 className="card-title py-2">Create New User</h5>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                          <input type="hidden" name="_token" value="zApQm200TRCSwlgCvq8JHVIYRC6flSbhaWtzbvCd" autoComplete="off" />
                          <div className="row">
                            <div className="col-4">
                              <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input name="userName"
                                  value={formData.userName}
                                  onChange={handleChange}
                                  required className="form-control"
                                  placeholder="Enter user name" />
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input name="email"
                                  value={formData.email}
                                  onChange={handleChange} required className="form-control"
                                  placeholder="Enter user email" />
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required className="form-control"
                                  placeholder="Enter Password" />
                              </div>
                            </div>
                            {/* Removed Role selection since it's fixed as 'Student' */}
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
                        <Button onClick={toggleTableVisibility} variant="contained" color="primary" className='mb-4'>
                          {tableVisible ? 'Hide' : 'Show'} Students Table
                        </Button>
                        {tableVisible && (
                          <>
                            <TextField
                              label="Search by Name"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              fullWidth
                            />
                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {filteredUsers
                                    .filter(user => user.role === 'Student' && user.principalId === userId)
                                    .map((user) => (
                                      <TableRow key={user._id}>
                                        <TableCell>{user.userName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                          <IconButton onClick={() => handleEditOpen(user)}>
                                            <EditIcon color="primary" />
                                          </IconButton>
                                          <IconButton onClick={() => handleDelete(user._id)}>
                                            <DeleteIcon color="secondary" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}
                      </div>
                      <Modal open={open} onClose={handleClose}>
                        <Box sx={{ ...modalStyle, width: 400 }}>
                          <h2>Edit User</h2>
                          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <TextField
                              label="Name"
                              name="userName"
                              value={editData.userName}
                              onChange={handleEditChange}
                              fullWidth
                              required
                            />
                            <TextField
                              label="Email"
                              name="email"
                              value={editData.email}
                              onChange={handleEditChange}
                              fullWidth
                              required
                            />
                            <TextField
                              label="Password"
                              name="password"
                              type="password"
                              value={editData.password}
                              onChange={handleEditChange}
                              fullWidth
                            />
                            <Button type="submit" variant="contained" color="primary">Update</Button>
                          </form>
                        </Box>
                      </Modal>
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default CreateTeacherStudent;
