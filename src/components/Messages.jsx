import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  // Initialize state variable to store messages
  const [messages, setMessages] = useState([]);
  
  // Access chat data from ChatContext
  const { data } = useContext(ChatContext);

  useEffect(() => {
    // Subscribe to changes in the chat document in Firestore
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      // Check if the document exists before updating messages
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unSub();
    };
  }, [data.chatId]);

  console.log(messages); // Log messages to the console for debugging

  return (
    <div className="messages">
      {/* Map over the messages and render each message using the Message component */}
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
