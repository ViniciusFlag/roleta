// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Fz6NMfBKXd-K5Rq8aaDXWZvsJ05r5Cs",
  authDomain: "roleta-97469.firebaseapp.com",
  databaseURL: "https://roleta-97469-default-rtdb.firebaseio.com",
  projectId: "roleta-97469",
  storageBucket: "roleta-97469.firebasestorage.app",
  messagingSenderId: "428138122538",
  appId: "1:428138122538:web:163cb6620328936fa0e253",
  measurementId: "G-9KQ1ZBWYVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);