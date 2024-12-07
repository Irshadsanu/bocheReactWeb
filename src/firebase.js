import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";



const firebaseConfig = {


  //original databse 

  apiKey: "AIzaSyDYZmB6NvQPGEEeRm6sbLa-52BA2A0YlS0",
  authDomain: "boche-mart.firebaseapp.com",
  databaseURL: "https://boche-mart-default-rtdb.firebaseio.com",
  projectId: "boche-mart",
  storageBucket: "boche-mart.appspot.com",
  messagingSenderId: "766872681917",
  appId: "1:766872681917:web:96e085a7f3dc81a546e6d4",
  measurementId: "G-XN1V93YG29"


  //demo data base 

  // apiKey: "AIzaSyDqz8aTDMLgbISaHBU7l5NKZE9GouVVH2Y",
  // authDomain: "bochedemo-df168.firebaseapp.com",
  // databaseURL: "https://bochedemo-df168-default-rtdb.firebaseio.com",
  // projectId: "bochedemo-df168",
  // storageBucket: "bochedemo-df168.appspot.com",
  // messagingSenderId: "325933955933",
  // appId: "1:325933955933:web:a6be8de48afde9f95506b4",
  // measurementId: "G-ZS6R0K3WBW"



};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);
export { database, firestore, storage };
