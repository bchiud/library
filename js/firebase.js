const Firebase = () => {
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

  var firebaseDatabase = firebase.database();

  function getLibraryFromFirebase(callback) {
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
          callback(firebaseLibrary);
        });
    } else {
      const e = new Error("No firebase user.");
    }
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

  return { getLibraryFromFirebase, saveLibraryToFirebase };
};
