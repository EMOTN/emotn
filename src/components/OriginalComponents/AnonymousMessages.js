// import { useState, useEffect } from 'react';
// import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, doc, getDoc, arrayRemove } from 'firebase/firestore';
// import { db } from '../config/firebase';

// const AnonymousMessages = ({ user }) => {
//   const [niceMessage, setNiceMessage] = useState('');
//   const [favoritedMessages, setFavoritedMessages] = useState([]);

//   useEffect(() => {
//     const fetchFavoritedMessages = async () => {
//       try {
//         // Fetch the user's favoritedMessages array from their Firestore document
//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);
//         const userData = userSnap.data();
//         if (userData && userData.favoritedMessages) {
//           setFavoritedMessages(userData.favoritedMessages);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (user) {
//       fetchFavoritedMessages();
//     }
//   }, [user]);

//   const handleNiceMessageRequest = async () => {
//     try {
//       // Fetch all nice messages from the anonymousMessages collection
//       const anonymousMessagesQuery = query(collection(db, 'anonymousMessages'));
//       const anonymousMessagesSnapshot = await getDocs(anonymousMessagesQuery);
//       const anonymousMessagesData = anonymousMessagesSnapshot.docs.map((doc) => doc.data().message);

//       // Select a random nice message from the fetched messages
//       const randomIndex = Math.floor(Math.random() * anonymousMessagesData.length);
//       setNiceMessage(anonymousMessagesData[randomIndex]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleNiceMessageSubmit = async (e) => {
//     e.preventDefault();
//     const message = e.target.message.value;

//     try {
//       // Add the nice message to the anonymousMessages collection
//       await addDoc(collection(db, 'anonymousMessages'), {
//         message,
//       });

//       // Clear the input field
//       e.target.message.value = '';
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleFavoriteMessage = async (message) => {
//     // Update the user's favoritedMessages array in their Firestore document
//     try {
//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, {
//         favoritedMessages: arrayUnion(message),
//       });

//       // Update the local state
//       setFavoritedMessages((prevMessages) => [...prevMessages, message]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleUnfavoriteMessage = async (message) => {
//     // Remove the message from the user's favoritedMessages array in their Firestore document
//     try {
//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, {
//         favoritedMessages: arrayRemove(message),
//       });

//       // Update the local state
//       setFavoritedMessages((prevMessages) => prevMessages.filter((prevMessage) => prevMessage !== message));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const isMessageFavorited = (message) => {
//     // Check if the message is favorited by the user
//     return favoritedMessages.includes(message);
//   };

//   return (
//     <div>
//       <h2>Anonymous Messages</h2>

//       <form onSubmit={handleNiceMessageSubmit}>
//         <textarea name="message" placeholder="Write a nice message..." />
//         <button type="submit">Submit</button>
//       </form>

//       <button onClick={handleNiceMessageRequest}>Receive a Message</button>

//       {niceMessage && (
//         <div>
//           <h3>Nice Message</h3>
//           <p>{niceMessage}</p>
//           <button
//             onClick={() => handleFavoriteMessage(niceMessage)}
//             disabled={isMessageFavorited(niceMessage)}
//           >
//             {isMessageFavorited(niceMessage) ? 'Favorited' : 'Favorite'}
//           </button>
//         </div>
//       )}

//       {favoritedMessages.length > 0 && (
//         <div>
//           <h3>Your Favorited Messages</h3>
//           {favoritedMessages.map((message) => (
//             <div key={message}>
//               <p>{message}</p>
//               <button onClick={() => handleUnfavoriteMessage(message)}>Unfavorite</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnonymousMessages;
