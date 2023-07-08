// import {$getRoot, $getSelection} from 'lexical';
// import {useEffect, useState, useRef} from 'react';
// import './editor.css';

// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import {LexicalComposer} from '@lexical/react/LexicalComposer';
// import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
// import {ContentEditable} from '@lexical/react/LexicalContentEditable';
// import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
// import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
// import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';

// import { db } from '../../config/firebase';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import {useNavigate} from 'react-router-dom';

// function MyCustomAutoFocusPlugin() {
//     const [editor] = useLexicalComposerContext();

//     useEffect(() => {
//       // Focus the editor when the effect fires!
//       editor.focus();
//     }, [editor]);

//     return null;
//   }

// export const Editor = ({user, prompt}) => {
//   const onError = (error) => {
//       console.error(error);
//   }
//   const navigate = useNavigate();
//   const [isButtonOn, setIsButtonOn] = useState(false)

//   const myTheme = {
//     ltr: "ltr",
//     rtl: "rtl",
//     placeholder: "editor-placeholder",
//     paragraph: "editor-paragraph"
//   };

//   const initialConfig = {
//     namespace: 'MyEditor',
//     theme: myTheme,
//     onError,
//   };

//   const editorStateRef = useRef();

//   const onChange = (editorState) => {
//     editorStateRef.current = editorState
//     editorState.read(() => {
//       const text = $getRoot().getTextContent()
//       if (text.length > 0) {
//         setIsButtonOn(true)
//       } else {
//         setIsButtonOn(false)
//       }
//     })
//   }

//   const handleSave = () => {
//     if (!editorStateRef.current) { return }

//     editorStateRef.current.read(() => {
//       const text = $getRoot().getTextContent()
//       persistToFirebase(text)
//     })
//   }

//   const persistToFirebase = async (text) => {
//     try {
//       const entryRef = await addDoc(collection(db, 'entries'), {
//         body: text,
//         prompt: prompt,
//         created_at: serverTimestamp(),
//         userId: user.uid
//       });
//       navigate("/")
//     } catch(error) {
//       console.log("unable to save entry: ", error)
//     }
//   }
//   const renderPrompt = () => {
//     if (prompt) {
//       return <div className="prompt-container">{prompt}</div>
//     }
//   }
//   return (
//     <LexicalComposer initialConfig={initialConfig}>
//       {renderPrompt()}
//       <div className="editor-container">
//         <PlainTextPlugin
//           contentEditable={<ContentEditable className="editor-input" />}
//           // placeholder={<div>Enter some text...</div>}
//           ErrorBoundary={LexicalErrorBoundary}
//         />
//         <MyCustomAutoFocusPlugin />
//         <HistoryPlugin />
//         <OnChangePlugin onChange={onChange} />
//       </div>
//       <button onClick={handleSave} disabled={isButtonOn === false}>Save Entry</button>
//     </LexicalComposer>
//   );
// }

// export default Editor





// import { useState, useEffect } from "react";
// import { auth, db } from "../../config/firebase";
// import moment from "moment";
// import {
//   Timestamp,
//   selectedTimestamp,
//   serverTimestamp,
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   doc,
//   updateDoc,
//   arrayRemove,
//   getDoc,
//   arrayUnion,
//   setDoc,
// } from "firebase/firestore";

// import Popup from "reactjs-popup";
// import "reactjs-popup/dist/index.css";
// import NewEntryPrompt from "../prompt";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./editor.css";

// const Editor = ({ user, prompt }) => {
//   const [entries, setEntries] = useState([]);
//   const [newEntry, setNewEntry] = useState({ mood: "", date: "", body: "" });
//   const [selectedEmoji, setSelectedEmoji] = useState("");
//   const [selectedMood, setSelectedMood] = useState("");
//   const [customMood, setCustomMood] = useState("");
//   const [customEmoji, setCustomEmoji] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [firstName, setFirstName] = useState("");

