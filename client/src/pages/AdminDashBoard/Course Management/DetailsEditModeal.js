import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';

const EditCourseDetailsModal = ({ open, onClose, courseId, onSave }) => {
    const [details, setDetails] = useState({
        title: '',
        text: '',
        features: '',
        overview: '',
        cards: [],  // Ensure cards is initialized as an array
    });

    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    const handleCardChange = (index, field, value) => {
        setDetails((prevDetails) => {
            const updatedCards = [...prevDetails.cards];
            updatedCards[index] = { ...updatedCards[index], [field]: value };  // Use spread to update card immutably
            return { ...prevDetails, cards: updatedCards };
        });
    };
    

    const addNewCard = () => {
        const newCard = { icon: '', heading: '', description: '' };
        setDetails((prevDetails) => ({ ...prevDetails, cards: [...prevDetails.cards, newCard] }));
    };

    const removeCard = (index) => {
        const updatedCards = details.cards.filter((_, i) => i !== index);
        setDetails((prevDetails) => ({ ...prevDetails, cards: updatedCards }));
    };

    // Fetch course details using Axios when courseId changes
    useEffect(() => {
        if (courseId) {
            axiosInstance.get(`/${courseId}`)
                .then((response) => {
                    console.log(response.data);  // Check if response data contains the correct fields
                    setDetails({
                        ...response.data,
                        cards: response.data.cards || [],  // Ensure cards is always an array
                    });
                })
                .catch((error) => {
                    console.error('Error fetching course details:', error);
                });
        }
    }, [courseId]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(`/${courseId}/details`, details, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving course details:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{details.title ? 'Edit Details' : 'Add Details'}</DialogTitle>
            <DialogContent>
                <TextField
                    name="title"
                    label="Title"
                    fullWidth
                    margin="dense"
                    value={details.title}
                    onChange={handleChange}
                />
                <TextField
                    name="text"
                    label="Text"
                    fullWidth
                    margin="dense"
                    value={details.text}
                    onChange={handleChange}
                />
                <TextField
                    name="features"
                    label="Features"
                    fullWidth
                    margin="dense"
                    value={details.features}
                    onChange={handleChange}
                />
                <TextField
                    name="overview"
                    label="Overview"
                    fullWidth
                    margin="dense"
                    value={details.overview}
                    onChange={handleChange}
                />

                {/* Render the cards dynamically */}
                {(details.cards || []).map((card, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <TextField
                            name="icon"
                            label="Icon"
                            fullWidth
                            margin="dense"
                            value={card.icon}
                            onChange={(e) => handleCardChange(index, 'icon', e.target.value)}
                        />
                        <TextField
                            name="heading"
                            label="Heading"
                            fullWidth
                            margin="dense"
                            value={card.heading}
                            onChange={(e) => handleCardChange(index, 'heading', e.target.value)}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            margin="dense"
                            value={card.description}
                            onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                        />
                        <Button onClick={() => removeCard(index)} style={{ marginTop: '10px' }}>
                            Remove Card
                        </Button>
                    </div>
                ))}
                <Button onClick={addNewCard} style={{ marginTop: '10px' }}>
                    Add Card
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCourseDetailsModal;
