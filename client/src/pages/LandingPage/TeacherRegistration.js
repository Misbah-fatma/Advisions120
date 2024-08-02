import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, Box, MenuItem, Input, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  formContainer: {
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxWidth: "900px",
    margin: "auto",
  },
  formHeader: {
    color: "#ff4081",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionHeader: {
    color: "#9c27b0",
    marginBottom: 16,
  },
  formControl: {
    marginBottom: 15,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#2196f3",
    marginTop: 24,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1976d2",
    },
  },
  label: {
    marginBottom: 4,
    display: "block",
    fontWeight: "bold",
  },
  smallTextField: {
    "& .MuiInputBase-root": {
      height: 36,
    },
    "& .MuiInputBase-input": {
      padding: "8px 14px",
    },
  },
});

const TeacherRegisterForm = () => {
  const classes = useStyles();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    gender: "",
    school_address_file: null, // State for the file
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file upload
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axiosInstance.post("/teacher/register", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form submitted successfully:", response.data);
      setAlertMessage("Registration successful!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage("Error submitting form. Please try again.");
      setAlertSeverity("error");
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" className={classes.formContainer} onSubmit={handleSubmit}>
        <Typography variant="h5" className={classes.formHeader}>
          Teacher Registration
        </Typography>
        <hr />
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <div className={classes.formControl}>
              <label htmlFor="firstName" className={classes.label}>
                First Name
              </label>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="lastName" className={classes.label}>
                Last Name
              </label>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="email" className={classes.label}>
                Email
              </label>
              <TextField
                fullWidth
                id="email"
                name="email"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="password" className={classes.label}>
                Password
              </label>
              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.formControl}>
              <label htmlFor="address" className={classes.label}>
                Address
              </label>
              <TextField
                fullWidth
                id="address"
                name="address"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="phoneNumber" className={classes.label}>
                Phone Number
              </label>
              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                variant="outlined"
                className={classes.smallTextField}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="gender" className={classes.label}>
                Gender
              </label>
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
              <label htmlFor="school_address_file" className={classes.label}>
                Verify Teacher (Upload ID Proof)
              </label>
              <Input
                id="school_address_file"
                name="school_address_file"
                type="file"
                className={classes.fileInput}
                onChange={handleChange}
              />
            </div>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" className={classes.submitButton}>
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default TeacherRegisterForm;
