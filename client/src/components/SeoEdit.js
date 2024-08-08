import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';

const SeoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: ''
  });

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const fetchSeoEntry = async () => {
      try {
        const response = await axiosInstance.get(`/api/seo/${id}`);
        const data = response.data;
        setFormData({
          title: data.title,
          description: data.description,
          keywords: data.keywords.join(', '),
          author: data.author
        });
      } catch (error) {
        console.error('Error fetching SEO entry', error);
      }
    };

    fetchSeoEntry();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const keywordsArray = formData.keywords.split(',').map(keyword => keyword.trim());
      await axiosInstance.put(`/api/seo/${id}`, { ...formData, keywords: keywordsArray });
      navigate('/');
    } catch (error) {
      console.error('Error updating SEO entry', error);
    }
  };

  return (
    <div className="container mt-5">
      <Helmet>
        <title>Advisions LMS</title>
        <meta name="description" content="Edit an existing SEO entry" />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-12 col-xs-12 col-sm-6 col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <button type="submit" className="btn btn-primary mt-3">Update</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SeoEdit;
