import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateUserProfile from './components/CreateUserProfile2';
import AnonymousMessages from './components/AnonymousMsg2';
// import ResponsiveAppBar from './components/Navbar';
import About from './components/About2';
import Auth from './components/Auth2'
import Home from './components/Home2';
import UserProfile from './components/UserProfile';
// import { Link } from 'react-router-dom';



function AppRoutes({ user, profileCreated, setProfileCreated, handleProfileClick, profileData, setProfileData }) {



  return (
    <>

    {/* {user && ( // Conditionally render ResponsiveAppBar if user is logged in
      <ResponsiveAppBar handleProfileClick={handleProfileClick}>
        <Link to="/profile">Profile</Link>
      </ResponsiveAppBar>
    )} */}
    <Routes>
      <Route
        path="/"
        element={
          profileCreated ? (
            <Home user={user} />
          ) : (
            <CreateUserProfile
              user={user}
              setProfileCreated={setProfileCreated}
              setProfileData={setProfileData} // Pass the setProfileData function to CreateUserProfile
            />
          )
        }
      />
      <Route
        path="/createUserProfile"
        element={
          <CreateUserProfile
            user={user}
            setProfileCreated={setProfileCreated}
            setProfileData={setProfileData} // Pass the setProfileData function to CreateUserProfile
          />
        }
      />
      <Route path="/anonymous-messages" element={<AnonymousMessages user={user} />} />
      <Route path="/about" element={<About />} />
      <Route path="/home" element={<Home user={user} />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/profile" element={<UserProfile profileData={profileData} />} />
    </Routes>
    {/* {profileData && (
      <UserProfile profileData={profileData} />
    )} */}
  </>
);
}

export default AppRoutes;
