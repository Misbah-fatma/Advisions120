import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from "axios";
import SideBar from "./SideBar";

const LiveClass = () => {
    const [classes, setClasses] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDateTime, setEditedDateTime] = useState('');
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
    const [userData, setUserData] = useState(null);
    
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
    const role = userData?.role;

    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [teacherLink, setTeacherLink] = useState('');
    const [jitsiApi, setJitsiApi] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/live-classes', {
                title,
                dateTime,
                teacherId: userId,
                role
            });
            const link = response.data.teacherLink;
            setTeacherLink(link);
            initializeJitsi(link, response.data.teacherToken); // Pass the token to initialize Jitsi
        } catch (error) {
            console.error(error);
        }
    };

    const initializeJitsi = (link, token) => {
        const domain = 'meet.jit.si';
        const options = {
            roomName: link.split('/').pop(), // Extract the room name from the link
            width: '100%',
            height: 700,
   
            configOverwrite: {
                disableDeepLinking: true,
            },
            interfaceConfigOverwrite: {
                APP_NAME: 'Advisions',
                DEFAULT_REMOTE_DISPLAY_NAME: 'ARD',
                BRAND_WATERMARK_LINK: '',
                SHOW_JITSI_WATERMARK: false,
                SHOW_BRAND_WATERMARK: false,
                SHOW_POWERED_BY: false,
                DEFAULT_LOGO_URL: 'https://seeklogo.com/images/A/atm-link-logo-5F955E13CB-seeklogo.com.png',
                DEFAULT_WELCOME_PAGE_LOGO_URL: 'https://seeklogo.com/images/A/atm-link-logo-5F955E13CB-seeklogo.com.png',
            },
            parentNode: document.querySelector('#jitsi-container'),
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        setJitsiApi(api);
    };

    useEffect(() => {
        // Clean up the Jitsi API when the component is unmounted
        return () => {
            if (jitsiApi) {
                jitsiApi.dispose();
            }
        };
    }, [jitsiApi]);


    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get(`/live-classes/teacher/${userId}`);
            setClasses(response.data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchClasses();
        }
    }, [userId]);

    const deleteClass = async (id) => {
        try {
            await axiosInstance.delete(`/live-classes/${id}`);
            setClasses(classes.filter(cls => cls._id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    const editClass = async (id, updatedTitle, updatedDateTime) => {
        try {
            const response = await axiosInstance.put(`/live-classes/${id}`, {
                title: updatedTitle,
                dateTime: updatedDateTime
            });
            setClasses(classes.map(cls => cls._id === id ? response.data : cls));
        } catch (error) {
            console.error("Error updating class:", error);
        }
    };

    const handleEditClick = (cls) => {
        setCurrentClass(cls);
        setEditedTitle(cls.title);
        setEditedDateTime(cls.dateTime);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        if (currentClass) {
            await editClass(currentClass._id, editedTitle, editedDateTime);
            setIsEditModalOpen(false);
            setCurrentClass(null);
        }
    };

    return (
        <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
            <div className="app-main">
                <SideBar />
                <Grid container spacing={3} style={{ padding: '20px' }}>
                  
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Typography variant="h6" gutterBottom>
                                Created Classes
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Title</TableCell>
                                            <TableCell align="center">Date & Time</TableCell>
                                            <TableCell align="center">Link</TableCell>
                                         
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classes.map(cls => (
                                            <TableRow key={cls._id}>
                                                <TableCell align="center">{cls.title}</TableCell>
                                                <TableCell align="center">{new Date(cls.dateTime).toLocaleString()}</TableCell>
                                                <TableCell align="center"><a>{cls.link}</a></TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="primary" onClick={() => handleEditClick(cls)}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton color="secondary" onClick={() => deleteClass(cls._id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Typography variant="h6" gutterBottom>
                                Schedule a New Class
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Class Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                 
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Schedule Class
                                </Button>
                            </form>
                            {teacherLink && (
                                <Box mt={2}>
                                    <Typography variant="body1" gutterBottom>
                                        Your Meeting Link:
                                    </Typography>
                                    <Button variant="outlined" color="primary" href={teacherLink} target="_blank">
                                        Start Class
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
                <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <Box sx={{
                        padding: 4, backgroundColor: 'white', width: '400px', margin: 'auto', marginTop: '10%',
                        borderRadius: '8px', boxShadow: 24, outline: 'none'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Class
                        </Typography>
                        <TextField
                            label="Class Title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Class Date & Time"
                            type="datetime-local"
                            value={editedDateTime}
                            onChange={(e) => setEditedDateTime(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                                Save
                            </Button>
                            <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default LiveClass;
