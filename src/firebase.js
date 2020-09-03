import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBueBz8vW1jcAnsdoHASXwM_NmpUH5IJfY",
  authDomain: "fashiony-c6f16.firebaseapp.com",
  databaseURL: "https://fashiony-c6f16.firebaseio.com",
  projectId: "fashiony-c6f16",
  storageBucket: "fashiony-c6f16.appspot.com",
  messagingSenderId: "341467113469",
  appId: "1:341467113469:web:6df8c5c6cca9b318d91b94",
  measurementId: "G-EWXEVE83KY"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};