import React, { useState, useEffect } from "react";

const DailyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true); // Set isOpen to true when the component is mounted

    return () => {
      setIsOpen(false); // Set isOpen to false when the component is unmounted
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

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
