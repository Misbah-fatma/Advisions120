import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../SideBar';
import SeoForm from '../../../components/SeoForm';
import SeoList from '../../../components/SeoList';
import SeoEdit from '../../../components/SeoEdit';

const EditMetadataPage = () => {


  const [seoEntries, setSeoEntries] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const fetchSeoEntries = async () => {
    try {
      const response = await axiosInstance.get('/api/seo');
      setSeoEntries(response.data);
    } catch (error) {
      console.error('Error fetching SEO entries', error);
    }
  };

  useEffect(() => {
    fetchSeoEntries();
  }, []);

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
                    <li className="breadcrumb-item"><a href="">Meta Data</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Create</li>
                  </ol>
                </nav>
              </div>
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="main-card card d-flex h-100 flex-column">
                    <div className="card-body">
                      <h5 className="card-title py-2">Create Meta Data</h5>
                     
                       <SeoForm fetchSeoEntries={fetchSeoEntries} />

                   
                      <SeoList seoEntries={seoEntries} fetchSeoEntries={fetchSeoEntries} />
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

export default EditMetadataPage;
