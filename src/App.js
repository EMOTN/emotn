import React, { useState, useEffect } from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, db } from "./config/firebase";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "./components/Navbar";
import AppRoutes from "./AppRoutes";
import { doc, getDoc } from "firebase/firestore";
import './App.css'
import Footer from "./components/Footer";

const theme = createTheme();
theme.typography.h2 = {
  fontSize: "100px",
  "@media (max-width: 1199px)": {
    fontSize: "42px"
  }
};
// theme.components.MuiFormControl = {
//   fontSize: '100px',
//   color: 'red'
// }

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

    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
      <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />
      <Footer />
 <AppRoutes
     user={user}
       profileCreated={profileCreated}
        setProfileCreated={setProfileCreated}
        handleProfileClick={handleProfileClick}
        profileData={profileData}
        setProfileData={setProfileData}
       />

      </React.StrictMode>
    </ThemeProvider>
  </StyledEngineProvider>

);
}

export default App;






