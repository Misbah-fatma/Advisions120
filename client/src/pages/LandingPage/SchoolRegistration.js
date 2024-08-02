import React, { useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button, Typography, MenuItem, Box, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  formContainer: {
    padding: 16, // Reduced padding
    backgroundColor: '#fff',
    borderRadius: 8,
    maxWidth: '900px',
    margin: 'auto',
  },
  formHeader: {
    color: '#ff4081',
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
  },
  sectionHeader: {
    color: '#9c27b0',
    marginBottom: 8, // Reduced margin
  },
  formControl: {
    marginBottom: 8, // Reduced margin
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2196f3',
    marginTop: 16, // Reduced margin
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1976d2',
    },
  },
  label: {
    marginBottom: 2, // Reduced margin
    display: 'block',
    fontWeight: 'bold',
  },
  smallTextField: {
    '& .MuiInputBase-root': {
      height: 36, // Adjust this value to make the input smaller
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px', // Adjust the padding to fit the smaller input
    },
  },
  fileInput: {
    marginTop: 8, // Adjust margin if needed
  },
});

const SchoolRegisterPage = () => {
  const classes = useStyles();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [formData, setFormData] = useState({
    school_name: '',
    school_address_file: null, // Updated key for file
    school_email: '',
    school_phone: '',
    school_info: '',
    Principal_name: '',
    gender: '',
    Principal_address: '',
    Principal_phone: '',
    Principal_email: '',
    Principal_password: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value, // Handle file input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append form data including file
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axiosInstance.post('/schoolRegistration/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully:', response.data);
      // Handle successful submission here (e.g., show a success message)
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors here (e.g., show an error message)
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" className={classes.formContainer} onSubmit={handleSubmit}>
        <Typography variant="h5" className={classes.formHeader}>
          School Register Form
        </Typography>
        <hr/>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className={classes.sectionHeader}>
              SCHOOL INFO
            </Typography>
            <div className={classes.formControl}>
              <label htmlFor="school_name" className={classes.label}>School Name</label>
              <TextField
                fullWidth
                id="school_name"
                name="school_name"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.school_name}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="school_address" className={classes.label}>School Address</label>
              <TextField
                fullWidth
                id="school_address"
                name="school_address"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.school_address}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="school_email" className={classes.label}>School Email</label>
              <TextField
                fullWidth
                id="school_email"
                name="school_email"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.school_email}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="school_phone" className={classes.label}>School Phone</label>
              <TextField
                fullWidth
                id="school_phone"
                name="school_phone"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.school_phone}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="school_info" className={classes.label}>School Info</label>
              <TextField
                fullWidth
                id="school_info"
                name="school_info"
                variant="outlined"
                multiline
                rows={3} // Reduced rows
                value={formData.school_info}
                onChange={handleChange}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className={classes.sectionHeader}>
              PRINCIPAL INFO
            </Typography>
            <div className={classes.formControl}>
              <label htmlFor="Principal_name" className={classes.label}>Principal Name</label>
              <TextField
                fullWidth
                id="Principal_name"
                name="Principal_name"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.Principal_name}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="gender" className={classes.label}>Gender</label>
              <TextField
                select
                fullWidth
                id="gender"
                name="gender"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="">Select a gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </div>
            <div className={classes.formControl}>
              <label htmlFor="school_address_file" className={classes.label}>Verify School (Upload Document)</label>
              <input
                id="school_address_file"
                name="school_address_file"
                type="file"
                className={classes.fileInput}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="Principal_phone" className={classes.label}>Principal Phone Number</label>
              <TextField
                fullWidth
                id="Principal_phone"
                name="Principal_phone"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.Principal_phone}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="Principal_email" className={classes.label}>Principal Email</label>
              <TextField
                fullWidth
                id="Principal_email"
                name="Principal_email"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.Principal_email}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="Principal_password" className={classes.label}>Principal Password</label>
              <TextField
                fullWidth
                id="Principal_password"
                name="Principal_password"
                type="password"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.Principal_password}
                onChange={handleChange}
              />
            </div>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          className={classes.submitButton}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default SchoolRegisterPage;
