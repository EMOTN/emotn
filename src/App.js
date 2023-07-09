import React,{ useState, useEffect, useMemo } from 'react';
import { auth, db } from './config/firebase';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Auth from './components/auth';
import { doc, getDoc } from 'firebase/firestore';
import ResponsiveAppBar from './components/Navbar';
import AppRoutes from './AppRoutes';


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


  if (!user) {
    return (
      <div className="App">
        <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />
        <Auth user={user} handleUserChange={setUser} />
      </div>
    );
  }


  return (

    <div className="App">

        <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />

      <AppRoutes
      user={user}
      profileCreated={profileCreated}
      setProfileCreated={setProfileCreated}
      handleProfileClick={handleProfileClick} // Pass the handleProfileClick function
      profileData={profileData}
      setProfileData={setProfileData} // Pass the setProfileData function to update the profileData state
      />


    </div>
  );
}

export default App;







// function useQuery() {
//   const { search } = useLocation();

//   return useMemo(() => new URLSearchParams(search), [search]);
// }

// function App() {
//   const [user, setUser] = useState(null); // Track user authentication status
//   const [profileCreated, setProfileCreated] = useState(false); // Track user profile creation status

//   //Added this line 7/7
//   const [profileData, setProfileData] = React.useState(null);
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

//   let query = useQuery()

//   if (!user) {
//     return <Auth />;
//   }

//   const handleProfileClick = async () => {
//     try {
//       const userRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         const userData = docSnap.data();
//         setProfileData(userData);
//         navigate('/profile'); // Navigate to the '/profile' route
//       }
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//     }
//   };


//   if (!user) {
//     return (
//       <div className="App">
//         <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />
//         <Auth user={user} handleUserChange={setUser} />
//       </div>
//     );
//   }

//   return (
//     <div className="App">
//       <ResponsiveAppBar handleProfileClick={handleProfileClick} user={user} />
//       <Routes>
//         <Route path="/" element={profileCreated ? <Home user={user} /> : <CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
//         <Route path="/createUserProfile" element={<CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
//         <Route path="/anonymous-messages" element={<AnonymousMessages user={user} />} />
//         <Route path="/new-journal-entry" element={<Editor user={user} prompt={query.get("prompt")} />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// if profileCreated is false, then user redirected to home page or create user profile page (existing users)
// if profileCreated is true, then user redirected to home page
