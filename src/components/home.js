import "reactjs-popup/dist/index.css";
import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { isVisible } from "@testing-library/user-event/dist/utils";
import {
  useTrail,
  useChain,
  useSprings,
  useSpringRef,
  to,
} from "@react-spring/web";
import styles from "./styles.module.css";
import Lottie from "lottie-react";
import ScrollDown from "../animations/scrollAnimation.json";
import { Link } from "react-router-dom";
//Testing background sound animations
import BackgroundSound from "../animations/DelightfulAnimation.wav";
// import clickSound from "../animations/OrganicClick.wav";
import glitchySound from "../animations/GlitchyButton.wav";
//Parallax imports
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

const Home = () => {
  //Parallax

  const alignCenter = { display: "flex", alignItems: "center" };
  //Click
  // const [state, toggle] = useState(true)
  //   const { props = {} } = useSpring({
  //     from: { x: 0 },
  //     x: state ? 1 : 0,
  //     config: { duration: 1000 },
  //   })

  //Background sound
  // useEffect(() => {
  //   const audio = new Audio(BackgroundSound);
  //   audio.play();

  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   };
  // }, []);
  //playclick sound effect
  // const playClickSound = () => {
  //   const audioClick = new Audio(clickSound);
  //   audioClick.play();
  // };
  // useEffect(() => {
  //   return () => {
  //     const audioClick = new Audio(clickSound);
  //     audioClick.pause();
  //     audioClick.currentTime = 0;
  //   };
  // }, []);

  //Parallax sound effect
  const playGlitchySound = () => {
    const audioEffect = new Audio(glitchySound);
    audioEffect.play();
  };
  useEffect(() => {
    return () => {
      const audioEffect = new Audio(glitchySound);
      audioEffect.pause();
      audioEffect.currentTime = 0;
    };
  }, []);

  // 1-Animation to LOGO
  const animation = useSpring({
    from: {
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 24,
      transform: "translateY(-20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
    config: {
      duration: 1200,
    },
  });
  // 2-EMOJI GRID
  const COORDS = [
    [50, 30],
    [90, 30],
    [50, 50],
    [60, 60],
    [70, 60],
    [80, 60],
    [90, 50],
  ];

  const STROKE_WIDTH = 0.5;

  const OFFSET = STROKE_WIDTH / 2;

  const MAX_WIDTH = 150 + OFFSET * 2;
  const MAX_HEIGHT = 100 + OFFSET * 2;

  const gridApi = useSpringRef();

  const gridSprings = useTrail(16, {
    ref: gridApi,
    from: {
      x2: 0,
      y2: 0,
    },
    to: {
      x2: MAX_WIDTH,
      y2: MAX_HEIGHT,
    },
  });

  const boxApi = useSpringRef();

  const [boxSprings] = useSprings(7, (i) => ({
    ref: boxApi,
    from: {
      scale: 0,
    },
    to: {
      scale: 1,
    },
    delay: i * 200,
    config: {
      mass: 2,
      tension: 220,
    },
  }));

  useChain([gridApi, boxApi], [0, 1], 3500);
  return (
    <div>
      <div>
        <div className={styles.background} />

        <Parallax pages={5} style={{ zIndex: -1 }}>
          <ParallaxLayer
            offset={0}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
          >
            <p className={styles.scrollText}>Scroll Down</p>
          </ParallaxLayer>
          {/* THIS IS A STICKY CARD */}
          {/* <ParallaxLayer
            //  sticky={{ start: 1, end: 3 }}
            offset={0}
            speed={0.5}
            style={{ ...alignCenter, justifyContent: "center" }}
          >
            <div className={`${styles.cards} ${styles.sticky}`}>
              helllo
            </div>
          </ParallaxLayer> */}
          {/* EMOTN LOGO */}
          <ParallaxLayer
            offset={0.15}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "5em",
            }}
          >
            <div
              className={`${styles.cards} ${styles.parallax} ${styles.purple}`}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <animated.div style={animation}>
                  <img
                    src="emotn.png"
                    alt="Emotn"
                    style={{
                      ...alignCenter,
                      justifyContent: "center",
                      marginLeft: "4em",
                    }}
                  />
                </animated.div>
              </div>
            </div>
          </ParallaxLayer>

          {/* 1st Paragraph */}
          <ParallaxLayer
            offset={0.3}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
          >
            <p className={styles.scrollText}>
              The journaling you always wanted to get to, simplified.
            </p>
          </ParallaxLayer>

          {/* EMOJI GRID */}
          <ParallaxLayer
            offset={0.85}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "6em",
              zIndex: -1,
            }}
          >
            <div
              className={`${styles.cards} ${styles.parallax} ${styles.blue}`}
            >
              <div className={styles["background-container"]}>
                <div className={styles.container}>
                  <svg viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}>
                    <g>
                      {gridSprings.map(({ x2 }, index) => (
                        <animated.line
                          x1={0}
                          y1={index * 10 + OFFSET}
                          x2={x2}
                          y2={index * 10 + OFFSET}
                          key={index}
                          strokeWidth={STROKE_WIDTH}
                          stroke="currentColor"
                        />
                      ))}
                      {gridSprings.map(({ y2 }, index) => (
                        <animated.line
                          x1={index * 10 + OFFSET}
                          y1={0}
                          x2={index * 10 + OFFSET}
                          y2={y2}
                          key={index}
                          strokeWidth={STROKE_WIDTH}
                          stroke="currentColor"
                        />
                      ))}
                    </g>
                    {boxSprings.map(({ scale }, index) => (
                      <animated.rect
                        key={index}
                        width={10}
                        height={10}
                        fill="currentColor"
                        style={{
                          transformOrigin: `${5 + OFFSET * 2}px ${
                            5 + OFFSET * 2
                          }px`,
                          transform: `translate(${
                            COORDS[index][0] + OFFSET
                          }px, ${COORDS[index][1] + OFFSET}px)`,
                          scale,
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </ParallaxLayer>
          {/* 2nd Paragraph */}
          <ParallaxLayer
            offset={1}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
          >
            <p className={styles.scrollText}>
              We get it, there is a lot on your mind!<br></br>With many
              distractions life brings, it can be hard to<br></br>
              step away from all the noise, center yourself, and just think…
              <br></br>
              <br></br>That’s where EMOTN comes in: a personalized private
              online journaling app<br></br>
              that makes space for you to write it all out.
            </p>
          </ParallaxLayer>
          {/* Scroll Down 1 */}
          <ParallaxLayer
            offset={1.35}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "2.5em",
            }}
          >
            {/* <p className={styles.scrollText}></p> */}
            <div style={{ width: "13%", marginRight: "50px" }}>
              <Lottie loop={true} animationData={ScrollDown} />
            </div>
          </ParallaxLayer>
          {/* 3rd Paragraph */}
          <ParallaxLayer
            offset={1.95}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
          >
            <p className={styles.scrollText}>
              Take a breath,<br></br>take that space,<br></br>and take care of
              your mind, with EMOTN.<br></br>
              <br></br>Keep track of your moods with a calming interface
              designed for peace and tranquility.<br></br>No more scribbling
              your thoughts into the notes app to be lost in the sea of
              your grocery lists and passwords.<br></br>
              <br></br>No dealing with complex apps with extra distracting
              features<br></br>You deserve a private place to reflect on your
              life.<br></br>EMOTN prioritizes you and your feelings.<br></br>
              Examine and record your range of EMOTN.<br></br>Find your peace.
              Center your growth.<br></br>
              <br></br>Future you will thank you.
            </p>
          </ParallaxLayer>
          {/* Scroll Down 2 */}
          <ParallaxLayer
            offset={2}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "2.5em",
            }}
          >
            {/* <p className={styles.scrollText}></p> */}
            <div style={{ width: "13%", marginRight: "50px" }}>
              <Lottie loop={true} animationData={ScrollDown} />
            </div>
          </ParallaxLayer>
          {/* 4th Paragraph */}
          <ParallaxLayer
            offset={2.63}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
          >
            <p className={styles.scrollText}>
              How EMOTN Works For You<br></br>
              <br></br>Customize moods for your daily entries and get to
              writing. It’s that simple.<br></br>
              <br></br>Your entries are archived and organized for later
              reflection in your personal EMOTN Calender.<br></br> Track past
              entries and moods by date.<br></br>Easily look back on the past to
              remind yourself how far you’ve come– all with just the click of a
              button.<br></br>
              <br></br>EMOTN has different prompts designed to spark reflection
              and self-growth.<br></br> Start with a blank slate or get
              motivated to writewith our daily introspective prompt.<br></br>
              <br></br>Send out and receive messages of encouragement
              anonymously to support others and keep each other motivated on
              EMOTN.<br></br>
              <br></br>Soundtrack your journaling session with our integrated
              audio library designed to help in focus, relax,<br></br> or get
              into the zone you need to aid your process within EMOTN’s intimate
              journaling environment.
            </p>
          </ParallaxLayer>
          {/* onClick */}
          <ParallaxLayer
            offset={3}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "center",
              marginLeft: "1em",
            }}
            o
          >
            {/* <p className={styles.scrollText}>helllo</p> */}
            <div
              className={styles.clickContainer}
              onClick={playGlitchySound}
              // onClick={() => toggle(!state)}
            >
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "#8BBD8B" }}
              >
                <animated.div
                  className={styles.text}
                  // style={{
                  //   opacity: props?.x?.to({ range: [0, 1], output: [0.3, 1] }),
                  //   scale: props?.x?.to({
                  //     range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                  //     output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
                  //   }),
                  // }}
                >
                  Sign Up
                </animated.div>
              </Link>
            </div>
          </ParallaxLayer>

          {/* Scroll Down */}
          {/* <ParallaxLayer
            offset={3.8}
            speed={0.5}
            style={{ ...alignCenter, justifyContent: "center", marginLeft: '1em', }}>
            {/* <p className={styles.scrollText}></p> */}
          {/* <div style={{ width: "13%", marginRight: "50px" }}>
          <Lottie loop={true} animationData={ScrollDown} />
        </div>
          </ParallaxLayer> */}
          {/* Blank Paragraph */}
          {/* <ParallaxLayer
            offset={1.8}
            speed={0.5}
            style={{ ...alignCenter, justifyContent: "center", marginLeft: '1em', }}>
            <p className={styles.scrollText}></p>
          </ParallaxLayer> */}
          {/* Blank Paragraph */}
          {/* <ParallaxLayer
            offset={.45}
            speed={.3}
            style={{ ...alignCenter, justifyContent: "center" }}>
            <div className={`${styles.cards} ${styles.parallax} ${styles.blue}`}>
              <p></p>
            </div>
          </ParallaxLayer> */}
        </Parallax>
      </div>

      {/* EMOTN LOGO */}
      {/* <div>
        <animated.div style={animation}>
          <img
            src="emotn.png"
            alt="Emotn"
            style={{ display: "block", margin: "1.5em auto" }}
          />
        </animated.div>
      </div> */}
      {/* EMOJI GRID */}
      {/* <div className={styles["background-container"]}>
        <div className={styles.container}>
          <svg viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}>
            <g>
              {gridSprings.map(({ x2 }, index) => (
                <animated.line
                  x1={0}
                  y1={index * 10 + OFFSET}
                  x2={x2}
                  y2={index * 10 + OFFSET}
                  key={index}
                  strokeWidth={STROKE_WIDTH}
                  stroke="currentColor"
                />
              ))}
              {gridSprings.map(({ y2 }, index) => (
                <animated.line
                  x1={index * 10 + OFFSET}
                  y1={0}
                  x2={index * 10 + OFFSET}
                  y2={y2}
                  key={index}
                  strokeWidth={STROKE_WIDTH}
                  stroke="currentColor"
                />
              ))}
            </g>
            {boxSprings.map(({ scale }, index) => (
              <animated.rect
                key={index}
                width={10}
                height={10}
                fill="currentColor"
                style={{
                  transformOrigin: `${5 + OFFSET * 2}px ${5 + OFFSET * 2}px`,
                  transform: `translate(${COORDS[index][0] + OFFSET}px, ${
                    COORDS[index][1] + OFFSET
                  }px)`,
                  scale,
                }}
              />
            ))}
          </svg>
        </div>
      </div> */}

      {/* Sign up/Sign In */}
      {/* <div className={styles.clickContainer} onClick={playClickSound}>
        <Link to="/signup" style={{ textDecoration: "none", color: "#8BBD8B" }}>
          <animated.div className={styles.text}>click</animated.div>
        </Link>
      </div> */}
    </div>
  );
};

export default Home;
