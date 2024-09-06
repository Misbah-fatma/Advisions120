import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const CourseDetails = () => {
  const { id } = useParams(); // Get blog ID from route parameters
  const [blog, setBlog] = useState(null);
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/getcoursedetails/${id}`);
        setBlog(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Failed to load blog details. Please try again later.');
      }
    };
  
    fetchCourseDetails();
  }, [id]);

  const [result, setResult] = React.useState("");
  var [show, setshow] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "ad76d720-b8ed-4a9f-bf88-99fbaa9297f8");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
      setshow(true)
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  

  if (error) return <p>{error}</p>;
  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <section id="about" className="about">
        <div className="container mt-2 mb-3">
          <div className="section-title">
            <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3 mt-4">Course Details</div>
            <h2 className="mb-4">{blog.details.title}</h2>
            <p className="mb-4 text-center">{blog.details.text}</p>
          </div>


          <section>
  <div className="row">
    {blog.details && blog.details.cards && blog.details.cards.length > 0 && (
      blog.details.cards.map((card, index) => (
        <div key={index} className="col-md-4 tm-mb-sm-4 tm-2col-l">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <div className="icon-boundary mx-auto mb-3">
                <i className={card.icon}></i>
              </div>
              <h5 className="card-title">{card.heading}</h5>
              <p className="card-text">{card.description}</p>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</section>


                  {blog.details && (
                    <>
                    
                    <div className="row d-flex">
                        <div className="col-lg-8 mt-4 d-flex align-items-stretch">
                            <div className="card w-100">
                                <div className="card-body">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link active"
                            id="features-tab"
                            data-toggle="tab"
                            href="#features"
                            role="tab"
                            aria-controls="features"
                            aria-selected="true"
                          >
                            Features
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link"
                            id="overview-tab"
                            data-toggle="tab"
                            href="#overview"
                            role="tab"
                            aria-controls="overview"
                            aria-selected="false"
                          >
                            Overview
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content mt-4 " id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="features"
                          role="tabpanel"
                          aria-labelledby="features-tab"
                        >
                          <p>{blog.details.features}</p>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="overview"
                          role="tabpanel"
                          aria-labelledby="overview-tab"
                        >
                          <p>{blog.details.overview}</p>
                        </div>
                      </div>
                      </div>
                      </div>
                      </div>
                      <div className="col-lg-4 mt-4 d-flex align-items-stretch">
                            <div className="card w-100">
                                <div className="card-header text-center bg-primary text-white">
                                    <h5>Contact Us for More Details</h5>
                                </div>
                                <div className="card-body">
                                <div class="col-lg-12">
          {
                                show ? <div class="alert alert-success text-center alert-dismissible fade show" role="alert">
                                    Thanks to Share Your Query With US!!! Our Team Will Contact You Soon!!!
                                </div> : ""
                            }
            <form onSubmit={onSubmit}>
              <div class="form-row">
                <div class="col-lg-6 form-group">
                  <input type="text" name="name" class="form-control" id="name" placeholder="Your Name" data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                  <div class="validate"></div>
                </div>
                <div class="col-lg-6 form-group">
                  <input type="email" class="form-control" name="email" id="email" placeholder="Your Email" data-rule="email" data-msg="Please enter a valid email" />
                  <div class="validate"></div>
                </div>
              </div>
              <div class="form-group">
                <textarea class="form-control" name="message" rows="5" data-rule="required" data-msg="Please write something for us" placeholder="Message"></textarea>
                <div class="validate"></div>
              </div>
             
            </form>
          </div>
                                </div>
                                <div className="card-footer">
  <div className="d-flex justify-content-between">
    <button className='btn btn-primary w-40' type="submit">Send Message</button>
  </div>
</div>

                            </div>
                        </div>
                      </div>
                      
        
                    </>
                  )}
                </div>
              
      </section>
      <Footer />
    </div>
  );
};

export default CourseDetails;
