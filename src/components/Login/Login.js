import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';

const Login = () => {
  const signedOutUser = {
    isSignedIn: false,
    displayName: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  };

  initializeLoginFramework();
  const [user, setUser] = useState(signedOutUser);
  const [newUser, setNewUser] = useState(false);
  const [, setLoggedInUser] = useContext(UserContext);
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  const handleResponse = (res) => {
    setUser(res);
    if(res.success) {
      setLoggedInUser(res);
      history.replace(from);
    }
  }

  const googleSignIn = () => {
    handleGoogleSignIn()
      .then(res => {
        handleResponse(res);
      });
  }

  const fbSignIn = () => {
    handleFbSignIn()
      .then(res => {
        handleResponse(res);
      })
  }

  const signOut = () => {
    handleSignOut()
      .then(res => {
        handleResponse(res);
      });
  }

  const handleEvent = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      const emailRegex = /\S+@\S+\.\S+/;
      isFieldValid = emailRegex.test(e.target.value);
    }

    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = user;
    if (newUser && name && email && password) {
      createUserWithEmailAndPassword(name, email, password)
        .then(res => {
          handleResponse(res);
        })
    }

    if (!newUser && email && password) {
      signInWithEmailAndPassword(email, password)
      .then(res => {
        handleResponse(res);
      })
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {
        user.isSignedIn ? <button onClick={signOut}>Google Sign out</button> :
          <button onClick={googleSignIn}>Google Sign in</button>
      }
      <br />
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our own Authentication</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="newUser" />
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" onBlur={handleEvent} type="text" placeholder="name" required />}
        <br />
        <input name="email" onBlur={handleEvent} type="text" placeholder="email" required />
        <br />
        <input name="password" onBlur={handleEvent} type="password" placeholder="password" required />
        <br />
        <input name="submit" type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      {
        user.success
          ? <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully !!</p>
          : <p style={{ color: 'red' }}>{user.error}</p>
      }

    </div>
  );
};

export default Login;