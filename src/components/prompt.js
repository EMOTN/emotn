import { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import { Moods } from './Moods'
import lottie from 'lottie-web';
import animationData from '../animations/strongPencil.json';
import './prompt.css';

export const NewEntryPrompt = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('')
    const [mood, setMood] = useState('')
    const [emoji, setEmoji] = useState('')
    const animationContainerRef = useRef(null);

  useEffect(() => {
    const fetchRandomPrompt = async () => {
      const prompt = await getRandomPrompt();
      setPrompt(prompt);
    };

    fetchRandomPrompt();
  }, []);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy();
    };
  }, []);

   const handleClick = () => {
    navigateToEditor(true);
  };

    const handleClickWithoutPrompt = () => {
        navigateToEditor(false)
    }

    const navigateToEditor = (shouldIncludePrompt) => {
        let url = "/new-journal-entry"

         // URLSearchParams is a class/object to help build urls
         // we use it to add the mood and prompt to the url
        let searchParams = new URLSearchParams()

        if (mood && mood.length > 0) {
            searchParams.append('mood', mood)
        }
        if (emoji && emoji.length > 0) {
            searchParams.append('emoji', emoji)
        }

        if (shouldIncludePrompt && prompt) {
            searchParams.append('prompt', prompt)
        }

        if (searchParams.size > 0) {
            url += "?" + searchParams.toString()
        }
        navigate(url)
    }

     const moodChangeHandler = (newMood, newEmoji) => {
        setMood(newMood)
        setEmoji(newEmoji)
    }

    return (
      <div className="new-entry-prompt-container">
        <div className="animation-container prompt-animation" ref={animationContainerRef}></div>
        <div className="prompt-content">
          <Moods onMoodChange={moodChangeHandler} />
          <h3>{prompt}</h3>
          <button onClick={handleClick}>Answer</button>
          <p>or</p>
          <button onClick={handleClickWithoutPrompt}>I prefer to start with a blank page</button>
        </div>
      </div>
    );
  };

const getRandomPrompt = async () => {
  const q = query(collection(db, "Prompts"));
  const promptsSnapshot = await getDocs(q);
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
