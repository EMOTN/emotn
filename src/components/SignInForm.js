import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,

} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";



const SignInForm = () => {
  const navigate = useNavigate(); // Initialize the navigate variable
    // Define the email and setEmail state variables using useState
    // const [email, setEmail] = useState("");
    // // Define the password and setPassword state variables using useState
    // const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");




    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Check if the user's profile is already created
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().profileCreated) {
        navigate("/dashboard"); // Redirect to the user's dashboard
      } else {
        navigate("/createUserProfile"); // Redirect to the create profile page
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
      const userRef = doc(db, "users", user.uid);
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
        navigate("/dashboard"); // Redirect to the home page
      } else {
        navigate("/createUserProfile"); // Redirect to the create profile page
      }
    } catch (error) {
      console.error(error);
    }
  };
  //Added lines 81-84
  const handleSignUpLinkClick = () => {
    console.log("hello signup")
    navigate("/signup")

  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "rgba(245, 166, 91, 0.6)", // Set the background color here
            padding: "20px",
            minHeight: "100vh"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#6CAE75" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField

              margin="normal"
              required
              fullWidth
              id="email-signin"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              // value={email} // Add the value prop
              // onChange={(e) => setEmail(e.target.value)} // Add the onChange prop to update the email state
              InputProps={{
                sx: {
                  '& fieldset': {
                    backgroundColor: '#f1ece4',
                  },
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password-signin"
              autoComplete="current-password"
              // value={password} // Add the value prop
              // onChange={(e) => setPassword(e.target.value)} // Add the onChange prop to update the password state
              InputProps={{
                sx: {
                  '& fieldset': {
                    backgroundColor: '#f1ece4',
                  },
                }
              }}
            />
            <FormControlLabel
              control={
              <Checkbox
              value="remember"
              color="primary"
              sx={{
                color: "#f1ece4",
                "&:hover": {
                  color: "#5C964F", // Change the checkbox color on hover
                },
                "&.Mui-checked": {
                  color: "#5C964F", // Change the checkbox color when checked
                },
              }}
              />
              }
              label="Remember me"
              />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#6CAE75",  "&:hover": {
                bgcolor: "#5C964F", // Change the hover background color here
              },}}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#6CAE75",  "&:hover": {
                bgcolor: "#5C964F", // Change the hover background color here
              },}}
              onClick={handleSignInWithGoogle}
            >
              Sign In with Google
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2"
                // to={"/signup"}
                onClick={handleSignUpLinkClick}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignInForm;
