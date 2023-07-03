import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { Timestamp, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayRemove, getDoc, arrayUnion } from 'firebase/firestore';

//Nataliia's Code
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import NewEntryPrompt from './Prompt';

const AddEntryForm = ({ user, addEntry }) => {
  const [newEntry, setNewEntry] = useState({ mood: '', date: '', body: '' });
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedMood('');
  };

  const handleCustomMoodChange = (e) => {
    setCustomMood(e.target.value);
  };

  const handleCustomEmojiChange = (emoji) => {
    setCustomEmoji(emoji);
  };

  const moodOptions = {
    happy: ['Excited', 'Joyful', 'Content', 'Energetic'],
    sad: ['Melancholy', 'Gloomy', 'Heartbroken', 'Lonely'],
    angry: ['Furious', 'Annoyed', 'Frustrated', 'Resentful'],
    fearful: ['Afraid', 'Nervous', 'Anxious', 'Terrified'],
    surprised: ['Amazed', 'Shocked', 'Astounded', 'Speechless'],
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await addEntry(
  //       newEntry,
  //       selectedMood,
  //       customMood,
  //       selectedEmoji,
  //       customEmoji
  //     );

  //     setNewEntry({ mood: '', date: '', body: '' });
  //     setSelectedMood('');
  //     setCustomMood('');
  //     setSelectedEmoji('');
  //     setCustomEmoji('');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const entryRef = await addDoc(collection(db, 'entries'), {
        ...newEntry,
        mood: selectedMood || customMood,
        userId: user.uid,
      });

      const entryId = entryRef.id;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        entries: arrayUnion({
          id: entryId,
          mood: selectedMood || customMood,
          date: newEntry.date,
          body: newEntry.body,
        }),
      });

      setNewEntry({ mood: '', date: '', body: '' });
      setSelectedMood('');
      setCustomMood('');
      setSelectedEmoji('');
      setCustomEmoji('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add New Entry</h2>
      {/* Nataliia's Code */}
      <Popup trigger={<button> Let's get journaling⚡️</button>} modal>
          <div>
            <NewEntryPrompt/>
          </div>
        </Popup>
      <form onSubmit={handleSubmit}>
      <div>
            <h4>Select an Emoji:</h4>
            <div>
              <button
                className={`emoji-button ${selectedEmoji === 'happy' ? 'selected' : ''}`}
                onClick={() => handleEmojiChange('happy')}
                type="button"
              >
                😊
              </button>
              <button
                className={`emoji-button ${selectedEmoji === 'sad' ? 'selected' : ''}`}
                onClick={() => handleEmojiChange('sad')}
                type="button"
              >
                😢
              </button>
              <button
                className={`emoji-button ${selectedEmoji === 'angry' ? 'selected' : ''}`}
                onClick={() => handleEmojiChange('angry')}
                type="button"
              >
                😡
              </button>
              <button
                className={`emoji-button ${selectedEmoji === 'fearful' ? 'selected' : ''}`}
                onClick={() => handleEmojiChange('fearful')}
                type="button"
              >
                😨
              </button>
              <button
                className={`emoji-button ${selectedEmoji === 'surprised' ? 'selected' : ''}`}
                onClick={() => handleEmojiChange('surprised')}
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
                className={`emoji-button ${customEmoji === 'happy' ? 'selected' : ''}`}
                onClick={() => handleCustomEmojiChange('happy')}
                type="button"
              >
                😊
              </button>
              <button
                className={`emoji-button ${customEmoji === 'sad' ? 'selected' : ''}`}
                onClick={() => handleCustomEmojiChange('sad')}
                type="button"
              >
                😢
              </button>
              <button
                className={`emoji-button ${customEmoji === 'angry' ? 'selected' : ''}`}
                onClick={() => handleCustomEmojiChange('angry')}
                type="button"
              >
                😡
              </button>
              <button
                className={`emoji-button ${customEmoji === 'fearful' ? 'selected' : ''}`}
                onClick={() => handleCustomEmojiChange('fearful')}
                type="button"
              >
                😨
              </button>
              <button
                className={`emoji-button ${customEmoji === 'surprised' ? 'selected' : ''}`}
                onClick={() => handleCustomEmojiChange('surprised')}
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
            value={newEntry.date}
            onChange={handleInputChange}
          />
          <textarea
            name="body"
            placeholder="Journal Entry"
            value={newEntry.body}
            onChange={handleInputChange}
          ></textarea>
        <button type="submit" disabled={!selectedMood && !customMood} onClick={() => addEntry(newEntry, selectedMood, customMood, selectedEmoji, customEmoji)}>
          Add Entry
        </button>
      </form>
    </div>
  );
};

export default AddEntryForm;
