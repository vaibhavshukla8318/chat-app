import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  // Initialize state variables
  const [username, setUsername] = useState(""); // Input field for entering a username
  const [user, setUser] = useState(null); // Selected user to add as a contact
  const [err, setErr] = useState(false); // Error flag for user not found

  // Access the current user information from AuthContext
  const { currentUser } = useContext(AuthContext);

  // Function to handle user search by username
  const handleSearch = async () => {
    // Create a query to search for users with the specified display name
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      // Fetch the user data matching the query
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data()); // Set the found user as the selected user
      });
    } catch (err) {
      setErr(true); // Set an error flag if the user is not found
    }
  };

  // Function to handle Enter key press for searching
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  // Function to handle user selection and adding them as a contact
  const handleSelect = async () => {
    // Determine a unique identifier for the chat (group) between currentUser and the selected user
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      // Check if the chat (group) already exists
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // If the chat doesn't exist, create it in the "chats" collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Update the user's chat list (userChats) with the new chat information
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    // Clear the selected user and the input field
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>} {/* Display an error message if the user is not found */}
      {user && (
        <div className="userContainer">
          <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{user.displayName}</span> {/* Display the selected user's display name */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
