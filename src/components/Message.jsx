import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  // Access the current user information from AuthContext
  const { currentUser } = useContext(AuthContext);

  // Access chat data from ChatContext
  const { data } = useContext(ChatContext);

  // Create a reference to the message element for scrolling into view
  const ref = useRef();

  // Scroll the message element into view smoothly when the message updates
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      // Apply different styles for the message sender (current user) and others
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span> {/* Display the formatted message timestamp */}
      </div>
      <div className="messageContent">
        <p>{message.text}</p> {/* Display the message text */}
        {message.img && <img src={message.img} alt="" />} {/* Display an image if present */}
      </div>
    </div>
  );
};

export default Message;
