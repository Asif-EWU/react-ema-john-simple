import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.config';
import { UserContext } from '../../App';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

const Login = () => {
  const userSignedOut = {
    isSignedIn: false,
    displayName: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  };
  const [user, setUser] = useState(userSignedOut);
  const [newUser, setNewUser] = useState(false);
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const {displayName, email, photoURL} = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        
        // ...
        console.log(errorMessage);
      });
  };

  const handleGoogleSignOut = () => {
    firebase.auth().signOut()
      .then(() => {
        setUser(userSignedOut);
        console.log();
      }).catch(error => {
        console.log(error);
      });
  };

  const handleEvent = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email') {
      const emailRegex = /\S+@\S+\.\S+/;
      isFieldValid = emailRegex.test(e.target.value);
    }

    if(e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    
    if(isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const {name, email, password} = user;
    if(newUser && name && email && password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(name);
        })
        .catch((error) => {
          const errorMessage = error.message;
          const newUserInfo = {...user};
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    if(!newUser && email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setLoggedInUser(newUserInfo);
        })
        .catch((error) => {
          const errorMessage = error.message;
          const newUserInfo = {...user};
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
  };

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('Updated User successfully');
    }).catch(function(error) {
      console.log(error);
    });
  }

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleGoogleSignOut}>Google Sign out</button> :
        <button onClick={handleGoogleSignIn}>Google Sign in</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our own Authentication</h1>
      
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id="newUser"/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" onBlur={handleEvent} type="text" placeholder="name" required />}
        <br/>
        <input name="email" onBlur={handleEvent} type="text" placeholder="email" required />
        <br/>
        <input name="password" onBlur={handleEvent} type="password" placeholder="password" required />
        <br/>
        <input name="submit" type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      {
        user.success 
          ? <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully !!</p> 
          : <p style={{color: 'red'}}>{user.error}</p>
      }
      
    </div>
  );
};

export default Login;