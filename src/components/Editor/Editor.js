import {$getRoot, $getSelection} from 'lexical';
import {useEffect, useState, useRef} from 'react';
import './editor.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';

import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';



function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {
      // Focus the editor when the effect fires!
      editor.focus();
    }, [editor]);
  
    return null;
  }



export const Editor = ({user, prompt}) => {
  const onError = (error) => {
      console.error(error);
  }
  const navigate = useNavigate();
  const [isButtonOn, setIsButtonOn] = useState(false)

  const myTheme = {
    ltr: "ltr",
    rtl: "rtl",
    placeholder: "editor-placeholder",
    paragraph: "editor-paragraph"
  };
    
  const initialConfig = {
    namespace: 'MyEditor',
    theme: myTheme,
    onError,
  };

  const editorStateRef = useRef();

  const onChange = (editorState) => {
    editorStateRef.current = editorState
    editorState.read(() => {
      const text = $getRoot().getTextContent()
      if (text.length > 0) {
        setIsButtonOn(true)
      } else {
        setIsButtonOn(false)
      }
    })
  }

  const handleSave = () => {
    if (!editorStateRef.current) { return }

    editorStateRef.current.read(() => {
      const text = $getRoot().getTextContent()
      persistToFirebase(text)
    })
  }

  const persistToFirebase = async (text) => {
    try {
      const entryRef = await addDoc(collection(db, 'entries'), {
        body: text,
        prompt: prompt,
        created_at: serverTimestamp(),
        userId: user.uid
      });
      navigate("/")
    } catch(error) {
      console.log("unable to save entry: ", error)
    }
  }
  const renderPrompt = () => {
    if (prompt) {
      return <div className="prompt-container">{prompt}</div>
    }
  }
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {renderPrompt()}
      <div className="editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          // placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MyCustomAutoFocusPlugin />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>
      <button onClick={handleSave} disabled={isButtonOn === false}>Save Entry</button>
    </LexicalComposer>
  );
}

export default Editor