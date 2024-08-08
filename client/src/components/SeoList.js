import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SeoList = ({ seoEntries, fetchSeoEntries }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [updatedEntry, setUpdatedEntry] = useState({ title: '', description: '', keywords: [], author: '' });

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/seo/${id}`);
      fetchSeoEntries();
    } catch (error) {
      console.error('Error deleting SEO entry', error);
    }
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setUpdatedEntry(entry);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/api/seo/${currentEntry._id}`, updatedEntry);
      fetchSeoEntries();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating SEO entry', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEntry({
      ...updatedEntry,
      [name]: value,
    });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="container mt-4">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Keywords</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(seoEntries) && seoEntries.length > 0 ? (
              seoEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.keywords.join(', ')}</TableCell>
                  <TableCell>{entry.author}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(entry)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(entry._id)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No SEO entries available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullScreen={fullScreen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Edit SEO Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the details of the SEO entry.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={updatedEntry.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={updatedEntry.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="keywords"
            label="Keywords"
            type="text"
            fullWidth
            value={updatedEntry.keywords.join(', ')}
            onChange={(e) =>
              setUpdatedEntry({
                ...updatedEntry,
                keywords: e.target.value.split(', '),
              })
            }
          />
          <TextField
            margin="dense"
            name="author"
            label="Author"
            type="text"
            fullWidth
            value={updatedEntry.author}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

SeoList.propTypes = {
  seoEntries: PropTypes.array.isRequired,
  fetchSeoEntries: PropTypes.func.isRequired,
};

export default SeoList;
