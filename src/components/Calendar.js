// import React, { useState, useEffect } from "react";
// import { Calendar } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import { db } from "../config/firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";


// export default function HypeserverDatepicker({ user }) {
//   const [date, setDate] = useState(new Date());
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         if (user && user.uid) {
//           const q = query(
//             collection(db, "entries"),
//             where("userId", "==", user.uid),
//             where("date", "==", date) // Add a filter to query entries for the selected date
//           );
//           const entriesSnapshot = await getDocs(q);
//           const entriesData = entriesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setEntries(entriesData);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchEntries();
//   }, [user, date]); // Add "date" as a dependency



//   const onChange = (selectedDate) => {
//     setDate(selectedDate);
//   };
//   return (
//     <div>
//       <div className="calendar">
//         <Calendar date={date} onChange={onChange} />
//       </div>
//       <div className="entries">
//         {entries.length > 0 ? (
//           entries.map((entry) => (
//             <div key={entry.id}>
//               <p>
//                 Date: {entry.date && entry.date.toDate().toLocaleDateString()}
//               </p>
//               <p>Mood: {entry.mood}</p>
//               <p>Body: {entry.body}</p>
//             </div>
//           ))
//         ) : (
//           <p>No entries available for the selected date.</p>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toDate } from "date-fns";

const TestCalendar = ({ user, selectedDate, setSelectedDate }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (user && user.uid) {
          const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
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
    <div>
      <div className="calendar">
        <Calendar value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="entries">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id}>
              <p>Date: {toDate(entry.date).toLocaleDateString()}</p>
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
};

export default TestCalendar;