
import React, { useState } from "react";
import login from "../img/login.png";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const Login = () => {
  // Initialize state variable for error handling
  const [err, setErr] = useState(false);

  // Access the navigation function for routing
  const navigate = useNavigate();

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Attempt to sign in with the provided email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to the home page after successful login
    } catch (err) {
      setErr(true); // Set an error flag if login fails
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"><img src={login} alt="login" /></span> {/* Display a login logo */}
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Type your email" />
          <input type="password" placeholder="Type your password" />
          <button>Sign in</button> {/* Button to submit the login form */}
          {err && <span>Something went wrong</span>} {/* Display an error message if login fails */}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link> {/* Link to the registration page */}
        </p>
      </div>
    </div>
  );
};

export default Login;
