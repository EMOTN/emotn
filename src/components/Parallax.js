// import React from 'react'
// import { Parallax, ParallaxLayer } from '@react-spring/parallax'
// import styles from './styles.module.css'

// const ParallaxDesign = () => {
//   const alignCenter = { display: 'flex', alignItems: 'center' }
//   return (
//     <div>
//       <div>
//         <div className={styles.background} />

//         <Parallax pages={5}>
//           <ParallaxLayer
//             offset={0}
//             speed={0.5}
//             style={{ ...alignCenter, justifyContent: "center" }}
//           >
//             <p className={styles.scrollText}>Scroll down</p>
//           </ParallaxLayer>

//           <ParallaxLayer
//             sticky={{ start: 1, end: 3 }}
//             style={{ ...alignCenter, justifyContent: "flex-start" }}
//           >
//             <div className={`${styles.cards} ${styles.sticky}`}>
//               <p>Don't forget to scroll up!</p>
//             </div>
//           </ParallaxLayer>

//           <ParallaxLayer
//             offset={1.5}
//             speed={1.5}
//             style={{ ...alignCenter, justifyContent: "flex-end" }}
//           >
//             <div
//               className={`${styles.cards} ${styles.parallax} ${styles.purple}`}
//             >
//               <p>Sign Up</p>
//             </div>
//           </ParallaxLayer>

//           <ParallaxLayer
//             offset={2.5}
//             speed={1.5}
//             style={{ ...alignCenter, justifyContent: "flex-end" }}
//           >
//             <div
//               className={`${styles.cards} ${styles.parallax} ${styles.blue}`}
//             >
//               <p>Or Don't, You'll miss out!</p>
//             </div>
//           </ParallaxLayer>
//         </Parallax>
//       </div>
//     </div>

//   )
// }

// export default ParallaxDesign;
