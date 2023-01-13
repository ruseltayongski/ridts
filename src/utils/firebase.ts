// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const initFirebase = () => {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCGEy0zaHgYrSKSUxhnH_l73KHOwo5Gl4g",
        authDomain: "ridts-1cf2a.firebaseapp.com",
        projectId: "ridts-1cf2a",
        storageBucket: "ridts-1cf2a.appspot.com",
        messagingSenderId: "34560028852",
        appId: "1:34560028852:web:6edbaa887f5be863ede7e1",
        measurementId: "G-GZXDC7PW2K"
    };

    // Initialize Firebase
    //const app = initializeApp(firebaseConfig)
    //const analytics = getAnalytics(app);
    const app = initializeApp(firebaseConfig)

    // Initialize Realtime Database and get a reference to the service
    const database = getDatabase(app);

    return database;
}

const insertFirebase = () => {
    const db = initFirebase();
    push(ref(db, 'ridts'), { message : "wew" })
    .then((success) => {
        console.log("success")
    // Data saved successfully!
    })
    .catch((error) => {
        console.log(error)
    // The write failed...
    });
}

const readFirebase = () => {
    const db = initFirebase();
    const starCountRef = ref(db, 'ridts');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
    });
}

export { insertFirebase, readFirebase }