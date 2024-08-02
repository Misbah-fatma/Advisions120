import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import "../AdminDashBoard/SideBar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [schools, setSchools] = useState([]);
  const [schoolName, setSchoolName] = useState(localStorage.getItem('schoolName') || "");
  const [showOptions, setShowOptions] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
    option6: false,
    option7: false,
    option8: false,
    option9: false,
  });

  const toggleOptions = (option) => {
    setShowOptions({
      ...showOptions,
      [option]: !showOptions[option]
    });
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    console.log(userDataFromStorage);
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
  }, []);

  const email = userData?.email;

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosInstance.get('/schoolRegistration/list');
        const schoolsData = response.data;

        const school = schoolsData.find(school => school.Principal_email === email);
        if (school) {
          setSchools([school]);
          setSchoolName(school.school_name);
          localStorage.setItem('schoolName', school.school_name);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, [email, axiosInstance]);

  const handleLogout = () => {
    localStorage.clear("user");
    localStorage.clear("auth_token");
    localStorage.clear("schoolName");
    dispatch({ type: "CLEAR__USER" });
    history("/login");
  };

  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
      <div className="app-header header-shadow">
        <div className="app-header-logo"></div>
        <div className="app-header-mobile-menu">
          <div>
            <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </div>
        <div className="app-header-menu">
          <span>
            <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
              <span className="btn-icon-wrapper">
                <i className="fa fa-ellipsis-v fa-w-6"></i>
              </span>
            </button>
          </span>
        </div>
        <div className="app-header-content">
          <div className="app-header-left d-flex justify-content-between align-items-center w-100">
            <Link to="/home" className='p-1 m-0 font-weight-medium' style={{ fontSize: '1.2rem' }}>Home</Link>
            <div className="d-flex justify-content-center flex-grow-1">
              <span className=' mx-11' style={{ color: '#6200ea',  fontSize: '1.4rem'  }}>{schoolName}</span>
            </div>
          </div>
          <div className="app-header-right">
            <div className="app-header-right d-flex align-items-center">
              <div className="container">
                <nav className="navbar navbar-expand-lg p-0">
                  <div className="nav-item nav-link active">
                    {userData ? (
                      <div className="nav-item dropdown">
                        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{ color: "#6200ea" }}>
                          {userData.userName}
                          <i className="fa fa-user-circle-o mt-1" aria-hidden="true"></i>
                        </a>
                        <div className="dropdown-menu rounded-0 border-0 m-0">
                          <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                        </div>
                      </div>
                    ) : (
                      <Link to="/login" className="nav-item nav-link active">Login</Link>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app-sidebar sidebar-shadow">
        <div className="scrollbar-sidebar pb-3">
          <div className="branding-logo mb-4 text-start px-5">
            <img src="/assets/logo10.png" alt="Logo" style={{ height: "40px", marginRight: "5px" }} />
          </div>
          <div className="branding-logo-forMobile mb-4">
            <a href="/">
              <img src="assets/logo10.png" alt="" />
            </a>
          </div>
          <div className="app-sidebar-inner">
            <div className="option" onClick={() => toggleOptions('option1')}>
              <NavLink to="/principal-dashboard" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-tachometer-alt menu-icon"></i>
                Dashboard
              </NavLink>
            </div>

            <div className="option" onClick={() => toggleOptions('option2')}>
              <NavLink to="/createstudent-teacherPrincipal" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-chalkboard-teacher menu-icon"></i>
                 Teachers<span className='text-white'>rgsrgg</span>
              </NavLink>
            </div>

            <div className="option" onClick={() => toggleOptions('option3')}>
              <NavLink to="/createsStudentByPrincipal" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-user-graduate menu-icon"></i>
                 Students<span className='text-white'>rgsdfvfsdfsdrgg</span>
              </NavLink>
            </div>

            {/* <div className="option" onClick={() => toggleOptions('option4')}>
              <NavLink to="/schoolRegistrationForm" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-school menu-icon"></i>
                School Registration
              </NavLink>
            </div> */}

            <div className="option" onClick={() => toggleOptions('option5')}>
              <NavLink to="/planPage" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-box-open menu-icon"></i>
                Plans<span className='text-white'>vfsdfsdrgg</span>
              </NavLink>
            </div>
            <div className="option" onClick={() => toggleOptions('option4')}>
              <NavLink to="/principal-approval" activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-box-open menu-icon"></i>
                Notifications
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
