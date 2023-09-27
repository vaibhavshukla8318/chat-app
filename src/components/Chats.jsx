// Import necessary dependencies and components
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

// Create a Chats component
const Chats = () => {
  // Initialize state variables
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Access the current user information from AuthContext
  const { currentUser } = useContext(AuthContext);

  // Access the dispatch function from ChatContext
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    // Function to fetch user chats and subscribe to updates
    const getChats = () => {
      // Create a subscription to listen for changes to user chats in Firestore
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          // If the document exists, set the chats data
          setChats(doc.data());
        } else {
          // If the document doesn't exist, set chats as an empty array
          setChats([]);
        }
        setLoading(false); // Set loading to false when data is loaded or not found
      });

      // Unsubscribe from the snapshot listener when the component unmounts
      return () => {
        unsub();
      };
    };

    // Call getChats function when the currentUser.uid changes
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // Function to handle user selection in the chat list
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  // Render a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chats">
      {/* Map over the chats and render user chat components */}
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          {chat[1].userInfo && chat[1].userInfo.displayName ? (
            <>
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default Chats;
