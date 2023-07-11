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
  deleteDoc,
} from "firebase/firestore";
import { toDate, startOfDay, endOfDay } from "date-fns";
import AnonymousMessages from "./AnonymousMessages";
import "bootstrap/dist/css/bootstrap.css";
import NewEntryPrompt from "./prompt";
import Popup from "reactjs-popup";
import "./Dashboard.css";
import EditEntry from "./Editor/EditEntry";
import DailyPopup from "./DailyPopup";

const Dashboard = ({ user, selectedDate, setSelectedDate }) => {
  const [entries, setEntries] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [editedEntry, setEditedEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  const deleteEntry = async (id) => {
    try {
      const entryDoc = doc(db, "entries", id);
      await deleteDoc(entryDoc);
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const editEntry = (entry) => {
    setEditedEntry(entry);
    setEditMode(true);
  };

  const updateEntry = async (updatedEntry) => {
    try {
      const { id, prompt, ...entryData } = updatedEntry; // Exclude prompt from entry data

      const entryDoc = doc(db, "entries", id);

      if (prompt !== undefined) {
        entryData.prompt = prompt; // Add prompt to entryData if it is defined
      }

      await updateDoc(entryDoc, entryData); // Update entry using entryData

      setEntries((prevEntries) =>
        prevEntries.map((entry) => {
          if (entry.id === updatedEntry.id) {
            return { ...entry, ...entryData };
          }
          return entry;
        })
      );
      setEditedEntry(null);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-6">
          <div className="downward">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1px 30px 0",
              }}
            >
              <h1 style={{ marginRight: "auto" }}>
                Welcome to Your Journal {firstName}!
              </h1>

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
            </div>
            <div className="leftColumn">
              {entries.length > 0 ? (
                <div className="entries">
                  {entries.map((entry) => (
                    <div key={entry.id} className="entry">
                      <div className="entry-header">
                        <span className="entry-date">
                          <b>Date:</b>{" "}
                          {toDate(entry.date.toDate()).toLocaleDateString()}
                          {/* {new Date(entry.date.seconds * 1000).toLocaleDateString()} */}

                        </span>
                        <span className="entry-delete">
                          <button
                            className="deleteButton"
                            onClick={() => deleteEntry(entry.id)}
                          >
                            X
                          </button>
                          <button
                            className="editButton"
                            onClick={() => editEntry(entry)}
                          >
                            🖉
                          </button>
                        </span>
                      </div>
                      <span style={{ display: "block" }}>
                        <b>Mood:</b> {entry.mood} {entry.emoji}
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
                      <hr />
                      {editedEntry && editedEntry.id === entry.id && (
                        <Popup
                          trigger={
                            <div
                              className="editEntryButton"
                              onClick={() => editEntry(entry)} // Add onClick event to emoji
                            ></div>
                          }
                          modal
                          open={editMode} // Set the initial state of editMode to true
                          contentStyle={{ width: "1400px" }} // Adjust the width and maxWidth as needed
                        >
                          <div>
                            <EditEntry
                              entry={editedEntry}
                              updateEntry={updateEntry}
                              closePopup={() => setEditMode(false)}
                            />
                          </div>
                        </Popup>
                      )}
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
              {/* <DailyPopup /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
