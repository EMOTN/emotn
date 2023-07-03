import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';



const UserProfile = ({ profileData }) => {



  if (!profileData) {
    return <CircularProgress />;
  }
  return (
    <div>
      <h2>User Profile</h2>
      <p>First Name: {profileData.firstName}</p>
      <p>Last Name: {profileData.lastName}</p>
      <p>Date of Birth: {profileData.dateOfBirth}</p>
      <p>Phone Number: {profileData.phoneNumber}</p>
    </div>
  );
};

export default UserProfile;
