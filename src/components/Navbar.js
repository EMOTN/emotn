
import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserProfile from './UserProfile'


const pages = [
  {title:'About', path:'/about'},
  {title:'Home', path:'/home'},
  {title:'Log In/Sign Up', path:'/login'}
];

// Function to get the initials from a name
const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  return names
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase();
};

function ResponsiveAppBar({isAuthenticated}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileData, setProfileData] = useState(null); // State to store user profile data

  const navigate = useNavigate();

  const handleLogout = () => {
    auth
    .signOut()
      .then(() => {
        // Clear user session or perform any other necessary cleanup
        // Redirect to login page
        navigate('/login');
      })
      .catch((error) => {
        // Handle logout error if necessary
        console.log('Logout error:', error);
      });
  };

  const handleProfileClick = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.data();
          setProfileData(userData);
          console.log(userData)
        }
      }
    } catch (error) {
      console.error(error);
    }

  };
  const handleProfileLinkClick = () => {
    handleProfileClick();
    navigate('/profile');
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    { title: 'Profile', action: handleProfileLinkClick },
    { title: 'Account', action: null },
    { title: 'Dashboard', action: null },
    { title: 'Logout', action: handleLogout },
  ];


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" component={Link} to={page.path}>
                    {page.title}
                    </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link
                key={page.title}
                to={page.path}
                onClick={handleCloseNavMenu}
                style={{ textDecoration: 'none' }}
                >
                <Button
                key={page.title}
                sx={{ my: 2, color: 'white', display: 'block' }}
                >
               {page.title}
              </Button>
              </Link>
            ))}
          </Box>
          {/* Add the profile data rendering here
        {profileData && (
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {profileData.firstName} {profileData.lastName}
          </Typography>
        )}
            {profileData && (
             <Typography variant="body1" sx={{ mr: 2 }}>
        <UserProfile profileData={profileData} /></Typography>
      )} */}
          {/* {profileData && (
      <Typography variant="body1" sx={{ mr: 2 }}>
        <Link to="/profile" onClick={handleProfileLinkClick}>
         {profileData.firstName} {profileData.lastName}
        </Link>
      </Typography>
    )} */}
       {/* Add the profile data rendering here */}
       {/* {profileData && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {profileData.firstName} {profileData.lastName}
            </Typography>
          )}
          {profileData && (
            <Box sx={{ mr: 2 }}>
              <UserProfile profileData={profileData} />
            </Box>
          )} */}

          {isAuthenticated && profileData && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {profileData.firstName} {profileData.lastName}
              </Typography>
              <Box sx={{ mr: 2 }}>
                <UserProfile profileData={profileData} />
              </Box>
            </>
          )}


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={getInitials(profileData?.firstName + ' ' + profileData?.lastName)} src="/static/images/avatar/2.jpg" />
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
              </IconButton>
            </Tooltip>
            <Menu
  sx={{ mt: '45px' }}
  id="menu-appbar"
  anchorEl={anchorElUser}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  keepMounted
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  open={Boolean(anchorElUser)}
  onClose={handleCloseUserMenu}
>
  {settings.map((setting) => {
    if (setting.title === 'Profile') {
      return (
        <MenuItem key={setting.title} onClick={handleProfileLinkClick}>
          <Typography textAlign="center">{setting.title}</Typography>
        </MenuItem>
      );
    } else if (setting.title === 'Logout') {
      return (
        <MenuItem key={setting.title} onClick={handleLogout}>
          <Typography textAlign="center">{setting.title}</Typography>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem key={setting.title} onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{setting.title}</Typography>
        </MenuItem>
      );
    }
  })}
</Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
