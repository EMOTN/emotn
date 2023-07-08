// import { useState, useEffect } from 'react';
// import { db } from '../config/firebase';
// import { collection, query, getDocs } from 'firebase/firestore';
// import {useNavigate} from 'react-router-dom';

// export const NewEntryPrompt = () => {
//     const navigate = useNavigate();
//     const [prompt, setPrompt] = useState('')

//     useEffect(() => {
//         const fetchRandomPrompt = async () => {
//             const prompt = await getRandomPrompt()
//             setPrompt(prompt)
//         }

//         fetchRandomPrompt()
//     }, [])


//     //this grabs the prompt and passes it as a url query parameter in App.js as otherwise there's no access to it because of the absence of the redux store
//     const handleClick = () => {
//         let url = "/new-journal-entry"
//         if (prompt) {
//             let encodedPrompt = encodeURIComponent(prompt)
//             url += "?prompt=" + encodedPrompt
//         }
//         navigate(url)
//     }

//     const handleClickWithoutPrompt = () => {
//        navigate("/new-journal-entry")
//     }

//     return (
//         <div>
//             <h3>{prompt}</h3>
//             <button onClick={handleClick}>Answer</button>
//             <p>or</p>
//             <button onClick={handleClickWithoutPrompt}>I prefer to start with a blank page</button>
//         </div>
//     )
// }

// const getRandomPrompt = async () => {
//     const q = query(collection(db, 'Prompts'))
//     const promptsSnapshot = await getDocs(q);
//     const promptsData = promptsSnapshot.docs.map((p) => {
//         return p.data().prompt
//     })
//     const randomIndex = getRandomNumber(0, promptsData.length-1)

//     return promptsData[randomIndex]
// }

// const getRandomNumber = (a, b) => {
//     const randomDecimal = Math.random();
//     const randomNumber = randomDecimal * (b - a + 1) + a;
//     return Math.floor(randomNumber);
// }

// export default NewEntryPrompt;




import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Moods from './Moods';

const NewEntryPrompt = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
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
      emoji: getEmojiByMood(selectedMood || customMood),
      // Add other data fields for the entry
    };

    try {
      await addDoc(collection(db, 'entries'), entryData);
      navigate('/new-journal-entry', {
        state: {
          mood: selectedMood || customMood,
          emoji: getEmojiByMood(selectedMood || customMood),
          prompt: prompt,
        },
      });
    } catch (error) {
      console.error('Error adding entry: ', error);
    }
  };


  const handleClickWithoutPrompt = () => {
    navigate('/new-journal-entry');
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
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😡';
      case 'fearful':
        return '😨';
      case 'surprised':
        return '😮';
      // Add more cases for other moods and their corresponding emojis
      default:
        return '';
    }
  };

  return (
    <div>
      <h3>{prompt}</h3>
      <Moods
        setSelectedMood={setSelectedMood}
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
