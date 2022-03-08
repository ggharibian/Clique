import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDjrDmZt1EOMiZB14bjCwhKqjaQOJV-nl0",
  authDomain: "clique-928d2.firebaseapp.com",
  projectId: "clique-928d2",
  storageBucket: "clique-928d2.appspot.com",
  messagingSenderId: "444773129081",
  appId: "1:444773129081:web:13b070294628bfe2fdeda8",
  measurementId: "G-838DWQYZ86"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
  console.log(auth.currentUser.email)
};

function listEvents(auth) {
  //auth.
  //const calendar = google.calendar({version: 'v3', auth});
  // calendar.events.list({
  //   calendarId: 'primary',
  //   timeMin: (new Date()).toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // }, (err, res) => {
  //   if (err) return console.log('The API returned an error: ' + err);
  //   const events = res.data.items;
  //   if (events.length) {
  //     console.log('Upcoming 10 events:');
  //     events.map((event, i) => {
  //       const start = event.start.dateTime || event.start.date;
  //       console.log(`${start} - ${event.summary}`);
  //     });
  //   } else {
  //     console.log('No upcoming events found.');
  //   }
  // });
}


const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  listEvents,
  logout,
};
