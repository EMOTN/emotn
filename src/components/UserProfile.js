import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [updatedProfileData, setUpdatedProfileData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
  });

  const fetchProfileData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.data();
          setProfileData(userData);
          setUpdatedProfileData(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, updatedProfileData, { merge: true });
        // Optional: Show a success message or perform any other action
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating user profile data:", error);
      // Optional: Show an error message or perform error handling
    }
  };

  if (!profileData) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={updatedProfileData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={updatedProfileData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="text"
            name="dateOfBirth"
            value={updatedProfileData.dateOfBirth}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={updatedProfileData.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
