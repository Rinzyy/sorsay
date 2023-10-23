// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
// const {
// 	initializeAppCheck,
// 	ReCaptchaV3Provider,
// } = require('firebase/app-check');

// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDbX_dl-oLipUha7DG2oqhqwi9615dKIHo',
	authDomain: 'sorsay-ai.firebaseapp.com',
	projectId: 'sorsay-ai',
	storageBucket: 'sorsay-ai.appspot.com',
	messagingSenderId: '450962668280',
	appId: '1:450962668280:web:1eea4cb0430c4987e9590d',
	measurementId: 'G-HGMLM33NBE',
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
// const appCheck = initializeAppCheck(app, {
// 	provider: new ReCaptchaV3Provder('6LcHFeYkAAAAAPlVL6pz01g246hBkIHXjiDuRMLS'),
// recatc
// 	// Optional argument. If true, the SDK automatically refreshes App Check
// 	// tokens as needed.
// 	isTokenAutoRefreshEnabled: true,
// });
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage, firebaseConfig, auth };
