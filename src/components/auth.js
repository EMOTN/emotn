import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import './auth.css'

import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme();


const Auth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Added line 16
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const handleSignUp = async () => {
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

  const handleSignIn = async () => {
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

  const handleSignInWithGoogle = async () => {
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
        navigate('/dashboard'); // Redirect to the home page
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


  //added lines 92-94
  const toggleForm = () => {
    setShowSignUpForm(!showSignUpForm); // Toggle the state to show/hide sign-up form
  };

  return (
    <ThemeProvider theme={theme}>
    <div className='container'>
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

          {showSignUpForm ? (
          <SignInForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            handleSignInWithGoogle={handleSignInWithGoogle}
            toggleForm={toggleForm}
          />
          ) : (
          <SignUpForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSignUp={handleSignUp}
            handleSignInWithGoogle={handleSignInWithGoogle}
            toggleForm={toggleForm}
          />
          )}
        </div>
      )}
    </div>
    </ThemeProvider>
  );
};

export default Auth;




// import { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
// import { setDoc, doc, getDoc } from 'firebase/firestore';
// import { auth, googleProvider, db } from '../config/firebase';
// import { useNavigate } from 'react-router-dom';
// import SignInForm from './SignInForm'
// import SignUpForm from './SignUpForm';


// const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const signUp = async () => {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);

//       const userRef = doc(db, 'users', user.uid);
//       await setDoc(userRef, {
//         email: user.email,
//         profileCreated: false,
//       });

//       setEmail("");
//       setPassword("");
//       navigate('/createUserProfile'); // Redirect to the create profile page
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signIn = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       setEmail("");
//       setPassword("");

//       // Check if the user's profile is already created
//       const userRef = doc(db, 'users', auth.currentUser.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Check if the user is signing up for the first time
//       const userRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userRef);
//       if (!docSnap.exists()) {
//         // Create a new user document if it doesn't exist
//         await setDoc(userRef, {
//           email: user.email,
//           profileCreated: false,
//         });
//       }

//       // Check if the user's profile is already created
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       {auth.currentUser ? (
//         // Logged in state
//         <div>
//           <h1>Welcome to My Journal, {auth.currentUser.email}!</h1>
//           <button onClick={handleSignOut}>Logout</button>
//         </div>
//       ) : (
//         // Not logged in state
//         <div>
//           <h1>Please sign up or log in to start writing entries!</h1>
//           <SignInForm />
//           <SignUpForm />

//         </div>
//       )}
//     </div>
//   );
// };

// export default Auth;









//This uses a switch button***
// import { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
// import { setDoc, doc, getDoc } from 'firebase/firestore';
// import { auth, googleProvider, db } from '../config/firebase';
// import { useNavigate } from 'react-router-dom';
// import SignInForm from './SignInForm'
// import SignUpForm from './SignUpForm';


// const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false); // State to track if user wants to sign up
//   const navigate = useNavigate();

//   const handleFormToggle = () => {
//     setIsSignUp(!isSignUp);
//   };

//   const signUp = async () => {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);

//       const userRef = doc(db, 'users', user.uid);
//       await setDoc(userRef, {
//         email: user.email,
//         profileCreated: false,
//       });

//       setEmail("");
//       setPassword("");
//       navigate('/createUserProfile'); // Redirect to the create profile page
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signIn = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       setEmail("");
//       setPassword("");

//       // Check if the user's profile is already created
//       const userRef = doc(db, 'users', auth.currentUser.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Check if the user is signing up for the first time
//       const userRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userRef);
//       if (!docSnap.exists()) {
//         // Create a new user document if it doesn't exist
//         await setDoc(userRef, {
//           email: user.email,
//           profileCreated: false,
//         });
//       }

//       // Check if the user's profile is already created
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       {auth.currentUser ? (
//         // Logged in state
//         <div>
//           <h1>Welcome to My Journal, {auth.currentUser.email}!</h1>
//           <button onClick={handleSignOut}>Logout</button>
//         </div>
//       ) : (
//         // Not logged in state
//         <div>
//           <h1>Please sign up or log in to start writing entries!</h1>
//           {isSignUp ? (
//             <SignUpForm />
//           ) : (
//             <SignInForm />
//           )}
//           <button onClick={handleFormToggle}>
//             {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Auth;







//This code below is the original code****
// import { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
// import { setDoc, doc, getDoc } from 'firebase/firestore';
// import { auth, googleProvider, db } from '../config/firebase';
// import { useNavigate } from 'react-router-dom';
// import SignInForm from './SignInForm'
// import SignUpForm from './SignUpForm';


// const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const signUp = async () => {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);

//       const userRef = doc(db, 'users', user.uid);
//       await setDoc(userRef, {
//         email: user.email,
//         profileCreated: false,
//       });

//       setEmail("");
//       setPassword("");
//       navigate('/createUserProfile'); // Redirect to the create profile page
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signIn = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       setEmail("");
//       setPassword("");

//       // Check if the user's profile is already created
//       const userRef = doc(db, 'users', auth.currentUser.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Check if the user is signing up for the first time
//       const userRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userRef);
//       if (!docSnap.exists()) {
//         // Create a new user document if it doesn't exist
//         await setDoc(userRef, {
//           email: user.email,
//           profileCreated: false,
//         });
//       }

//       // Check if the user's profile is already created
//       if (docSnap.exists() && docSnap.data().profileCreated) {
//         navigate('/'); // Redirect to the home page
//       } else {
//         navigate('/createUserProfile'); // Redirect to the create profile page
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       {auth.currentUser ? (
//         // Logged in state
//         <div>
//           <h1>Welcome to My Journal, {auth.currentUser.email}!</h1>
//           <button onClick={handleSignOut}>Logout</button>
//         </div>
//       ) : (
//         // Not logged in state
//         <div>
//           <h1>Please sign up or log in to start writing entries!</h1>

//           <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} type="email" />
//           <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} type="password" />
//           <button onClick={signUp}>Sign Up</button>
//           <button onClick={signIn}>Sign In</button>
//           <button onClick={signInWithGoogle}>Sign In/Up With Google</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Auth;





