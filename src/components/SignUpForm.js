import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
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

const defaultTheme = createTheme();

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        profileCreated: false,
      });

      const docSnap = await getDoc(userRef);

      // Check if the user's profile is already created
      if (docSnap.exists() && docSnap.data().profileCreated) {
        navigate("/"); // Redirect to the home page
      } else {
        navigate("/createUserProfile"); // Redirect to the create profile page
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signUp();
  };

  //Added lines 67-69
  const handleSignInLinkClick = () => {
    console.log("jhelloadd");
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "rgba(245, 166, 91, 0.6)", // Set the background color here
          padding: "20px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#6CAE75" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                sx={{ bgcolor: "#E8F0FE" }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                sx={{ bgcolor: "#E8F0FE" }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email-signup"
                label="Email Address"
                name="email"
                autoComplete="email"
                sx={{ bgcolor: "#E8F0FE" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password-signup"
                autoComplete="new-password"
                sx={{ bgcolor: "#E8F0FE" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="allowExtraEmails"
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
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#6CAE75",
              "&:hover": {
                bgcolor: "#5C964F", // Change the hover background color here
              },
            }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                variant="body2"
                // to={"/login"}
                onClick={handleSignInLinkClick}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpForm;
