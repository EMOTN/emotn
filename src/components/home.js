import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import moment from "moment";
import {
  Timestamp,
  selectedTimestamp,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import Dashboard from "./Dashboard";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import NewEntryPrompt from "./prompt";

const Home = () => {


  return (
    <div>
      <div>
        <h1>This is the Home Page</h1>
        {/* <Dashboard
          user={user}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        /> */}
      </div>
    </div>
  );
};

export default Home;
