import React from 'react';
import Sidebar from '../SideBar';
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const UpdateRole = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Student');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
    const buttonRef = useRef(null);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setOpen(false);

        try {
            const response = await axiosInstance.put('/users/updateRole', { email, role }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
                },
            });
            setMessage(response.data.message);
            setOpen(true);
        } catch (error) {
            setError(error.response?.data?.error || 'Error updating role');
            setOpen(true);
        }
    };

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
                                        <li className="breadcrumb-item"><a href="">Dashboard</a></li>
                                        <li className="breadcrumb-item"><a href="">Instructor</a></li>
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
                                                            <label className="form-label">Email</label>
                                                            <input type="email" 
                                                                value={email} 
                                                                onChange={e => setEmail(e.target.value)} 
                                                                required 
                                                                className="form-control"
                                                                placeholder="Enter user email" />
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="mb-3">
                                                            <label className="form-label">Assign Role</label>
                                                            <select 
                                                                value={role} 
                                                                onChange={e => setRole(e.target.value)} 
                                                                required 
                                                                className="form-control" 
                                                                style={{ height: '43px' }}>
                                                                <option value="">Select a role</option>
                                                                <option value="Admin">Admin</option>
                                                                <option value="Teacher">Teacher</option>
                                                                <option value="Student">Student</option>
                                                                <option value="Principal">Principal</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn bgBlue btn-dipBlue text-black" ref={buttonRef}>Update</button>
                                                    </div>
                                                </div>
                                            </form>
                                            <Snackbar
                                                open={open}
                                                autoHideDuration={6000}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: buttonRef.current ? buttonRef.current.offsetTop - 10 : 0,
                                                    left: buttonRef.current ? buttonRef.current.offsetLeft + buttonRef.current.offsetWidth + 10 : 0,
                                                }}
                                            >
                                                {message ? (
                                                    <Alert onClose={handleClose} severity="success" sx={{ width: '30%' }}>
                                                        {message}
                                                    </Alert>
                                                ) : (
                                                    <Alert onClose={handleClose} severity="error" sx={{ width: '30%' }}>
                                                        {error}
                                                    </Alert>
                                                )}
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

export default UpdateRole;
