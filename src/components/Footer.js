import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div>
        <p>Copyright © 2023 EMOTN ® </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    position: "fixed",
    height: "30px",
    bottom: 0,
    width: "100%",
    backgroundColor: "#6CAe75",
    textAlign: "center",
    display: "flex",
    flexDirection: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    zIndex: 1,
    paddingTop: "1em",
  },
};

export default Footer;
