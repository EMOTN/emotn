// import React, {useRef, useEffect} from 'react';
// import { styled } from '@stitches/react'
// import {  animated, useTrail } from '@react-spring/web'



// //Worddle
// const AppContainer = styled('div', {
//   width: '100vw',
//   height: '100vh',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   position: 'fixed', // Add position property
//   zIndex: 9999, // Add z-index property
// })

// const Container = styled('div', {
//   display: 'flex',
//   gap: 10,
//   marginBottom: 80,
//   // zIndex: 1,
// })

// const Box = styled('div', {
//   position: 'relative',
//   height: 50,
//   width: 50,
//   // zIndex: 1,
// })

// const SharedStyles = {
//   width: '100%',
//   height: '100%',
//   position: 'absolute',
//   inset: 0,
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   fontFamily: 'Helvetica',
//   fontWeight: 800,
//   backfaceVisibility: 'hidden',
// }

// const FrontBox = styled(animated.div, {
//   ...SharedStyles,
//   backgroundColor: '#fafafa',
//   border: 'solid 2px #1a1a1a',
//   // zIndex: 1,
// })

// const BackBox = styled(animated.div, {
//   ...SharedStyles,
//   backgroundColor: '#6cab64',
//   border: 'solid 2px #6cab64',
//   color: '#fafafa',
//   // zIndex: 1,

// })

// const items = ['E', 'M', 'O', 'T', 'N', '🔥' ]


// const Design = () => {

// //Worddle
// const [trail, api] = useTrail(items.length, () => ({
//   rotateX: 0,
// }))

// const isFlipped = useRef(false)

// const handleClick = () => {
//   if (isFlipped.current) {
//     api.start({
//       rotateX: 0,
//     })
//     isFlipped.current = false
//   } else {
//     api.start({
//       rotateX: 180,
//     })
//     isFlipped.current = true
//   }
// }
//   return (

//    <div>
//         <AppContainer>
//       <Container onClick={handleClick} >
//         {trail.map(({ rotateX }, i) => (
//           <Box key={i} >
//             <FrontBox
//               key={items[i]}
//               style={{
//                 transform: rotateX.to(val => `perspective(600px) rotateX(${val}deg)`),
//                 transformStyle: 'preserve-3d',
//               }}  >
//               {'?'}
//             </FrontBox>
//             <BackBox
//               style={{
//                 transform: rotateX.to(val => `perspective(600px) rotateX(${180 - val}deg)`),
//                 transformStyle: 'preserve-3d',
//               }}>
//               {items[i]}
//             </BackBox>
//           </Box>
//         ))}
//       </Container>
//     </AppContainer>
//         </div>
//   )
// }

// export default Design;
