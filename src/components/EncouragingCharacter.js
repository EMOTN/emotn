import React, { useState, useEffect } from 'react';
import lottie from 'lottie-web';
import './encouragingPencil.css';

const EncouragingCharacter = ({ animationData }) => {
  const [encouragement, setEncouragement] = useState('');
  const messages = [
    "You're doing great! Keep up the good work!",
    "Believe in yourself. You can achieve anything!",
    "Take a deep breath and remember how amazing you are!"
  ];

  useEffect(() => {
    // Load the Lottie animation
    const animationContainer = document.getElementById('lottie-animation');
    const anim = lottie.loadAnimation({
      container: animationContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    // Set an interval to update the encouragement message every minute
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setEncouragement(messages[randomIndex]);
    }, 15000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
      anim.destroy();
    };
  }, [animationData]);

  useEffect(() => {
    // Initialize the encouragement message on component mount
    const randomIndex = Math.floor(Math.random() * messages.length);
    setEncouragement(messages[randomIndex]);
  }, []);

  return (
    <div className="encouraging-character-container">
      <div className="encouraging-character" id="lottie-animation"></div>
      <p>{encouragement}</p>
    </div>
  );
};

export default EncouragingCharacter;