//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         const q = query(
//           collection(db, "entries"),
//           where("userId", "==", user.uid)
//         );
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
//       const entryDoc = doc(db, "entries", id);
//       await deleteDoc(entryDoc);
//       setEntries((prevEntries) =>
//         prevEntries.filter((entry) => entry.id !== id)
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateEntryMood = async (id) => {
//     try {
//       const entryDoc = doc(db, "entries", id);
//       await updateDoc(entryDoc, { mood: newEntry.mood });

//       const userRef = doc(db, "users", user.uid);

//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const entryIndex = userData.entries.findIndex(
//           (entry) => entry.id === id
//         );

//         if (entryIndex !== -1) {
//           userData.entries[entryIndex].mood = newEntry.mood;
//           await updateDoc(userRef, { entries: userData.entries });
//         }
//       }

//       setEntries((prevEntries) =>
//         prevEntries.map((entry) =>
//           entry.id === id ? { ...entry, mood: newEntry.mood } : entry
//         )
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
//       const selectedDate = new Date(newEntry.date); // Parse the selected date

//       // Get the user's time zone offset in minutes
//       const userTimezoneOffset = selectedDate.getTimezoneOffset();

//       // Adjust the selected date using the time zone offset
//       const adjustedDate = moment(selectedDate).add(
//         userTimezoneOffset,
//         "minutes"
//       );

//       // Convert the adjusted date to a Firestore Timestamp
//       const selectedTimestamp = Timestamp.now();

//       const entryRef = await addDoc(collection(db, "entries"), {
//         ...newEntry,
//         mood: selectedMood || customMood,
//         userId: user.uid,
//         date: selectedTimestamp,
//         prompt: prompt,
//       });

//       const entryId = entryRef.id;

//       const userRef = doc(db, "users", user.uid);
//       await updateDoc(userRef, {
//         entries: arrayUnion({
//           id: entryId,
//           mood: selectedMood || customMood,
//           date: selectedTimestamp,
//           body: newEntry.body.replace(/^<p>/, "").replace(/<\/p>$/, ""),
//           prompt: prompt,
//         }),
//       });

//       setEntries((prevEntries) => [
//         ...prevEntries,
//         {
//           id: entryId,
//           mood: selectedMood || customMood,
//           ...newEntry,
//           prompt: prompt,
//         },
//       ]);
//       setNewEntry({ mood: "", date: "", body: "", prompt: "" });
//       setSelectedMood("");
//       setCustomMood("");
//       setSelectedEmoji("");
//       setCustomEmoji("");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEmojiChange = (emoji) => {
//     setSelectedEmoji(emoji);
//     setSelectedMood("");
//   };

//   const handleCustomMoodChange = (e) => {
//     setCustomMood(e.target.value);
//   };

//   const handleCustomEmojiChange = (emoji) => {
//     setCustomEmoji(emoji);
//   };

//   const moodOptions = {
//     happy: ["Excited", "Joyful", "Content", "Energetic"],
//     sad: ["Melancholy", "Gloomy", "Heartbroken", "Lonely"],
//     angry: ["Furious", "Annoyed", "Frustrated", "Resentful"],
//     fearful: ["Afraid", "Nervous", "Anxious", "Terrified"],
//     surprised: ["Amazed", "Shocked", "Astounded", "Speechless"],
//   };

//   const fetchUser = async () => {
//     try {
//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         setFirstName(userData.firstName);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [user]);

//   const renderPrompt = () => {
//     if (prompt) {
//       return <div className="prompt-container">{prompt}</div>;
//     }
//   };

//   const handleBodyChange = (value) => {
//     setNewEntry((prevEntry) => ({
//       ...prevEntry,
//       body: value,
//     }));
//   };

//   return (
//     <div>
//       {renderPrompt()}
//       <form onSubmit={addEntry}>
//         <div>
//           <h4>Select an Emoji:</h4>
//           <div>
//             <button
//               className={`emoji-button ${
//                 selectedEmoji === "happy" ? "selected" : ""
//               }`}
//               onClick={() => handleEmojiChange("happy")}
//               type="button"
//             >
//               😊
//             </button>
//             <button
//               className={`emoji-button ${
//                 selectedEmoji === "sad" ? "selected" : ""
//               }`}
//               onClick={() => handleEmojiChange("sad")}
//               type="button"
//             >
//               😢
//             </button>
//             <button
//               className={`emoji-button ${
//                 selectedEmoji === "angry" ? "selected" : ""
//               }`}
//               onClick={() => handleEmojiChange("angry")}
//               type="button"
//             >
//               😡
//             </button>
//             <button
//               className={`emoji-button ${
//                 selectedEmoji === "fearful" ? "selected" : ""
//               }`}
//               onClick={() => handleEmojiChange("fearful")}
//               type="button"
//             >
//               😨
//             </button>
//             <button
//               className={`emoji-button ${
//                 selectedEmoji === "surprised" ? "selected" : ""
//               }`}
//               onClick={() => handleEmojiChange("surprised")}
//               type="button"
//             >
//               😮
//             </button>
//           </div>
//         </div>
//         {selectedEmoji && (
//           <div>
//             <h4>Select a Mood:</h4>
//             <select
//               name="mood"
//               value={selectedMood}
//               onChange={(e) => setSelectedMood(e.target.value)}
//             >
//               <option value="">Select Mood</option>
//               {moodOptions[selectedEmoji].map((mood) => (
//                 <option key={mood} value={mood}>
//                   {mood}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         <div>
//           <h4>Custom Mood:</h4>
//           <input
//             type="text"
//             name="customMood"
//             placeholder="Enter Custom Mood"
//             value={customMood}
//             onChange={handleCustomMoodChange}
//           />
//           <div>
//             <button
//               className={`emoji-button ${
//                 customEmoji === "happy" ? "selected" : ""
//               }`}
//               onClick={() => handleCustomEmojiChange("happy")}
//               type="button"
//             >
//               😊
//             </button>
//             <button
//               className={`emoji-button ${
//                 customEmoji === "sad" ? "selected" : ""
//               }`}
//               onClick={() => handleCustomEmojiChange("sad")}
//               type="button"
//             >
//               😢
//             </button>
//             <button
//               className={`emoji-button ${
//                 customEmoji === "angry" ? "selected" : ""
//               }`}
//               onClick={() => handleCustomEmojiChange("angry")}
//               type="button"
//             >
//               😡
//             </button>
//             <button
//               className={`emoji-button ${
//                 customEmoji === "fearful" ? "selected" : ""
//               }`}
//               onClick={() => handleCustomEmojiChange("fearful")}
//               type="button"
//             >
//               😨
//             </button>
//             <button
//               className={`emoji-button ${
//                 customEmoji === "surprised" ? "selected" : ""
//               }`}
//               onClick={() => handleCustomEmojiChange("surprised")}
//               type="button"
//             >
//               😮
//             </button>
//           </div>
//         </div>
//         {/* <input
//           type="date"
//           name="date"
//           placeholder="Date"
//           value={
//             newEntry.date
//               ? new Date(newEntry.date).toISOString().substring(0, 10)
//               : ""
//           }
//           onChange={handleInputChange}
//         /> */}

//         <ReactQuill
//           value={newEntry.body}
//           onChange={handleBodyChange}
//           placeholder="Journal Entry"
//         />
//         <button type="submit" disabled={!selectedMood && !customMood}>
//           Add Entry
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Editor;


import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
} from 'firebase/firestore';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import NewEntryPrompt from '../prompt';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';

