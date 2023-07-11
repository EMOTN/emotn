import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const DailyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        const lastLoginTimestamp = docSnap.data()?.lastLoginTimestamp;

        const currentTimestamp = new Date().getTime();

        if (!lastLoginTimestamp || lastLoginTimestamp !== currentTimestamp) {
          setIsOpen(true);
          await setDoc(
            userRef,
            {
              lastLoginTimestamp: currentTimestamp,
            },
            { merge: true }
          );
        } else {
          setIsOpen(false); // Frog should not appear if it's the same login session
        }

        localStorage.removeItem("hasPopupClosed"); // Clear the "hasPopupClosed" value from localStorage
      }
    };

    const unsubscribe = onAuthStateChanged(auth, checkFirstLogin);

    return () => {
      unsubscribe();
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("hasPopupClosed", "true"); // Store the popup state in localStorage
  };

  if (!isOpen && !localStorage.getItem("hasPopupClosed")) {
    return null;
  }
  return (
    <div
      style={{
        transform: isOpen ? "translate(0)" : "translate(100vw, 100vh)",
        transition: "transform 2.0s ease-in-out",
        width: "auto",
        height: "auto",
        position: "fixed",
        background: "rgba(255, 255, 255)",
        bottom: "20px",
        right: "20px",
        display: "flex",
        padding: "1rem",
        borderRadius: "5px",
        border: "2px solid #8b9474",
        animation: isOpen ? "fly-in 10s" : "none",
      }}
    >
      <div style={{ flex: "0 0 auto", marginLeft: "1rem" }}>
        <img src="frog.png" alt="Cartoon Frog" width="200" height="200" />
      </div>
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={{ marginTop: "0" }}>
          Hey, I'm Frogburt. Have a HOPPY time journaling!
        </p>
        <p style={{ textAlign: "right", margin: "0" }}>
          Don't forget to drink your water! *RIBBIT*
        </p>
        <button onClick={closePopup} className="btn btn-primary align-self-end">
          X
        </button>
      </div>
    </div>
  );
};

export default DailyPopup;
