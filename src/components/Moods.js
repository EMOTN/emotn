// import React, { useState } from 'react';

// const Moods = () => {
//   const [selectedEmoji, setSelectedEmoji] = useState('');
//   const [selectedMood, setSelectedMood] = useState('');
//   const [customMood, setCustomMood] = useState('');
//   const [customEmoji, setCustomEmoji] = useState('');

//   const handleEmojiChange = (emoji) => {
//     setSelectedEmoji(emoji);
//   };

//   const handleCustomMoodChange = (e) => {
//     setCustomMood(e.target.value);
//   };

//   const handleCustomEmojiChange = (emoji) => {
//     setCustomEmoji(emoji);
//   };

//   const moodOptions = {
//     happy: ['Excited', 'Joyful', 'Content', 'Energetic'],
//     sad: ['Melancholy', 'Gloomy', 'Heartbroken', 'Lonely'],
//     angry: ['Furious', 'Annoyed', 'Frustrated', 'Resentful'],
//     fearful: ['Afraid', 'Nervous', 'Anxious', 'Terrified'],
//     surprised: ['Amazed', 'Shocked', 'Astounded', 'Speechless'],
//   };

//   return (
//     <div>
//       <div>
//         <h4>Select an Emoji:</h4>
//         <div>
//           <button
//             className={`emoji-button ${selectedEmoji === 'happy' ? 'selected' : ''}`}
//             onClick={() => handleEmojiChange('happy')}
//             type="button"
//           >
//             😊
//           </button>
//           <button
//             className={`emoji-button ${selectedEmoji === 'sad' ? 'selected' : ''}`}
//             onClick={() => handleEmojiChange('sad')}
//             type="button"
//           >
//             😢
//           </button>
//           <button
//             className={`emoji-button ${selectedEmoji === 'angry' ? 'selected' : ''}`}
//             onClick={() => handleEmojiChange('angry')}
//             type="button"
//           >
//             😡
//           </button>
//           <button
//             className={`emoji-button ${selectedEmoji === 'fearful' ? 'selected' : ''}`}
//             onClick={() => handleEmojiChange('fearful')}
//             type="button"
//           >
//             😨
//           </button>
//           <button
//             className={`emoji-button ${selectedEmoji === 'surprised' ? 'selected' : ''}`}
//             onClick={() => handleEmojiChange('surprised')}
//             type="button"
//           >
//             😮
//           </button>
//         </div>
//       </div>
//       {selectedEmoji && (
//         <div>
//           <h4>Select a Mood:</h4>
//           <select
//             name="mood"
//             value={selectedMood}
//             onChange={(e) => setSelectedMood(e.target.value)}
//           >
//             <option value="">Select Mood</option>
//             {moodOptions[selectedEmoji].map((mood) => (
//               <option key={mood} value={mood}>
//                 {mood}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
//       <div>
//       <h4>Custom Mood:</h4>
//             <input
//               type="text"
//               name="customMood"
//               placeholder="Enter Custom Mood"
//               value={customMood}
//               onChange={handleCustomMoodChange}
//             />
//         <div>
//           <button
//             className={`emoji-button ${customEmoji === 'happy' ? 'selected' : ''}`}
//             onClick={() => handleCustomEmojiChange('happy')}
//             type="button"
//           >
//             😊
//           </button>
//           <button
//             className={`emoji-button ${customEmoji === 'sad' ? 'selected' : ''}`}
//             onClick={() => handleCustomEmojiChange('sad')}
//             type="button"
//           >
//             😢
//           </button>
//           <button
//             className={`emoji-button ${customEmoji === 'angry' ? 'selected' : ''}`}
//             onClick={() => handleCustomEmojiChange('angry')}
//             type="button"
//           >
//             😡
//           </button>
//           <button
//             className={`emoji-button ${customEmoji === 'fearful' ? 'selected' : ''}`}
//             onClick={() => handleCustomEmojiChange('fearful')}
//             type="button"
//           >
//             😨
//           </button>
//           <button
//             className={`emoji-button ${customEmoji === 'surprised' ? 'selected' : ''}`}
//             onClick={() => handleCustomEmojiChange('surprised')}
//             type="button"
//           >
//             😮
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Moods;


import React, { useState } from 'react';

const Moods = ({ selectedMood, setSelectedMood, handleCustomMoodChange, handleCustomEmojiChange }) => {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [moodOptions, setMoodOptions] = useState([]);
  const [showMoodOptions, setShowMoodOptions] = useState(false);

  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedMood('');
    setShowMoodOptions(true);
  };

  const handleMoodChange = (e) => {
    setSelectedMood(e.target.value);
  };

  const toggleMoodOptions = () => {
    setShowMoodOptions(!showMoodOptions);
  };

  const handleCustomMoodInputChange = (e) => {
    handleCustomMoodChange(e.target.value);
    setSelectedEmoji('');
    setShowMoodOptions(false);
  };

  const handleCustomEmojiInputChange = (e) => {
    handleCustomEmojiChange(e.target.value);
    setSelectedEmoji(e.target.value);
    setSelectedMood('');
    setShowMoodOptions(false);
  };

  const moodOptionsData = {
    happy: ['Excited', 'Joyful', 'Content', 'Energetic'],
    sad: ['Melancholy', 'Gloomy', 'Heartbroken', 'Lonely'],
    angry: ['Furious', 'Annoyed', 'Frustrated', 'Resentful'],
    fearful: ['Afraid', 'Nervous', 'Anxious', 'Terrified'],
    surprised: ['Amazed', 'Shocked', 'Astounded', 'Speechless'],
  };

  return (
    <div>
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
      {selectedEmoji && showMoodOptions && (
        <div>
          <h4>Select a Mood:</h4>
          <select name="mood" value={selectedMood} onChange={handleMoodChange}>
            <option value="">Select Mood</option>
            {moodOptionsData[selectedEmoji].map((mood) => (
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
          onChange={handleCustomMoodInputChange}
        />
      </div>
      <div>
        <h4>Custom Emoji:</h4>
        <input
          type="text"
          name="customEmoji"
          placeholder="Enter Custom Emoji"
          onChange={handleCustomEmojiInputChange}
        />
      </div>
    </div>
  );
};

export default Moods;
