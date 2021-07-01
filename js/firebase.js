// init

var firebaseConfig = {
  apiKey: "AIzaSyAw4k__PEgsbvK1a87bRMxMU9xHfyhe0Hs",
  authDomain: "library-4dde6.firebaseapp.com",
  projectId: "library-4dde6",
  storageBucket: "library-4dde6.appspot.com",
  messagingSenderId: "472151686152",
  appId: "1:472151686152:web:6caaf2a208c6fbe7a125bd",
  measurementId: "G-MLNE1HGCZH",
  databaseURL: "https://library-4dde6-default-rtdb.firebaseio.com",
  storageBucket: "",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

// database

var database = firebase.database();

function getLibraryFromFirebase() {
  var firebaseLibrary = [];

  const user = firebase.auth().currentUser;
  if (user) {
    firebase
      .database()
      .ref("users/" + user.uid)
      .once("value", function (snapshot) {
        snapshot.forEach(function (child) {
          firebaseLibrary.push(child.val());
        });
        library = firebaseLibrary;
        refreshLibrary();
      });
  } else {
    const e = new Error("No firebase user.");
  }

  return firebaseLibrary;
}

function saveLibraryToFirebase(library) {
  const user = firebase.auth().currentUser;
  if (user) {
    firebase
      .database()
      .ref("users/" + user.uid)
      .set(library);
  } else {
    const e = new Error("No firebase user.");
  }
}

// ui

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      storageSelection = STORAGE_FIREBASE;
      loginModal.style.display = "none";
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "<url-to-redirect-to-on-success>",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.disableAutoSignIn();
