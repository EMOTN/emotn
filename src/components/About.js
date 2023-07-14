import React from "react";
import { SocialIcon } from 'react-social-icons';
import Nataliia from "./ourPhotos/Nataliia.jpg";
import Fanny from "./ourPhotos/Fanny.jpg";
import Kristin from "./ourPhotos/Kristin.jpg";
import Janice from "./ourPhotos/Janice.png";
import Sandra from "./ourPhotos/Sandra.jpg";
import "./About.css"


function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1 style={{ textAlign: "center", margin: "20px",  }}>Meet Our Team!</h1>
        <div className="teamCard">
            <h2>Nataliia Kazik</h2>
            <h5>Full Stack Developer</h5>
            <img src={Nataliia} alt="Nataliia Kazik" style={{ maxWidth: '100%', height: 'auto', width: '30vw',  }}/>
              <p>Nataliia Kazik is a software developer with a knack for mindful living. Born in Ukraine, she's an avid traveler and a cat lover. She's passionate about modern technologies, enjoys using them to craft delightful user experiences and is currently looking to give her career as a software engineer a strong start.</p>
            <SocialIcon url="https://www.linkedin.com/in/nataliia-kazik/" />
            <SocialIcon url="https://github.com/NataliiaKazik" />
        </div>
        <div className="teamCard">
          <h2>Fanny Lin</h2>
          <h5>Full Stack Developer</h5>
          <img src={Fanny} alt="Fanny Lin" style={{ maxWidth: '100%', height: '30vw', width: 'auto' }}/>
            <p>Fanny Lin is a Software Engineer and Physical Therapist from New York. She is a former NFL football player and enjoys spending time in the park on sunny days, as well as treating herself to a nice cup of coffee once in a while.</p>
          <SocialIcon url="https://www.linkedin.com/in/fanny-lin-dpt/" />
          <SocialIcon url="https://github.com/Flin7021" />
        </div>
        <br />
        <div className="teamCard">
          <h2>Kristin Becker</h2>
          <h5>Full Stack Developer</h5>
          <img src={Kristin} alt="Kristin Becker" style={{ maxWidth: '100%', height: '30vw', width: 'auto' }}/>
            <p>Kristin Becker is a fullstack developer with an interest in design. Having a background in marketing and customer service, she enjoys creating ease for the customer and find ways to combine analytics and creativity. She is also a big fan of the outdoors being an avid hiker and swimmer. She looks forward to beginning her software engineering career in the greater Boston area.</p>
          <SocialIcon url="https://www.linkedin.com/in/kristin-e-becker/" />
          <SocialIcon url="https://github.com/K-E-Becker" />
        </div>
        <br />
        <div className="teamCard">
          <h2>Janice Fisher</h2>
          <h5>Full Stack Developer</h5>
          <img src={Janice} alt="Janice Fisher" style={{ maxWidth: '100%', height: 'auto', width: '30vw' }}/>
            <p>Janice Fisher is a software developer with a song in her heart. She currently resides in Chicago, Ilinios and specializes in utilizing a full tech stack for sound design and audio engineering. No stranger to the creative arts, she thrives in collaborative environments as an enthusiastic and adaptable member of any team. You may find her on a lazy Sunday afternoon combing through her collection of vinyl records and CDs and jamming out to her favorite albums.</p>
          <SocialIcon url="https://www.linkedin.com/in/janicefisher/" />
          <SocialIcon url="https://github.com/janicefisher404" />
        </div>
        <div className="teamCard">
          <h2>Sandra Telenchana</h2>
          <h5>Full Stack Developer</h5>
          <img src={Sandra} alt="Sandra Telenchana" style={{ maxWidth: '100%', height: '30vw', width: 'auto' }}/>
            <p>Sandra Telenchana is a highly motivated and dedicated full-stack developer. With a deep passion for animals, she devotes her free time to rescuing and caring for stray cats, exemplifying her unwavering love for creatures in need. As she embarks on her career as a software developer, Sandra is filled with anticipation, eagerly anticipating the new challenges that lie ahead and the valuable connections she will forge along the way.</p>
          <SocialIcon url="https://www.linkedin.com/in/sandra-telenchana/" />
          <SocialIcon url="https://github.com/stelenchana01" />
        </div>
    </div>
  );
}

export default About;
