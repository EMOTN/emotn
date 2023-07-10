import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Moods } from "./Moods";

export const NewEntryPrompt = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("");

  useEffect(() => {
    const fetchRandomPrompt = async () => {
      const prompt = await getRandomPrompt();
      setPrompt(prompt);
    };

    fetchRandomPrompt();
  }, []);

  const handleClick = () => {
    navigateToEditor(true);
  };

  const handleClickWithoutPrompt = () => {
    navigateToEditor(false);
  };

  const navigateToEditor = (shouldIncludePrompt) => {
    let url = "/new-journal-entry";

    // URLSearchParams is a class/object to help build urls
    // we use it to add the mood and prompt to the url
    let searchParams = new URLSearchParams();

    if (mood && mood.length > 0) {
      searchParams.append("mood", mood);
    }

    if (shouldIncludePrompt && prompt) {
      searchParams.append("prompt", prompt);
    }

    if (searchParams.size > 0) {
      url += "?" + searchParams.toString();
    }

    navigate(url);
  };

  const moodChangeHandler = (newMood) => {
    setMood(newMood);
  };

  return (
    <div>
      <Moods onMoodChange={moodChangeHandler} />
      <h3>{prompt}</h3>
      <button onClick={handleClick}>Answer</button>
      <p>or</p>
      <button onClick={handleClickWithoutPrompt}>
        I prefer to start with a blank page
      </button>
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
