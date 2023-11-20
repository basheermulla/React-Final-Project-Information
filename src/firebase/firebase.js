import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhoEa1DSCinFtDlSNvJwaKneCzTnvYArI",
  authDomain: "final-react-project-8081b.firebaseapp.com",
  projectId: "final-react-project-8081b",
  storageBucket: "final-react-project-8081b.appspot.com",
  messagingSenderId: "740086605427",
  appId: "1:740086605427:web:c4c91462b74b16417a2c06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;