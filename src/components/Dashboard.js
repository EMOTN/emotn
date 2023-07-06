import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { toDate } from "date-fns";
// import { Link } from "react-router-dom";
import AnonymousMessages from "./AnonymousMessages";
import "bootstrap/dist/css/bootstrap.css";
import NewEntryPrompt from "./prompt";
import Popup from "reactjs-popup";

const Dashboard = ({ user, selectedDate, setSelectedDate }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (user && user.uid) {
          const startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          );
          const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

          const q = query(
            collection(db, "entries"),
            where("userId", "==", user.uid),
            where("date", ">=", startDate),
            where("date", "<", endDate)
          );

          const entriesSnapshot = await getDocs(q);
          const entriesData = entriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEntries(entriesData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntries();
  }, [user, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-6">
          <div className="leftColumn">
            <h2>Add New Entry</h2>
            <Popup trigger={<button> Let's get journaling⚡️</button>} modal>
              <div>
                <NewEntryPrompt />
              </div>
            </Popup>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id}>
                  <p>
                    Date: {toDate(entry.date.toDate()).toLocaleDateString()}
                  </p>
                  <p>Mood: {entry.mood}</p>
                  <p>Body: {entry.body}</p>
                </div>
              ))
            ) : (
              <p>No entries available for the selected date.</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-12">
              <div className="calendar">
                <Calendar value={selectedDate} onChange={handleDateChange} />
              </div>
            </div>
            <div className="col-12">
              <div className="messages">
                <AnonymousMessages user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
