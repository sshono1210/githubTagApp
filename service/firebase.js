import firebase from 'firebase'

if (!firebase.apps.length) {
	// Initialize Firebase
	var config = {
		apiKey: process.env.API_KEY,
		authDomain: process.env.AUTH_DOMAIN,
		databaseURL: process.env.DB_URL,
		projectId: process.env.PROJECT_ID,
		storageBucket: process.env.STORAGE_BUCKET,
		messagingSenderId: process.env.MESSAGING_SENDER_ID
	};
	firebase.initializeApp(config);}

export default firebase