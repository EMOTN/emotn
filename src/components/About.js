import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";


function About() {
  return (
    <div>
      <h1>Meet Team EMOTN</h1>
          <h2>Nataliia Kazik</h2>
          <h5>Full Stack Developer</h5>
          <img src='src/components/Our Photos/A0DB4601-68A6-4160-9B31-F2B5323CA05E_1_105_c.jpg' alt="Nataliia Kazik"/>
      <p>
      Nataliia Kazik is a software developer with a knack for mindful living. Born in Ukraine, she’s an avid traveler and a cat lover. She’s passionate about modern technologies, enjoys using them to craft delightful user experiences and is currently looking to give her career as a software engineer a strong start.
      </p>
      <FontAwesomeIcon icon="fa-brands fa-linkedin" style={{color: "#0072b1",}} />
    </div>
  );
}

export default About;
