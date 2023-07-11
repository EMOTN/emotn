import React, { useState, useEffect } from 'react';

export const Moods = ( {onMoodChange} ) => {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');

  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleMoodChange = (e) => {
    setSelectedMood(e.target.value)
  }

  const handleCustomMoodChange = (e) => {
    setCustomMood(e.target.value);
  };

//prioritizes customMood over selectedMood in case they're both selected
  useEffect(() => {
    const mood = customMood || selectedMood
    const emoji = customEmoji || selectedEmoji
    onMoodChange(mood,emoji)
  }, [selectedMood, customMood, onMoodChange, selectedEmoji, customEmoji]);

  const handleCustomEmojiChange = (emoji) => {
    setCustomEmoji(emoji);
  };

  const moodOptions = {
    '😊': ['Excited', 'Joyful', 'Content', 'Energetic'],
    '😢': ['Melancholy', 'Gloomy', 'Heartbroken', 'Lonely'],
    '😡': ['Furious', 'Annoyed', 'Frustrated', 'Resentful'],
    '😨': ['Afraid', 'Nervous', 'Anxious', 'Terrified'],
    '😮': ['Amazed', 'Shocked', 'Astounded', 'Speechless'],
  };

  return (
    <div>
      <div>
        <h4>Select an Emoji:</h4>
        <div>
          <button
            className={`emoji-button ${selectedEmoji === 'happy' ? 'selected' : ''}`}
            onClick={() => handleEmojiChange('😊')}
            type="button"
          >
            😊 
          </button>
          <button
            className={`emoji-button ${selectedEmoji === 'sad' ? 'selected' : ''}`}
            onClick={() => handleEmojiChange('😢')}
            type="button"
          >
            😢
          </button>
          <button
            className={`emoji-button ${selectedEmoji === 'angry' ? 'selected' : ''}`}
            onClick={() => handleEmojiChange('😡')}
            type="button"
          >
            😡
          </button>
          <button
            className={`emoji-button ${selectedEmoji === 'fearful' ? 'selected' : ''}`}
            onClick={() => handleEmojiChange('😨')}
            type="button"
          >
            😨
          </button>
          <button
            className={`emoji-button ${selectedEmoji === 'surprised' ? 'selected' : ''}`}
            onClick={() => handleEmojiChange('😮')}
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
            onChange={handleMoodChange}
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
    </div>
  );
};

export default Moods;
