import React, { useContext } from "react";
import Cam from "../img/cam.jpg";
import Voice from "../img/voice.png";
import Setting from "../img/setting.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  // Access the data from the ChatContext using useContext hook
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        {/* Display the user's display name */}
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          {/* Display icons for camera, voice, and settings */}
          <img src={Cam} alt="" />
          <img src={Voice} alt="" />
          <img src={Setting} alt="" />
        </div>
      </div>
      {/* Render the Messages component */}
      <Messages />
      {/* Render the Input component for user input */}
      <Input />
    </div>
  );
};

export default Chat;
