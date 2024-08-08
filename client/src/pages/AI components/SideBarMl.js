import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;
const theme = createTheme();

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const dispatch = useDispatch();
  const history = useNavigate();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = () => {
    // Dispatch logout action
    localStorage.clear();
    dispatch({ type: "CLEAR__USER" });
    history("/login");
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleOptions = (option) => {
    setShowOptions({
      ...showOptions,
      [option]: !showOptions[option]
    });
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <img src="/assets/logo10.png" alt="Logo" style={{ height: '35px' }} />
      </Box>
      <div className="app-sidebar-inner mt-4">
        {isMobile && (
          <>
            <div className="option">
              <NavLink to="/" activeClassName="active-link vertical-nav-menu">
                <i className="fas fa-home menu-icon"></i>
                Home
              </NavLink>
            </div>
            <div className="option">
              <NavLink to="/aiModel" activeClassName="active-link vertical-nav-menu">
                <i className="fas fa-robot menu-icon"></i>
                AI Model
              </NavLink>
            </div>
            <div className="option">
              <NavLink to="/caseStudy" activeClassName="active-link vertical-nav-menu">
                <i className="fas fa-brain menu-icon"></i>
                Case Study
              </NavLink>
            </div>
          </>
        )}
        <div className="option" onClick={() => toggleOptions('option1')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
          <i className="fa-solid fa-chart-line menu-icon"></i>
            Classification
          </NavLink>
          {showOptions.option1 && (
            <div className="sub-options">
              <NavLink to="/classification" activeClassName="active-link">
                <i className="fa-solid fa-swatchbook"></i>
                &nbsp; Practical
              </NavLink>
              <NavLink to="/classificationTheory" activeClassName="active-link">
                <i className="fa-solid fa-book-open-reader"></i>
                &nbsp; Theory
              </NavLink>
            </div>
          )}
        </div>
        <div className="option" onClick={() => toggleOptions('option2')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
            <i className="fa-solid fa-gem menu-icon"></i>
            Clustering
          </NavLink>
          {showOptions.option2 && (
            <div className="sub-options">
              <NavLink to="/clustering" activeClassName="active-link">
                <i className="fa-solid fa-swatchbook"></i>
                &nbsp; Practical
              </NavLink>
              <NavLink to="/clusteringTheory" activeClassName="active-link">
                <i className="fa-solid fa-book-open-reader"></i>
                &nbsp; Theory
              </NavLink>
            </div>
          )}
        </div>
        <div className="option" onClick={() => toggleOptions('option3')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
            <i className="fa-solid fa-tasks menu-icon"></i>
            Data Visualization
          </NavLink>
          {showOptions.option3 && (
            <div className="sub-options">
              <NavLink to="/data-visualization" activeClassName="active-link">
                <i className="fa-solid fa-swatchbook"></i>
                &nbsp; Practical
              </NavLink>
              <NavLink to="/dataVisualizationTheory" activeClassName="active-link">
                <i className="fa-solid fa-book-open-reader"></i>
                &nbsp; Theory
              </NavLink>
            </div>
          )}
        </div>
        <div className="option" onClick={() => toggleOptions('option5')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
            <i className="fa-solid fa-money-bill-transfer menu-icon"></i>
            PCA<span className='text-white'>frserfer</span>
          </NavLink>
          {showOptions.option5 && (
            <div className="sub-options">
              <NavLink to="/pca" activeClassName="active-link">
                <i className="fa-solid fa-swatchbook"></i>
                &nbsp; Practical
              </NavLink>
              <NavLink to="/pcaTheory" activeClassName="active-link">
                <i className="fa-solid fa-book-open-reader"></i>
                &nbsp; Theory
              </NavLink>
            </div>
          )}
        </div>
        <div className="option" onClick={() => toggleOptions('option7')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
            <i className="fa-solid fa-credit-card menu-icon"></i>
            Regression
          </NavLink>
          {showOptions.option7 && (
            <div className="sub-options">
              <NavLink to="/regression" activeClassName="active-link">
                <i className="fa-solid fa-swatchbook"></i>
                &nbsp; Practical
              </NavLink>
              <NavLink to="/regressionTheory" activeClassName="active-link">
                <i className="fa-solid fa-book-open-reader"></i>
                &nbsp; Theory
              </NavLink>
            </div>
          )}
        </div>
        <div className="option" onClick={() => toggleOptions('option9')}>
          <NavLink activeClassName="active-link vertical-nav-menu">
            <i className="fa-solid fa-gem menu-icon"></i>
            Download Sample CSV Files
          </NavLink>
          {showOptions.option9 && (
            <div className="sub-options">
              <a href="/assets/csv/regression_sample.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For Regression
              </a>
              <a href="/assets/csv/pca_sample.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For PCA
              </a>
              <a href="/assets/csv/classification_sample.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For Classification
              </a>
              <a href="/assets/csv/clustering_sample.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For Clustering
              </a>
              <a href="/assets/csv/pie_bar.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For Pie and Bar Charts
              </a>
              <a href="/assets/csv/box.csv" download activeClassName="active-link vertical-nav-menu">
                <i className="fa-solid fa-download menu-icon"></i>
                &nbsp; For Box Plot
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'white', // Remove blue background
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon color="primary" />
              </IconButton>
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
                <img src="/assets/logo10.png" alt="Logo" style={{ height: '30px' }} />
              </Box>
              {!isMobile && (
                <>
                <NavLink to="/" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '10px', fontSize: '16px' }}>
                  Home
                </NavLink>
                <NavLink to="/caseStudy" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '15px', fontSize: '16px' }}>
                 Case Study
                </NavLink>
                <NavLink to="/aiModel" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '15px', fontSize: '16px' }}>
                  AI Model
                </NavLink>
              </>
              )}
            </Box>

            <Typography variant="h6" noWrap component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {userData ? (
                <div>
                  <IconButton onClick={handleClick} sx={{ color: '#007bff', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" sx={{ marginRight: '8px' }}>
        {userData.userName}
      </Typography>
      <AccountCircleIcon sx={{ fontSize: '24px' }} />
    </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        minWidth: 90,
                        color : "red"
                      },
                    }}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Link to="/login" className="nav-item nav-link active">
                  Login
                </Link>
              )}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;

