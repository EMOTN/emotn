import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { Timestamp, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayRemove, getDoc, arrayUnion } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import HypeserverDatepicker from "./Calendar2";
import EntryList from './EntryList2';
import AddEntryForm from './AddEntryForm2';

const Home = ({ user }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, 'entries'), where('userId', '==', user?.uid));
        const entriesSnapshot = await getDocs(q);
        const entriesData = entriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(entriesData);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
    fetchEntries();
    }
  }, [user]);

  const deleteEntry = async (id) => {
    try {
      const entryDoc = doc(db, 'entries', id);
      await deleteDoc(entryDoc);
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateEntryMood = async (id, newEntry) => {
    try {
      const entryDoc = doc(db, 'entries', id);
      await updateDoc(entryDoc, { mood: newEntry.mood });

      const userRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const entryIndex = userData.entries.findIndex((entry) => entry.id === id);

        if (entryIndex !== -1) {
          userData.entries[entryIndex].mood = newEntry.mood;
          await updateDoc(userRef, { entries: userData.entries });
        }
      }

      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? { ...entry, mood: newEntry.mood } : entry))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addEntry = async (newEntry, selectedMood, customMood, selectedEmoji, customEmoji) => {
    try {
      const entryRef = await addDoc(collection(db, 'entries'), {
        ...newEntry,
        mood: selectedMood || customMood, // Use selectedMood if available, otherwise use customMood
        userId: user.uid,
      });

      const entryId = entryRef.id;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        entries: arrayUnion({
          id: entryId,
          mood: selectedMood || customMood, // Use selectedMood if available, otherwise use customMood
          date: newEntry.date,
          body: newEntry.body,
        }),
      });

      setEntries((prevEntries) => [
        ...prevEntries,
        { id: entryId, mood: selectedMood || customMood, ...newEntry },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h1>Welcome to My Journal, {user.email}!</h1>
        <button onClick={() => auth.signOut()}>Log Out</button>
        <AddEntryForm
          user={user}
          addEntry={addEntry}
        />
        <Link to="/anonymous-messages">Write/Request Nice Messages</Link>
        <HypeserverDatepicker />
      </div>
      <EntryList
        entries={entries}
        deleteEntry={deleteEntry}
        updateEntryMood={updateEntryMood}
      />
    </>
  );
};

export default Home;













// import { useState, useEffect } from 'react';
// import { auth, db } from '../config/firebase';
// import { Timestamp, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayRemove, getDoc, arrayUnion } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import HypeserverDatepicker from "./Calendar";


// const Home = ({ user }) => {
//   const [entries, setEntries] = useState([]);
//   const [newEntry, setNewEntry] = useState({ mood: '', date: '', body: '' });
//   const [selectedEmoji, setSelectedEmoji] = useState('');
//   const [selectedMood, setSelectedMood] = useState('');
//   const [customMood, setCustomMood] = useState('');
//   const [customEmoji, setCustomEmoji] = useState('');

//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
//         const entriesSnapshot = await getDocs(q);
//         const entriesData = entriesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEntries(entriesData);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchEntries();
//   }, [user]);

//   const deleteEntry = async (id) => {
//     try {
//       const entryDoc = doc(db, 'entries', id);
//       await deleteDoc(entryDoc);
//       setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateEntryMood = async (id) => {
//     try {
//       const entryDoc = doc(db, 'entries', id);
//       await updateDoc(entryDoc, { mood: newEntry.mood });

//       const userRef = doc(db, 'users', user.uid);

//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const entryIndex = userData.entries.findIndex((entry) => entry.id === id);

//         if (entryIndex !== -1) {
//           userData.entries[entryIndex].mood = newEntry.mood;
//           await updateDoc(userRef, { entries: userData.entries });
//         }
//       }

//       setEntries((prevEntries) =>
//         prevEntries.map((entry) => (entry.id === id ? { ...entry, mood: newEntry.mood } : entry))
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEntry((prevEntry) => ({
//       ...prevEntry,
//       [name]: value,
//     }));
//   };

//   const addEntry = async (e) => {
//     e.preventDefault();
//     try {
//       const entryRef = await addDoc(collection(db, 'entries'), {
//         ...newEntry,
//         mood: selectedMood || customMood, // Use selectedMood if available, otherwise use customMood
//         userId: user.uid,
//       });

//       const entryId = entryRef.id;

//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, {
//         entries: arrayUnion({
//           id: entryId,
//           mood: selectedMood || customMood, // Use selectedMood if available, otherwise use customMood
//           date: newEntry.date,
//           body: newEntry.body,
//         }),
//       });





//       setEntries((prevEntries) => [
//         ...prevEntries,
//         { id: entryId, mood: selectedMood || customMood, ...newEntry },
//       ]);
//       setNewEntry({ mood: '', date: '', body: '' });
//       setSelectedMood('');
//       setCustomMood('');
//       setSelectedEmoji('');
//       setCustomEmoji('');
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   const handleEmojiChange = (emoji) => {
//     setSelectedEmoji(emoji);
//     setSelectedMood('');
//   };

//   const handleCustomMoodChange = (e) => {
//     setCustomMood(e.target.value);
//   };

//   const handleCustomEmojiChange = (emoji) => {
//     setCustomEmoji(emoji);
//   };

//   const moodOptions = {
//     happy: ['Excited', 'Joyful', 'Content', 'Energetic'],
//     sad: ['Melancholy', 'Gloomy', 'Heartbroken', 'Lonely'],
//     angry: ['Furious', 'Annoyed', 'Frustrated', 'Resentful'],
//     fearful: ['Afraid', 'Nervous', 'Anxious', 'Terrified'],
//     surprised: ['Amazed', 'Shocked', 'Astounded', 'Speechless'],
//   };

//   return (
//     <>

//     <div>
//       <h1>Welcome to My Journal, {user.email}!</h1>
//       <button onClick={() => auth.signOut()}>Log Out</button>

//       <div>
//         <h2>Add New Entry</h2>
//         <form onSubmit={addEntry}>
//           <div>
//             <h4>Select an Emoji:</h4>
//             <div>
//               <button
//                 className={`emoji-button ${selectedEmoji === 'happy' ? 'selected' : ''}`}
//                 onClick={() => handleEmojiChange('happy')}
//                 type="button"
//               >
//                 😊
//               </button>
//               <button
//                 className={`emoji-button ${selectedEmoji === 'sad' ? 'selected' : ''}`}
//                 onClick={() => handleEmojiChange('sad')}
//                 type="button"
//               >
//                 😢
//               </button>
//               <button
//                 className={`emoji-button ${selectedEmoji === 'angry' ? 'selected' : ''}`}
//                 onClick={() => handleEmojiChange('angry')}
//                 type="button"
//               >
//                 😡
//               </button>
//               <button
//                 className={`emoji-button ${selectedEmoji === 'fearful' ? 'selected' : ''}`}
//                 onClick={() => handleEmojiChange('fearful')}
//                 type="button"
//               >
//                 😨
//               </button>
//               <button
//                 className={`emoji-button ${selectedEmoji === 'surprised' ? 'selected' : ''}`}
//                 onClick={() => handleEmojiChange('surprised')}
//                 type="button"
//               >
//                 😮
//               </button>
//             </div>
//           </div>
//           {selectedEmoji && (
//             <div>
//               <h4>Select a Mood:</h4>
//               <select
//                 name="mood"
//                 value={selectedMood}
//                 onChange={(e) => setSelectedMood(e.target.value)}
//               >
//                 <option value="">Select Mood</option>
//                 {moodOptions[selectedEmoji].map((mood) => (
//                   <option key={mood} value={mood}>
//                     {mood}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//           <div>
//             <h4>Custom Mood:</h4>
//             <input
//               type="text"
//               name="customMood"
//               placeholder="Enter Custom Mood"
//               value={customMood}
//               onChange={handleCustomMoodChange}
//             />
//             <div>
//               <button
//                 className={`emoji-button ${customEmoji === 'happy' ? 'selected' : ''}`}
//                 onClick={() => handleCustomEmojiChange('happy')}
//                 type="button"
//               >
//                 😊
//               </button>
//               <button
//                 className={`emoji-button ${customEmoji === 'sad' ? 'selected' : ''}`}
//                 onClick={() => handleCustomEmojiChange('sad')}
//                 type="button"
//               >
//                 😢
//               </button>
//               <button
//                 className={`emoji-button ${customEmoji === 'angry' ? 'selected' : ''}`}
//                 onClick={() => handleCustomEmojiChange('angry')}
//                 type="button"
//               >
//                 😡
//               </button>
//               <button
//                 className={`emoji-button ${customEmoji === 'fearful' ? 'selected' : ''}`}
//                 onClick={() => handleCustomEmojiChange('fearful')}
//                 type="button"
//               >
//                 😨
//               </button>
//               <button
//                 className={`emoji-button ${customEmoji === 'surprised' ? 'selected' : ''}`}
//                 onClick={() => handleCustomEmojiChange('surprised')}
//                 type="button"
//               >
//                 😮
//               </button>
//             </div>
//           </div>
//           <input
//             type="date"
//             name="date"
//             placeholder="Date"
//             value={newEntry.date}
//             onChange={handleInputChange}
//           />
//           <textarea
//             name="body"
//             placeholder="Journal Entry"
//             value={newEntry.body}
//             onChange={handleInputChange}
//           ></textarea>
//           <button type="submit" disabled={!selectedMood && !customMood}>
//             Add Entry
//           </button>
//         </form>
//       </div>
//       <Link to="/anonymous-messages">Write/Request Nice Messages</Link>
//       <HypeserverDatepicker />
//     </div>
//     {/* Render existing entries */}
//     {entries.length > 0 ? (
//         <div>
//           <h2>Existing Entries</h2>
//           <ul>
//             {entries.map((entry) => (
//               <li key={entry.id}>
//                 <p>Mood: {entry.mood}</p>
//                 <p>Date: {entry.date}</p>
//                 <p>Body: {entry.body}</p>
//                 {/* Delete entry button */}
//                 <button onClick={() => deleteEntry(entry.id)}>Delete</button>
//                 {/* Update mood button */}
//                  <button onClick={() => updateEntryMood(entry.id)}>Update Mood</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No entries found.</p>
//       )}
//     </>
//   );
// };

// export default Home;