const Editor = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const location = useLocation();
  const { mood, emoji, prompt } = location.state || {};
  const [newEntry, setNewEntry] = useState({
    date: '',
    body: '',
    prompt: '',
    mood: '',
    emoji: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
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

    fetchEntries();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const addEntry = async (e) => {
    e.preventDefault();
    try {
      const selectedDate = new Date();
      const selectedTimestamp = Timestamp.fromDate(selectedDate);

      const entryData = {
        ...newEntry,
        userId: user.uid,
        date: selectedTimestamp,
        prompt: prompt || '', // Use the prop value if available, or an empty string
        mood: mood || '', // Use the prop value if available, or an empty string
        emoji: emoji || '', // Use the prop value if available, or an empty string
      };

      const entryRef = await addDoc(collection(db, 'entries'), entryData);
      const entryId = entryRef.id; // Assign the entry ID here

          // Add the entry to the user's entries
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      entries: arrayUnion({
        id: entryId,
        date: selectedTimestamp,
        body: newEntry.body,
        prompt: prompt || '',
        mood: mood || '',
        emoji: emoji || '',
      }),
    });

      setEntries((prevEntries) => [
        ...prevEntries,
        {
          id: entryId,
          ...newEntry,
        },
      ]);

      setNewEntry({ date: '', body: '', prompt: '', mood: '', emoji: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
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

  const renderPrompt = () => {
    if (prompt) {
      return <div className="prompt-container">{prompt}</div>;
    }
  };

  const handleBodyChange = (value) => {
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      body: value,
    }));
  };

  return (
    <div>
      {renderPrompt()}
      <form onSubmit={addEntry}>
        <ReactQuill
          value={newEntry.body}
          onChange={handleBodyChange}
          placeholder="Journal Entry"
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default Editor;
