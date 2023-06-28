import './App.css';
import { useState, useEffect } from 'react';
import { auth, db } from './config/firebase';
import { useNavigate } from 'react-router-dom';
import Auth from './components/auth';
import Home from './components/home';

function App() {
  const [user, setUser] = useState(null); // Track user authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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
      <Home user={user} />
    </div>
  );
}

export default App;
