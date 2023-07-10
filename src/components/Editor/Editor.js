import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  Timestamp,
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import "reactjs-popup/dist/index.css";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

const Editor = ({ user, mood, prompt }) => {
  const [entryText, setEntryText] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const entryData = {
        mood: mood,
        body: entryText,
        prompt: prompt,
        date: Timestamp.now(),
      };

      // create a new entry in the `entries` collection
      const entryRef = await addDoc(collection(db, "entries"), {
        ...entryData,
        userId: user.uid,
      });

      const userRef = doc(db, "users", user.uid);
      // add a similar entry nested in the `user`
      await updateDoc(userRef, {
        entries: arrayUnion({
          ...entryData,
          id: entryRef.id,
        }),
      });

      setEntryText("");
      navigate("/dashboard");
    } catch (error) {
      console.log("unable to save entry: ", error);
    }
  };

  const handleBackToDashboard = () => {
    if (
      window.confirm(
        "Are you sure you want to go back to the dashboard? Any unsaved changes will be lost."
      )
    ) {
      navigate("/dashboard");
    }
  };

  const renderPrompt = () => {
    if (prompt) {
      return <div className="prompt-container">{prompt}</div>;
    }
  };

  const handleBodyChange = (value, delta, source, editor) => {
    const isEditorEmpty = editor.getText().length <= 1; // by default ReactQuill always appends an entry newline which makes the text length == 1
    setIsEmpty(isEditorEmpty);

    const sanatizedText = value.replace(/^<p>/, "").replace(/<\/p>$/, "");
    setEntryText(sanatizedText);
  };

  return (
    <div>
      <div className="prompt">{renderPrompt()}</div>
      <EditorToolbar />
      <ReactQuill
        onChange={handleBodyChange}
        placeholder="Begin your writing journey here"
        modules={modules}
        formats={formats}
      />
      <div className="buttonTime">
        <button type="submit" disabled={isEmpty} onClick={handleSave}>
          Add Entry
        </button>
        <button type="button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Editor;
