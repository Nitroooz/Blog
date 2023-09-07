import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBiDdxYENawyM_tSNACX6G3GjDnkNDf1eA",
  authDomain: "miniblog-82c16.firebaseapp.com",
  databaseURL: "https://miniblog-82c16-default-rtdb.firebaseio.com/",
  projectId: "miniblog-82c16",
  storageBucket: "miniblog-82c16.appspot.com",
  messagingSenderId: "350531564217",
  appId: "1:350531564217:web:4e51dafd97bbf5ad906168",
  measurementId: "G-XSN4R090Q3",
  databaseURL: 'https://miniblog-82c16-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

let userId;
let userName;
let photoURL;

export function myloginWithGoogle(setUser) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      userId = user.uid;
      userName = user.displayName;
      photoURL = user.photoURL;
      console.log(user.displayName);
      setUser({
        nome: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export function myLogout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.reload(true);
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

export function sendToRealtimeDatabase() { }

export function activateUpdate(setState) {
  const db = getDatabase(app);
  const starCountRef = ref(db, '/');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    
    const dataArray = Object.keys(data).map(key => data[key]);
    console.log(dataArray);
    setState(dataArray);

  });
}

export function writeUserData(texto) {
  const db = getDatabase(app);
  let aux = Date.now();
  set(ref(db, '/' + aux), {
    text: texto,
    user: userName,
    photo: photoURL,
    time: aux,
  });
}