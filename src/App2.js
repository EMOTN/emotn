import React, { useState, useEffect } from 'react';
import { auth, db } from './config/firebase';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { doc, getDoc } from 'firebase/firestore';
import Auth from './components/Auth2'
// import ResponsiveAppBar from './components/Navbar';
// import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null); // Track user authentication status
  const [profileData, setProfileData] = React.useState(null);

  const [profileCreated, setProfileCreated] = useState(false); // Track user profile creation status
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        // Check if the user's profile is already created
        const userRef = doc(db, 'users', user.uid);
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

  if (!user) {
    return <Auth />;
  }
  const handleProfileClick = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setProfileData(userData);
        navigate('/profile'); // Navigate to the '/profile' route
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };


  return (
    <div className="App">
      {/* <ResponsiveAppBar /> */}
      <AppRoutes
      user={user}
      profileCreated={profileCreated}
      setProfileCreated={setProfileCreated}
      handleProfileClick={handleProfileClick} // Pass the handleProfileClick function
      profileData={profileData}
      setProfileData={setProfileData} // Pass the setProfileData function to update the profileData state
      />
      {/* <UserProfile profileData={profileData} /> */}
    </div>
  );
}

export default App;






// import { useState, useEffect } from 'react';
// import { auth, db } from './config/firebase';
// import { useNavigate, Routes, Route } from 'react-router-dom';
// import Auth from './components/auth';
// import Home from './components/home';
// import CreateUserProfile from './components/CreateUserProfile';
// import AnonymousMessages from './components/AnonymousMessages'; // Import the component for anonymous messaging
// import { doc, getDoc } from 'firebase/firestore';

// function App() {
//   const [user, setUser] = useState(null); // Track user authentication status
//   const [profileCreated, setProfileCreated] = useState(false); // Track user profile creation status
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       setUser(user);

//       if (user) {
//         // Check if the user's profile is already created
//         const userRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists() && docSnap.data().profileCreated) {
//           setProfileCreated(true);
//         }
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   if (!user) {
//     return <Auth />;
//   }

//   return (
//     <div className="App">
//       <Routes>

//         <Route path="/" element={profileCreated ? <Home user={user} /> : <CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
//         <Route path="/createUserProfile" element={<CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
//         <Route path="/anonymous-messages" element={<AnonymousMessages user={user} />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// if profileCreated is false, then user redirected to home page or create user profile page (existing users)
// if profileCreated is true, then user redirected to home page
