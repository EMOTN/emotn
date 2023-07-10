import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CreateUserProfile from "./components/CreateUserProfile";
import AnonymousMessages from "./components/AnonymousMessages";
import About from "./components/About";
import Auth from "./components/auth";
import Home from "./components/home";
import UserProfile from "./components/UserProfile";
import Editor from "./components/Editor/Editor";
import Dashboard from "./components/Dashboard";
import { auth, db } from "./config/firebase";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function AppRoutes({
  profileCreated,
  setProfileCreated,
  handleProfileClick,
  profileData,
  setProfileData,
}) {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUserChange = (newUser) => {
    setUser(newUser);
  };

  const handleProtectedRouteAccess = (routePath) => {
    if (!user) {
      navigate("/login");
    } else if (!profileCreated && routePath !== "/createUserProfile") {
      navigate("/createUserProfile");
    }
  };

  let query = useQuery();

  if (!user) {
    return <Auth />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Auth
              user={user}
              handleUserChange={handleUserChange}
              setProfileCreated={setProfileCreated}
              setProfileData={setProfileData}
            />
          }
        />

        {profileCreated ? (
          <Route path="/" element={<Dashboard user={user} />} />
        ) : (
          <Route
            path="/"
            element={
              <CreateUserProfile
                user={user}
                setProfileCreated={setProfileCreated}
              />
            }
          />
        )}

        <Route
          path="/createUserProfile"
          element={
            <CreateUserProfile
              user={user}
              setProfileCreated={setProfileCreated}
              setProfileData={setProfileData}
            />
          }
        />
        <Route
          path="/anonymous-messages"
          element={<AnonymousMessages user={user} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/home"
          element={<Home/>}
          // onClick={() => handleProtectedRouteAccess("/home")}
        />
        {user && (
          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={user}
                profileCreated={profileCreated} // Pass the profileCreated prop to the Dashboard component
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            }
            onClick={() => handleProtectedRouteAccess("/dashboard")}
          />
        )}
        <Route
          path="/login"
          element={<Auth user={user} handleUserChange={handleUserChange} />}
        />
        <Route
          path="/profile"
          element={<UserProfile profileData={profileData} />}
          onClick={() => handleProtectedRouteAccess("/profile")}
        />
        <Route
          path="/new-journal-entry"
          element={
            <Editor
              user={user}
              mood={query.get("mood")}
              prompt={query.get("prompt")}
            />
          } // added "mood"
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
