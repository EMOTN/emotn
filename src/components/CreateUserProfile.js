import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./createUserProfile.css";

const CreateUserProfile = ({ user, setProfileCreated }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleProfileCreation = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        profileCreated: true,
        entries: [], // Initialize entries as an empty array
      });

      setProfileCreated(true); // Set the profileCreated state to true
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-profile">
      <h2>Create Your Profile</h2>
      <input
        style={{ margin: "5px" }}
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
      />
      <input
        style={{ margin: "5px" }}
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        type="text"
      />
      <input
        style={{ margin: "5px" }}
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        type="date"
      />
      <input
        style={{ margin: "5px" }}
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        type="text"
      />
      <button
        style={{ display: "block", margin: "0 auto" }}
        onClick={handleProfileCreation}
      >
        Create Profile
      </button>
    </div>
  );
};

export default CreateUserProfile;
