import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import register from "../img/login.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  // Initialize state variables
  const [err, setErr] = useState(null); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Access the navigation function for routing

  // Function to handle the registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to indicate the registration process is in progress

    // Extract user input from the form fields
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create a user with the provided email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name using the user's display name and current timestamp
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      // Upload the selected image file to Firebase Storage
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the user's profile with their display name and profile photo URL
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      // Create a user document in Firestore with user information
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      // Create an empty user chats document in Firestore
      await setDoc(doc(db, "userChats", res.user.uid), {});

      navigate("/"); // Redirect to the home page after successful registration
    } catch (error) {
      console.error("Registration error:", error.message);
      setErr(error.message); // Set an error message if registration fails
    } finally {
      setLoading(false); // Reset loading state when registration is completed
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"><img src={register} alt="login" /></span> {/* Display a registration logo */}
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Type your Name" /> 
          <input required type="email" placeholder="Type your Email" />
          <input required type="password" placeholder="Type your Password" />
          <input required style={{ display: "none" }} type="file" id="file" /> {/* Hidden file input for profile picture */}
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an Avatar</span>
          </label>
          <button disabled={loading}>Sign up</button> {/* Button to submit the registration form */}
          {loading && "Uploading and compressing the image, please wait..."} {/* Loading message during image upload */}
          {err && <span className="error">{err}</span>} {/* Display an error message if registration fails */}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link> {/* Link to the login page */}
        </p>
      </div>
    </div>
  );
};

export default Register;
