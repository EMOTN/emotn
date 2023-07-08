import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, auth } from "../config/firebase";
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
import { toDate, startOfDay, endOfDay } from "date-fns";
import AnonymousMessages from "./AnonymousMessages";
import "bootstrap/dist/css/bootstrap.css";
import NewEntryPrompt from "./prompt";
import Popup from "reactjs-popup";
import "./Dashboard.css";

const Dashboard = ({ user, selectedDate, setSelectedDate }) => {
  const [entries, setEntries] = useState([]);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (user && user.uid) {
          const startDate = startOfDay(selectedDate);
          const endDate = endOfDay(selectedDate);

          const q = query(
            collection(db, "entries"),
            where("userId", "==", user.uid),
            where("date", ">=", startDate),
            where("date", "<=", endDate)
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

  const fetchUser = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFirstName(userData.firstName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-6">
          <div className="downward">
            <div style={{ marginLeft: "65px" }}>
              <h1>Welcome to Your Journal {firstName}!</h1>
              {/* <button onClick={() => auth.signOut()}>Log Out</button> */}
            </div>
            <div className="entryButton">
              <Popup
                trigger={
                  <div className="button-container">
                    <button>Let's Start Writing!⚡️</button>
                  </div>
                }
                modal
              >
                <div>
                  <NewEntryPrompt />
                </div>
              </Popup>
            </div>
            <div className="leftColumn">
              {entries.length > 0 ? (
                <div className="entries">
                  {entries.map((entry) => (
                    <div key={entry.id}>
                      <span style={{ display: "block" }}>
                        <b>Date:</b>{" "}
                        {toDate(entry.date.toDate()).toLocaleDateString()}
                      </span>

                      <span style={{ display: "block" }}>
                        <b>Mood:</b> {entry.mood}
                      </span>
                      <span style={{ display: "block" }}>
                        <b>Prompt:</b> {entry.prompt}
                      </span>
                      <div
                        className="entryBody"
                        dangerouslySetInnerHTML={{
                          __html: entry.body
                            .replace(/^<p>/, "")
                            .replace(/<\/p>$/, ""),
                        }}
                      />
                      <hr></hr>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No entries available for the selected date.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="rightColumn">
              <img
                src="emotn.png"
                alt="Emotn"
                style={{ display: "block", margin: "0 auto" }}
              />
              <div className="calendar">
                <Calendar value={selectedDate} onChange={handleDateChange} />
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
    </div>
  );
};

export default Dashboard;
