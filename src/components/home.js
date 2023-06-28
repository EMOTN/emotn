import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayRemove, getDoc, arrayUnion } from 'firebase/firestore';

const Home = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ mood: '', date: '', body: '' });
  const [updatedMood, setUpdatedMood] = useState('');

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

  const updateEntryMood = async (id) => {
    try {
      const entryDoc = doc(db, 'entries', id);
      await updateDoc(entryDoc, { mood: updatedMood });

      const userRef = doc(db, 'users', user.uid);

      // Get the user's document data
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Find the index of the entry to be updated in the user's entries array
        const entryIndex = userData.entries.findIndex((entry) => entry.id === id);

        if (entryIndex !== -1) {
          // Update the mood of the entry in the user's entries array
          userData.entries[entryIndex].mood = updatedMood;

          // Update the user's document with the modified entries array
          await updateDoc(userRef, { entries: userData.entries });
        }
      }

      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? { ...entry, mood: updatedMood } : entry))
      );
      setUpdatedMood(''); // Clear the updatedMood state
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
      const entryRef = await addDoc(collection(db, 'entries'), {
        ...newEntry,
        userId: user.uid,
      });

      const entryId = entryRef.id;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        entries: arrayUnion({ id: entryId, mood: newEntry.mood, date: newEntry.date, body: newEntry.body }),
      });

      setEntries((prevEntries) => [...prevEntries, { id: entryId, ...newEntry }]);
      setNewEntry({ mood: '', date: '', body: '' });
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div>
      <h1>Welcome to My Journal, {user.email}!</h1>
      <button onClick={() => auth.signOut()}>Log Out</button>

      <div>
        <h2>Add New Entry</h2>
        <form onSubmit={addEntry}>
          <input
            type="text"
            name="mood"
            placeholder="Mood"
            value={newEntry.mood}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={newEntry.date}
            onChange={handleInputChange}
          />
          <textarea
            name="body"
            placeholder="Journal Entry"
            value={newEntry.body}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit">Add Entry</button>
        </form>
      </div>

      <div>
        <h2>My Entries</h2>
        {entries.map((entry) => (
          <div key={entry.id}>
            <h2>{entry.mood}</h2>
            <p>Date: {entry.date}</p>
            <p>{entry.body}</p>

            {entry.userId === user.uid && (
              <div>
                <button onClick={() => deleteEntry(entry.id)}>Delete Entry</button>

                <input
                  type="text"
                  placeholder="New Mood"
                  value={updatedMood}
                  onChange={(e) => setUpdatedMood(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevent propagation of click event to parent elements
                />
                <button onClick={() => updateEntryMood(entry.id)}>Update Mood</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
