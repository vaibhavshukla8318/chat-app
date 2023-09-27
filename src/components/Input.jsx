import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Picker, { Emoji, SkinTones } from "emoji-picker-react";

// Create an Input component
const Input = () => {
  // Initialize state variables for text and image
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  // State variables for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji] = useState("");

  // Access the current user information from AuthContext
  const { currentUser } = useContext(AuthContext);

  // Access chat data from ChatContext
  const { data } = useContext(ChatContext);

  // Function to handle sending a message
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          // Handle upload error
          console.error("Error uploading image:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText(""); // Clear the input text
    setImg(null); // Clear the selected image
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Function to handle emoji selection
  const handleEmojiClick = (emojiData, event) => {
    const { unified } = emojiData;
    const emoji = String.fromCodePoint(`0x${unified}`);

    setText(text + emoji); // Append the selected emoji to the input text
    setShowEmojiPicker(false); // Hide the emoji picker
  };

  return (
    <div className="input">
      <div id="input">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          value={text}
        />
      </div>
      <div>
        {/* Emoji picker */}
        {selectedEmoji ? (
          <Emoji
            emoji={selectedEmoji}
            size={22}
            native={true}
            onClick={handleEmojiClick}
          />
        ) : null}

        {showEmojiPicker && (
          <Picker
            onEmojiClick={handleEmojiClick}
            disableAutoFocus={true}
            groupNames={{ smileys_people: "PEOPLE" }}
            native={true}
            SkinTone={SkinTones.NONE}
          />
        )}

        <div className="send">
          <img src={Attach} alt="" />
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label>

          {/* Emoji picker toggle button */}
          <button
            className="emojiButton"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <i
              className={
                showEmojiPicker
                  ? "fa-solid fa-face-smile"
                  : "fa-regular fa-face-smile"
              }
            ></i>
          </button>

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Input;
