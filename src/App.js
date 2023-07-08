import { useState, useEffect, useMemo } from 'react';
import { auth, db } from './config/firebase';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Auth from './components/auth';
import Home from './components/home';
import CreateUserProfile from './components/CreateUserProfile';
import AnonymousMessages from './components/AnonymousMessages'; // Import the component for anonymous messaging
import { doc, getDoc } from 'firebase/firestore';
import Editor from './components/Editor/Editor';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const [user, setUser] = useState(null); // Track user authentication status
  const [profileCreated, setProfileCreated] = useState(false); // Track user profile creation status
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const navigate = useNavigate();

  const handleCustomMoodChange = (e) => {
    setCustomMood(e.target.value);
  };

  const handleCustomEmojiChange = (emoji) => {
    setCustomEmoji(emoji);
  };


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

  let query = useQuery()

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={profileCreated ? <Home user={user} /> : <CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
        <Route path="/createUserProfile" element={<CreateUserProfile user={user} setProfileCreated={setProfileCreated} />} />
        <Route path="/anonymous-messages" element={<AnonymousMessages user={user} />} />
        <Route path="/new-journal-entry" element={<Editor
  user={user}
  prompt={query.get("prompt")}
  setSelectedMood={setSelectedMood}
  handleCustomMoodChange={handleCustomMoodChange}
  handleCustomEmojiChange={handleCustomEmojiChange}
/>} />
      </Routes>
    </div>
  );
}

export default App;
// if profileCreated is false, then user redirected to home page or create user profile page (existing users)
// if profileCreated is true, then user redirected to home page
