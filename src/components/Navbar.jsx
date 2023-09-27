import React, { useContext } from 'react'
import logout from "../img/logout.png";
import { signOut } from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  // Access the current user information from AuthContext
  const { currentUser } = useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="logo">Chats</span> {/* Display the logo or application name */}
      <div className="user">
        <img src={currentUser.photoURL} alt="" /> {/* Display the user's profile picture */}
        <span>{currentUser.displayName}</span> {/* Display the user's display name */}
        <button onClick={() => signOut(auth)}><img src={logout} alt="" /></button> {/* Button to sign out the user */}
      </div>
    </div>
  )
}

export default Navbar
