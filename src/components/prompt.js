import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';

export const NewEntryPrompt = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('')

    useEffect(() => {
        const fetchRandomPrompt = async () => {
            const prompt = await getRandomPrompt()
            setPrompt(prompt)
        }

        fetchRandomPrompt()
    }, [])

    const handleClick = () => {
        navigate("/new-journal-entry")
    }

    return (
        <div>
            <h3>{prompt}</h3>
            <button onClick={handleClick}>Answer</button>
            <p>or</p>
            <button>I prefer to start with a blank page</button>
        </div>
    )
}

const getRandomPrompt = async () => {
    const q = query(collection(db, 'Prompts')) 
    const promptsSnapshot = await getDocs(q);
    const promptsData = promptsSnapshot.docs.map((p) => {
        return p.data().prompt
    })
    const randomIndex = getRandomNumber(0, promptsData.length-1)

    return promptsData[randomIndex]
}

const getRandomNumber = (a, b) => {
    const randomDecimal = Math.random();
    const randomNumber = randomDecimal * (b - a + 1) + a;
    return Math.floor(randomNumber);
}
  
export default NewEntryPrompt;


  