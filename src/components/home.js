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

const Home = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ mood: "", date: "", body: "" });
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [customMood, setCustomMood] = useState("");
  const [customEmoji, setCustomEmoji] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchEntries = async () => {
      try {
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntries();
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

  const updateEntryMood = async (id) => {
    try {
      const entryDoc = doc(db, "entries", id);
      await updateDoc(entryDoc, { mood: newEntry.mood });

      const userRef = doc(db, "users", user.uid);

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const entryIndex = userData.entries.findIndex(
          (entry) => entry.id === id
        );

        if (entryIndex !== -1) {
          userData.entries[entryIndex].mood = newEntry.mood;
          await updateDoc(userRef, { entries: userData.entries });
        }
      }

      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === id ? { ...entry, mood: newEntry.mood } : entry
        )
      );
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
      const selectedDate = new Date(newEntry.date); // Parse the selected date

      // Get the user's time zone offset in minutes
      const userTimezoneOffset = selectedDate.getTimezoneOffset();

      // Adjust the selected date using the time zone offset
      const adjustedDate = moment(selectedDate).add(
        userTimezoneOffset,
        "minutes"
      );

      // Convert the adjusted date to a Firestore Timestamp
      const selectedTimestamp = Timestamp.fromDate(adjustedDate.toDate());

      const entryRef = await addDoc(collection(db, "entries"), {
        ...newEntry,
        mood: selectedMood || customMood,
        userId: user.uid,
        date: selectedTimestamp,
      });

      const entryId = entryRef.id;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        entries: arrayUnion({
          id: entryId,
          mood: selectedMood || customMood,
          date: selectedTimestamp,
          body: newEntry.body,
        }),
      });

      setEntries((prevEntries) => [
        ...prevEntries,
        { id: entryId, mood: selectedMood || customMood, ...newEntry },
      ]);
      setNewEntry({ mood: "", date: "", body: "" });
      setSelectedMood("");
      setCustomMood("");
      setSelectedEmoji("");
      setCustomEmoji("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedMood("");
  };

  const handleCustomMoodChange = (e) => {
    setCustomMood(e.target.value);
  };

  const handleCustomEmojiChange = (emoji) => {
    setCustomEmoji(emoji);
  };

  const moodOptions = {
    happy: ["Excited", "Joyful", "Content", "Energetic"],
    sad: ["Melancholy", "Gloomy", "Heartbroken", "Lonely"],
    angry: ["Furious", "Annoyed", "Frustrated", "Resentful"],
    fearful: ["Afraid", "Nervous", "Anxious", "Terrified"],
    surprised: ["Amazed", "Shocked", "Astounded", "Speechless"],
  };

  return (
    <div>
      <h1>Welcome to My Journal, {user.email}!</h1>
      <button onClick={() => auth.signOut()}>Log Out</button>

      <div>
        <h2>Add New Entry</h2>
        <Popup trigger={<button> Let's get journaling⚡️</button>} modal>
          <div>
            <NewEntryPrompt />
          </div>
        </Popup>
        <form onSubmit={addEntry}>
          <div>
            <h4>Select an Emoji:</h4>
            <div>
              <button
                className={`emoji-button ${
                  selectedEmoji === "happy" ? "selected" : ""
                }`}
                onClick={() => handleEmojiChange("happy")}
                type="button"
              >
                😊
              </button>
              <button
                className={`emoji-button ${
                  selectedEmoji === "sad" ? "selected" : ""
                }`}
                onClick={() => handleEmojiChange("sad")}
                type="button"
              >
                😢
              </button>
              <button
                className={`emoji-button ${
                  selectedEmoji === "angry" ? "selected" : ""
                }`}
                onClick={() => handleEmojiChange("angry")}
                type="button"
              >
                😡
              </button>
              <button
                className={`emoji-button ${
                  selectedEmoji === "fearful" ? "selected" : ""
                }`}
                onClick={() => handleEmojiChange("fearful")}
                type="button"
              >
                😨
              </button>
              <button
                className={`emoji-button ${
                  selectedEmoji === "surprised" ? "selected" : ""
                }`}
                onClick={() => handleEmojiChange("surprised")}
                type="button"
              >
                😮
              </button>
            </div>
          </div>
          {selectedEmoji && (
            <div>
              <h4>Select a Mood:</h4>
              <select
                name="mood"
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
              >
                <option value="">Select Mood</option>
                {moodOptions[selectedEmoji].map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <h4>Custom Mood:</h4>
            <input
              type="text"
              name="customMood"
              placeholder="Enter Custom Mood"
              value={customMood}
              onChange={handleCustomMoodChange}
            />
            <div>
              <button
                className={`emoji-button ${
                  customEmoji === "happy" ? "selected" : ""
                }`}
                onClick={() => handleCustomEmojiChange("happy")}
                type="button"
              >
                😊
              </button>
              <button
                className={`emoji-button ${
                  customEmoji === "sad" ? "selected" : ""
                }`}
                onClick={() => handleCustomEmojiChange("sad")}
                type="button"
              >
                😢
              </button>
              <button
                className={`emoji-button ${
                  customEmoji === "angry" ? "selected" : ""
                }`}
                onClick={() => handleCustomEmojiChange("angry")}
                type="button"
              >
                😡
              </button>
              <button
                className={`emoji-button ${
                  customEmoji === "fearful" ? "selected" : ""
                }`}
                onClick={() => handleCustomEmojiChange("fearful")}
                type="button"
              >
                😨
              </button>
              <button
                className={`emoji-button ${
                  customEmoji === "surprised" ? "selected" : ""
                }`}
                onClick={() => handleCustomEmojiChange("surprised")}
                type="button"
              >
                😮
              </button>
            </div>
          </div>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={
              newEntry.date
                ? new Date(newEntry.date).toISOString().substring(0, 10)
                : ""
            }
            onChange={handleInputChange}
          />

          <textarea
            name="body"
            placeholder="Journal Entry"
            value={newEntry.body}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit" disabled={!selectedMood && !customMood}>
            Add Entry
          </button>
        </form>
      </div>

      <div>
        <h2>Calendar</h2>
        <Dashboard
          user={user}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Home;
