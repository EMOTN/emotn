

const EntryList = ({ entries, deleteEntry, updateEntryMood }) => {
  if (entries.length === 0) {
    return <p>No entries found.</p>;
  }

  return (
    <div>
      <h2>Existing Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <p>Mood: {entry.mood}</p>
            <p>Date: {entry.date}</p>
            <p>Body: {entry.body}</p>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            <button onClick={() => updateEntryMood(entry.id)}>Update Mood</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryList;
