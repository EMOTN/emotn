

import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Moods from './Moods';

const NewEntryPrompt = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');

  useEffect(() => {
    const fetchRandomPrompt = async () => {
      const prompt = await getRandomPrompt();
      setPrompt(prompt);
    };

    fetchRandomPrompt();
  }, []);


  const handleClick = async () => {
    const entryData = {
      prompt: prompt,
      mood: selectedMood || customMood,
      emoji: selectedEmoji,
      // Add other data fields for the entry
    };

    try {
      await addDoc(collection(db, 'entries'), entryData);
      navigate('/new-journal-entry', {
        state: {
          mood: selectedMood || customMood,
          emoji: selectedEmoji,
          prompt: prompt,
        },
      });
    } catch (error) {
      console.error('Error adding entry: ', error);
    }
  };


  // const handleClickWithoutPrompt = () => {
  //   navigate('/new-journal-entry');
  // };
  const handleClickWithoutPrompt = async () => {
    const entryData = {
      prompt: '',
      mood: selectedMood || customMood,
      emoji: selectedEmoji,
      // Add other data fields for the entry
    };

    try {
      await addDoc(collection(db, 'entries'), entryData);
      navigate('/new-journal-entry', {
        state: {
          mood: selectedMood || customMood,
          emoji: selectedEmoji,
          prompt: '',
        },
      });
    } catch (error) {
      console.error('Error adding entry: ', error);
    }
  };


  const handleCustomMoodChange = (e) => {
    setCustomMood(e.target.value);
  };

  const handleCustomEmojiChange = (emoji) => {
    setCustomEmoji(emoji);
  };

  const getEmojiByMood = (mood) => {
    switch (mood) {
      case 'happy':
        return String.fromCodePoint(0x1F60A); // 😊
      case 'sad':
        return String.fromCodePoint(0x1F622); // 😢
      case 'angry':
        return String.fromCodePoint(0x1F621); // 😡
      case 'fearful':
        return String.fromCodePoint(0x1F628); // 😨
      case 'surprised':
        return String.fromCodePoint(0x1F62E); // 😮
      // Add more cases for other moods and their corresponding Unicode code points
      default:
        return '';
    }
  };



  return (
    <div>
      <h3>{prompt}</h3>
      <Moods
        setSelectedMood={setSelectedMood}
        setSelectedEmoji={setSelectedEmoji}
        handleCustomMoodChange={handleCustomMoodChange}
        handleCustomEmojiChange={handleCustomEmojiChange}
      />
      <button onClick={handleClick}>Answer</button>
      <p>or</p>
      <button onClick={handleClickWithoutPrompt}>I prefer to start with a blank page</button>
    </div>
  );
};

const getRandomPrompt = async () => {
  const promptsSnapshot = await getDocs(collection(db, 'Prompts'));
  const promptsData = promptsSnapshot.docs.map((p) => {
    return p.data().prompt;
  });
  const randomIndex = getRandomNumber(0, promptsData.length - 1);

  return promptsData[randomIndex];
};

const getRandomNumber = (a, b) => {
  const randomDecimal = Math.random();
  const randomNumber = randomDecimal * (b - a + 1) + a;
  return Math.floor(randomNumber);
};

export default NewEntryPrompt;
