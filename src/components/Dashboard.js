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
import { toDate, startOfDay, endOfDay } from "date-fns";
import AnonymousMessages from "./AnonymousMessages";
import "bootstrap/dist/css/bootstrap.css";
import NewEntryPrompt from "./prompt";
import Popup from "reactjs-popup";
import "./Dashboard.css";

const Dashboard = ({ user, selectedDate, setSelectedDate }) => {
  const [entries, setEntries] = useState([]);

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

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-6">
          <div className="leftColumn">
            <div className="entryButton">
              <Popup
                trigger={
                  <div className="button-container">
                    <button>Let's get journaling⚡️</button>
                  </div>
                }
                modal
              >
                <div>
                  <NewEntryPrompt />
                </div>
              </Popup>
            </div>
            {entries.length > 0 ? (
              <div className="entries">
                {entries.map((entry) => (
                  <div key={entry.id}>
                    <p className="entryLabel">
                      <b>Date:</b>{" "}
                      {toDate(entry.date.toDate()).toLocaleDateString()}
                    </p>

                    <p className="entryLabel">
                      <b>Mood:</b> {entry.mood}
                    </p>
                    <p className="entryLabel">
                      <b>Prompt:</b> {entry.prompt}
                    </p>
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
        <div className="col-md-6">
          <div className="row">
            <div className="rightColumn">
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
