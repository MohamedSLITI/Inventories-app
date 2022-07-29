// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage, ref } from "firebase/storage";

import '@firebase/auth';
import '@firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqf9ffqHNH4TF-vLTBpUOocD99PT8tVVA",
  authDomain: "pda-project-bf4f9.firebaseapp.com",
  projectId: "pda-project-bf4f9",
  storageBucket: "pda-project-bf4f9.appspot.com",
  messagingSenderId: "286959758146",
  appId: "1:286959758146:web:26e48cf3ac5267bdf4b6db"
};

// Initialize Firebase
let app;
if (firebase.apps.length == 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
export { firestore,auth };
