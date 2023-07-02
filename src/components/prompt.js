import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export const getRandomPrompt = async () => {
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
  


  