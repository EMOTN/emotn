import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../config/firebase";
import "./AnonymousMessages.css";

const AnonymousMessages = ({ user }) => {
  const [niceMessage, setNiceMessage] = useState("");
  const [favoritedMessages, setFavoritedMessages] = useState([]);
  const [sendPopup, setSendPopup] = useState(false);
  const [receivePopup, setReceivePopup] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchFavoritedMessages = async () => {
      try {
        // Fetch the user's favoritedMessages array from their Firestore document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (userData && userData.favoritedMessages) {
          setFavoritedMessages(userData.favoritedMessages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchFavoritedMessages();
    }
  }, [user]);

  const getRandomMessage = (messages) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const openSendPopup = () => {
    setSendPopup(true);
  };

  const openReceivePopup = () => {
    setReceivePopup(true);
    handleNiceMessageRequest();
  };

  const handleNiceMessageRequest = async () => {
    try {
      // Fetch all nice messages from the anonymousMessages collection
      const anonymousMessagesQuery = query(collection(db, "anonymousMessages"));
      const anonymousMessagesSnapshot = await getDocs(anonymousMessagesQuery);
      const anonymousMessagesData = anonymousMessagesSnapshot.docs.map(
        (doc) => doc.data().message
      );

      // Select a random nice message from the fetched messages
      const randomMessage = getRandomMessage(anonymousMessagesData);
      setNiceMessage(randomMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNiceMessageSubmit = async (e) => {
    e.preventDefault();
    const message = messageInput;

    try {
      // Add the nice message to the anonymousMessages collection
      await addDoc(collection(db, "anonymousMessages"), {
        message,
      });

      // Clear the input field
      setMessageInput("");

      // Close the send popup
      setSendPopup(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteMessage = async (message) => {
    // Check if the user object and uid property are defined
    if (user && user.uid) {
      // Update the user's favoritedMessages array in their Firestore document
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          favoritedMessages: arrayUnion(message),
        });

        // Update the local state
        setFavoritedMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUnfavoriteMessage = async (message) => {
    // Remove the message from the user's favoritedMessages array in their Firestore document
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favoritedMessages: arrayRemove(message),
      });

      // Update the local state
      setFavoritedMessages((prevMessages) =>
        prevMessages.filter((prevMessage) => prevMessage !== message)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isMessageFavorited = (message) => {
    // Check if the message is favorited by the user
    return favoritedMessages.includes(message);
  };

  return (
    <div>
      <h2>Message in a Bottle</h2>

      <button onClick={openSendPopup}>Send a Bottle</button>

      {sendPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Write a nice message</h3>
            <form onSubmit={handleNiceMessageSubmit}>
              <textarea
                name="message"
                placeholder="Write a nice message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <p>
                <button type="submit">Put it in a bottle</button>
              </p>
            </form>
            <button onClick={() => setSendPopup(false)}>Nevermind!</button>
          </div>
        </div>
      )}

      <button onClick={openReceivePopup}>Receive a Bottle</button>

      {receivePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Oh! You found a bottle! There seems to be a message inside!</h3>
            <h2>*POP*</h2>
            <p>{niceMessage}</p>
            <button
              onClick={() => handleFavoriteMessage(niceMessage)}
              disabled={isMessageFavorited(niceMessage)}
            >
              {isMessageFavorited(niceMessage) ? "Favorited" : "Favorite"}
            </button>
            <button onClick={() => setReceivePopup(false)}>Im Done!</button>
          </div>
        </div>
      )}

      {favoritedMessages.length > 0 && (
        <div>
          <h3>Your Favorite Messages</h3>
          {favoritedMessages.map((message) => (
            <div key={message}>
              <p>{message}</p>
              <button onClick={() => handleUnfavoriteMessage(message)}>
                Unfavorite
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnonymousMessages;
