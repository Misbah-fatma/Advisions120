import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SideBar from "../SideBar";

const App = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [features, setFeatures] = useState([]);
    const [plans, setPlans] = useState([]);
    const [currentPlanId, setCurrentPlanId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalPrice, setModalPrice] = useState("");
    const [modalType, setModalType] = useState("");
    const [modalFeatures, setModalFeatures] = useState([]);

    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axiosInstance.get("/api/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        fetchPlans();
    }, []);

    const handleAddFeature = () => {
        if (newFeature.trim() !== "") {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature("");
        }
    };

    const handleDeleteFeature = (index) => {
        const updatedFeatures = features.filter((_, i) => i !== index);
        setFeatures(updatedFeatures);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/api/plans`, {
                title,
                price,
                type,
                features,
            });
            setPlans([...plans, response.data]);
            setTitle("");
            setPrice("");
            setType("");
            setFeatures([]);
        } catch (error) {
            console.error("Error creating plan:", error);
        }
    };

    const handleEditClick = (plan) => {
        setCurrentPlanId(plan._id);
        setModalTitle(plan.title);
        setModalPrice(plan.price);
        setModalType(plan.type);
        setModalFeatures(plan.features);
        setEditing(true);
        setModalOpen(true);
    };

    const handleDeleteClick = async (planId) => {
        try {
            await axiosInstance.delete(`/api/plans/${planId}`);
            setPlans(plans.filter(plan => plan._id !== planId));
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axiosInstance.put(`/api/plans/${currentPlanId}`, {
                    title: modalTitle,
                    price: modalPrice,
                    type: modalType,
                    features: modalFeatures,
                });
                setPlans(plans.map(plan =>
                    plan._id === currentPlanId ? { ...plan, title: modalTitle, price: modalPrice, type: modalType, features: modalFeatures } : plan
                ));
            }
            setModalOpen(false);
            setEditing(false);
            setCurrentPlanId(null);
        } catch (error) {
            console.error("Error updating plan:", error);
        }
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
                                        <li className="breadcrumb-item"><a href="/">Plans</a></li>
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
                                                            <label className="form-label">Title</label>
                                                            <input
                                                                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                                                required className="form-control"
                                                                placeholder="Enter Title" />
                                                        </div>
                                                    </div>

                                                    <div className="col-4">
                                                        <div className="mb-3">
                                                            <label className="form-label">Price</label>
                                                            <input
                                                                type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                                                                required className="form-control"
                                                                placeholder="Enter Price" />
                                                        </div>
                                                    </div>

                                                    <div className="col-4">
                                                        <div className="mb-3">
                                                            <label className="form-label">Types</label>
                                                            <input type="text" value={type} onChange={(e) => setType(e.target.value)}
                                                                required className="form-control"
                                                                placeholder="Enter Types" />
                                                        </div>
                                                    </div>

                                                    <div className="col-8">
                                                        <div className="mb-3">
                                                            <label className="form-label">Features</label>
                                                            <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Feature" />
                                                        </div>
                                                    </div>
                                                    <div className="col-4 d-flex align-items-end">
                                                        <button type="button" onClick={handleAddFeature} className="btn btn-secondary mb-3">Add Feature</button>
                                                    </div>
                                                    <div className="col-12">
                                                        <ul className="list-group mt-2">
                                                            {features.map((feature, index) => (
                                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    {feature}
                                                                    <IconButton onClick={() => handleDeleteFeature(index)}>
                                                                        <DeleteIcon color="secondary" />
                                                                    </IconButton>
                                                                </li>
                                                            ))}
                                                        </ul>
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
                                            <h3>Users created by the principal</h3>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Title</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>Type</TableCell>
                                                            <TableCell>Features</TableCell>
                                                            <TableCell>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {plans.map((plan) => (
                                                            <TableRow key={plan._id}>
                                                                <TableCell>{plan.title}</TableCell>
                                                                <TableCell>{plan.price}</TableCell>
                                                                <TableCell>{plan.type}</TableCell>
                                                                <TableCell>
                                                                    <ul>
                                                                        {plan.features.map((feature, index) => (
                                                                            <li key={index}>{feature}</li>
                                                                        ))}
                                                                    </ul>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={() => handleEditClick(plan)}>
                                                                        <EditIcon color="primary" />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => handleDeleteClick(plan._id)}>
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
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px' }}>
                    <h2>{editing ? 'Edit Plan' : 'Add Plan'}</h2>
                    <form onSubmit={handleModalSubmit}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={modalTitle}
                            onChange={(e) => setModalTitle(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Price"
                            fullWidth
                            type="number"
                            value={modalPrice}
                            onChange={(e) => setModalPrice(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Type"
                            fullWidth
                            value={modalType}
                            onChange={(e) => setModalType(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Features (comma separated)"
                            fullWidth
                            value={modalFeatures.join(', ')}
                            onChange={(e) => setModalFeatures(e.target.value.split(',').map(feature => feature.trim()))}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                            {editing ? 'Update' : 'Add'}
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default App;
