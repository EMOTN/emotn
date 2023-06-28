import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { collection, getDoc, query, where } from 'firebase/firestore';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        entries: [],
      });

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };


  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
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
          entries: [],
        });
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
        <div>
          <h1>Welcome to My Journal, {auth.currentUser.email}!</h1>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      ) : (
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
