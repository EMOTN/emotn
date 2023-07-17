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
    <div className="container-message">
      <h2 className="title">Message in a Bottle</h2>

      <div className="button-container">
        <button className="button" onClick={openSendPopup}>
          Send a Bottle
        </button>

        <button className="button" onClick={openReceivePopup}>
          Receive a Bottle
        </button>
      </div>

      {sendPopup && (
        <div className="popup">
          <div
            className="popup-content"
            style={{
              backgroundColor: "#dbf3e0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4 style={{ textAlign: "center" }}>
              You found an empty bottle! Looks pretty airtight. Maybe you could
              send somebody a message...
            </h4>
            <form onSubmit={handleNiceMessageSubmit}>
              <textarea
                className="send-message"
                name="message"
                placeholder="Write a nice message and brighten somebody's day ..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <div className="submitPopUpButton">
                <p>
                  <button type="submit">Put it in a bottle</button>
                </p>
                <button onClick={() => setSendPopup(false)}>Nevermind!</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {receivePopup && (
        <div className="popup">
          <div className="popup-content" style={{ backgroundColor: "#dbf3e0" }}>
            <h4 style={{ textAlign: "center" }}>
              Oh! You found a bottle! There seems to be a message inside!
            </h4>
            <h5 style={{ textAlign: "center" }}>*POP*</h5>
            <div className="message-box">
              <p style={{ textAlign: "center" }}>{niceMessage}</p>
            </div>
            <div className="favoriteButton">
              <p>
                <button
                  onClick={() => handleFavoriteMessage(niceMessage)}
                  disabled={isMessageFavorited(niceMessage)}
                >
                  {isMessageFavorited(niceMessage) ? "Favorited" : "Favorite"}
                </button>
              </p>
              <button onClick={() => setReceivePopup(false)}>Im Done!</button>
            </div>
          </div>
        </div>
      )}

      {favoritedMessages.length > 0 && (
        <div className="favorited-messages-container">
          <h3 className="titleFavorite">My Favorite Messages</h3>
          <div className="favorited-messages">
            {favoritedMessages.map((message) => (
              <div key={message} className="message-container">
                <p className="message">🏵️{message}</p>
                <button
                  onClick={() => handleUnfavoriteMessage(message)}
                  className="unfavorite-button"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnonymousMessages;
