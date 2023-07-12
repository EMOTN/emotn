import React, { useState, useEffect } from "react";
import { auth, db } from "./config/firebase";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "./components/Navbar";
import AppRoutes from "./AppRoutes";
import { doc, getDoc } from "firebase/firestore";
import './App.css'


function App() {
  const [user, setUser] = useState(null); // Track user authentication status
  const [profileData, setProfileData] = useState(null);
  const [profileCreated, setProfileCreated] = useState(false); // Track user profile creation status
  const navigate = useNavigate();

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        // Check if the user's profile is already created
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().profileCreated) {
          setProfileCreated(true);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleProfileClick = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setProfileData(userData);
        navigate("/profile"); // Navigate to the '/profile' route
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };


  return (
    <div className="App">
      <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />
      <AppRoutes
        user={user}
        profileCreated={profileCreated}
        setProfileCreated={setProfileCreated}
        handleProfileClick={handleProfileClick}
        profileData={profileData}
        setProfileData={setProfileData}
      />
    </div>
  );
}

export default App;




