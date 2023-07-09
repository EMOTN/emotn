import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

const EditEntry = ({ entry, updateEntry, closePopup }) => {
  const [updatedMood, setUpdatedMood] = useState(entry.mood);
  const [updatedPrompt, setUpdatedPrompt] = useState(entry.prompt);
  const [updatedBody, setUpdatedBody] = useState(entry.body);

  const handleUpdate = () => {
    const updatedEntry = {
      ...entry,
      mood: updatedMood,
      prompt: updatedPrompt,
      body: updatedBody,
    };
    updateEntry(updatedEntry);
    closePopup();
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to go back to the dashboard? Any unsaved changes will be lost."
    );
    if (confirmed) {
      closePopup();
    }
  };

  const handleBodyChange = (value) => {
    setUpdatedBody(value);
  };

  const renderPrompt = () => {
    if (updatedPrompt) {
      return <div className="prompt-container">{updatedPrompt}</div>;
    }
    return null;
  };

  const editEntryRef = useRef(null);

  return (
    <div
      className="editEntry"
      ref={editEntryRef}
      style={{
        width: "100%", // Set the width to 100% to fit the popup
        height: "100%",
        backgroundColor: "#c1cc99",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden", // Prevent overflow
      }}
    >
      <div className="prompt" style={{ maxWidth: "100%" }}>
        {renderPrompt()}
      </div>
      <EditorToolbar />

      <div
        style={{
          width: "100%", // Set the width to 100% to fit the popup
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ReactQuill
          value={updatedBody}
          onChange={handleBodyChange}
          modules={modules}
          formats={formats}
          style={{
            width: "100%", // Set the width to 100% to fit the container
            height: "100%",
            border: "none",
            outline: "none",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          marginBottom: "10px",
        }}
      >
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditEntry;
