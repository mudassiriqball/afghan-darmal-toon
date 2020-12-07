import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyAOd25x502YhekxnK9TytjdzfGooB5wKts",
    authDomain: "afghan-darmal-toon.firebaseapp.com",
    projectId: "afghan-darmal-toon",
    storageBucket: "afghan-darmal-toon.appspot.com",
    messagingSenderId: "262178561866",
    appId: "1:262178561866:web:615a0f10f569ff1e03abb3",
    measurementId: "G-XPQ222FQ4Z"
};
// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    // console.log('Fire base error:', err)
}

export default firebase;








// < !--The core Firebase JS SDK is always required and must be listed first-- >
//     <script src="https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js"></script>

//     <!--TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries -->

// <script>
//   // Your web app's Firebase configuration
//     var firebaseConfig = {
    //     apiKey: "AIzaSyAXPIF3Efk4Kkkd3HPe0_qlwxmZW4ksHf4",
    // authDomain: "mahaalk-de319.firebaseapp.com",
    // databaseURL: "https://mahaalk-de319.firebaseio.com",
    // projectId: "mahaalk-de319",
    // storageBucket: "mahaalk-de319.appspot.com",
    // messagingSenderId: "280555142279",
    // appId: "1:280555142279:web:caedee91f88cb3f5a84c22"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
// </script>