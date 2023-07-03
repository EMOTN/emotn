import React, { useState, useEffect } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


export default function HypeserverDatepicker({ user }) {
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (user && user.uid) {
          const q = query(
            collection(db, "entries"),
            where("userId", "==", user.uid)
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
  }, [user]);
  const onChange = (selectedDate) => {
    setDate(selectedDate);
  };
  return (
    <div>
      <div className="calendar">
        <Calendar date={date} onChange={onChange} />
      </div>
      <div className="entries">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id}>
              <p>
                Date: {entry.date && entry.date.toDate().toLocaleDateString()}
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
  );
}









