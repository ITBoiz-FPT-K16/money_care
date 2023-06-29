// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDByD0g4U9MOnlLshsnSBZhQD691uuNyBw",
  authDomain: "money-care-firebase.firebaseapp.com",
  projectId: "money-care-firebase",
  storageBucket: "money-care-firebase.appspot.com",
  messagingSenderId: "621667272979",
  appId: "1:621667272979:web:32efbf51a8444ae692f2e6",
  measurementId: "G-25LC29D9JR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;