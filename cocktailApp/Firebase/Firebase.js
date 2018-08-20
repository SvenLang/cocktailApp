import firebase from "firebase";
import "firebase/firestore";

// TODO: Replace with your project's customized code snippet

const config = {
  apiKey: "AIzaSyAgdw0nP4tgjMeL8gjDdeoTv7vH-hzUGlo",
  authDomain: "cocktailapp-33910.firebaseapp.com",
  databaseURL: "https://cocktailapp-33910.firebaseio.com",
  projectId: "cocktailapp-33910",
  storageBucket: "cocktailapp-33910.appspot.com",
  messagingSenderId: "632343923712"
};

const APP = firebase.initializeApp(config);

export default class Firebase {
  // static auth; /* TODO: authentication */
  db;

  constructor() {
    this.db = APP.firestore();
    const settings = { timestampsInSnapshots: true };
    this.db.settings(settings);
  }
}
