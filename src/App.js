import { useState, useEffect } from 'react';
import { auth, db } from './config/firebase';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Auth from './components/auth';
import Home from './components/home';
import CreateUserProfile from './components/CreateUserProfile';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null); // Track user authentication status
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

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={profileCreated ? <Home user={user} /> : <CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
        <Route path="/createUserProfile" element={<CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
      </Routes>
    </div>
  );
}

export default App;
// if profileCreated is false, then user redirected to home page or create user profile page (existing users)
// if profileCreated is true, then user redirected to home page
