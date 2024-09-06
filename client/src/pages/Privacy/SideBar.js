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
          <div className="option">
            <NavLink to="/" activeClassName="active-link vertical-nav-menu">
              <i className="fa-solid fa-home menu-icon"></i>
              Home<span className='text-white'>svcerfe</span>
            </NavLink>
          </div>
        )}
         <div className= "option">
              <NavLink to="/privacyPolicy" className=" vertical-nav-menu">
           
                Privacy And Policy
              </NavLink>
            </div>
            <div className= "option">
              <NavLink to="/masterservices" className=" vertical-nav-menu">
      
                Master Services Agreement
              </NavLink>
            </div>
            <div className=" option" >
              <NavLink to="/advisionbusinessPrivacy" activeClassName= "vertical-nav-menu">

                Advisions Business Privacy Statement
              </NavLink>
            </div>
            <div className="option" >
              <NavLink to="/instructorterms" activeClassName=" vertical-nav-menu">
    
                Instructor Terms
              </NavLink>
            </div>
            <div className="option">
              <NavLink to="/affiliateterms" activeClassName=" vertical-nav-menu">
         
                Affiliate Terms & Conditions
              </NavLink>
            </div>
            <div className="option">
              <NavLink to="/termsofuse" activeClassName=" vertical-nav-menu">
           
                Terms of Use
              </NavLink>
            </div>
            <div className="option">
              <NavLink to="/pricingpromotional" activeClassName=" vertical-nav-menu">
   
                Pricing & Promotions Policy
              </NavLink>
            </div>
           
            <div className="option">
              <NavLink to="/advisionsproterms" activeClassName=" vertical-nav-menu">
   
                Advisions Business Pro Terms & Conditions
              </NavLink>
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
                <NavLink to="/" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '10px', fontSize: '20px' }}>
                  Home
                </NavLink>
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


