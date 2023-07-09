import React, { useState } from "react";
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

  return (
    <div
      className="editEntry"
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: "#c1cc99",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "15px",
      }}
    >
      <div className="prompt">{renderPrompt()}</div>
      <EditorToolbar />

      <div
        style={{
          width: "100%",
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
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
          }}
        />
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditEntry;
