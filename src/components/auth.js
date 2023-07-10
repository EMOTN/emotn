import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        profileCreated: false,
      });

      setEmail("");
      setPassword("");
      navigate('/createUserProfile'); // Redirect to the create profile page
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");

      // Check if the user's profile is already created
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().profileCreated) {
        navigate('/'); // Redirect to the home page
      } else {
        navigate('/createUserProfile'); // Redirect to the create profile page
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user is signing up for the first time
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userRef, {
          email: user.email,
          profileCreated: false,
        });
      }

      // Check if the user's profile is already created
      if (docSnap.exists() && docSnap.data().profileCreated) {
        navigate('/'); // Redirect to the home page
      } else {
        navigate('/createUserProfile'); // Redirect to the create profile page
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {auth.currentUser ? (
        // Logged in state
        <div>
          <h1>Welcome to My Journal, {auth.currentUser.email}!</h1>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      ) : (
        // Not logged in state
        <div>
          <h1>Please sign up or log in to start writing entries!</h1>
        
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} type="email" />
          <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} type="password" />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={signIn}>Sign In</button>
          <button onClick={signInWithGoogle}>Sign In/Up With Google</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
