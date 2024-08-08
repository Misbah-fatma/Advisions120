import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SeoForm = ({ fetchSeoEntries }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: ''
  });

  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const keywordsArray = formData.keywords.split(',').map(keyword => keyword.trim());
      await axiosInstance.post('/api/seo', 
        { ...formData, keywords: keywordsArray });
      setFormData({ title: '', description: '', keywords: '', author: '' });
      fetchSeoEntries();
    } catch (error) {
      console.error('Error creating SEO entry', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-12">
          <div className="card mb-5">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="keywords">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    className="form-control"
                    placeholder="Keywords (comma-separated)"
                    value={formData.keywords}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    className="form-control"
                    placeholder="Author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoForm;
