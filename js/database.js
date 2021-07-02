const Database = () => {
  const LOCAL_STORAGE = "LOCAL_STORAGE";
  const FIREBASE = "FIREBASE";

  // init databases

  var databases = {
    localStorage: LocalStorage(),
    firebase: Firebase()
  };

  // database locations

  let databaseLocation = LOCAL_STORAGE;

  const isLocal = () => {
    return databaseLocation == LOCAL_STORAGE;
  };

  const useLocal = () => {
    databaseLocation = LOCAL_STORAGE;
  };

  const isFirebase = () => {
    return databaseLocation == FIREBASE;
  };

  const useFirebase = () => {
    databaseLocation = FIREBASE;
  };

  // interfaces

  const save = (library) => {
    serializedLibrary = serializeLibrary(library);

    if (databaseLocation == FIREBASE) {
      databases.firebase.saveLibraryToFirebase(serializedLibrary);
    } else if (databaseLocation == LOCAL_STORAGE) {
      databases.localStorage.saveLibraryToLocalStorage(serializedLibrary);
    }
  };

  const refreshUIFromDatabase = (library, refreshUICallback) => {
    const user = firebase.auth().currentUser;

    if (user) {
      setUserDisplayAsSignedIn(user);
    }

    if (databaseLocation == LOCAL_STORAGE) {
      refershLibraryFromLocalStorage(library, refreshUICallback);
    } else if (databaseLocation == FIREBASE) {
      if (user) {
        refreshLibraryFromFirebase(library, refreshUICallback);
      } else {
        signInHandler();
      }
    }
  };

  // databases

  const refershLibraryFromLocalStorage = (library, refreshUICallback) => {
    serializedLibrary = databases.localStorage.getLibraryFromLocalStorage();
    deserializedLibrary = deserializeLibrary(serializedLibrary);
    library.setBooks(deserializedLibrary);
    refreshUICallback();
  };

  const refreshLibraryFromFirebase = (library, refreshUICallback) => {
    function getLibraryFromFirebaseCallback(firebaseLibrary) {
      serializedLibrary = firebaseLibrary;
      deserializedLibrary = deserializeLibrary(serializedLibrary);
      library.setBooks(deserializedLibrary);
      refreshUICallback();
    }

    databases.firebase.getLibraryFromFirebase(getLibraryFromFirebaseCallback);
  };

  // serdes

  const serializeLibrary = (deserializedLibrary) => {
    serializedLibrary = [];

    deserializedLibrary.forEach((book) => {
      const title = book.getTitle();
      const author = book.getAuthor();
      const pages = book.getPages();
      const isRead = book.getIsRead();

      serializedLibrary.push({ title, author, pages, isRead });
    });

    return serializedLibrary;
  };

  const deserializeLibrary = (serializedLibrary) => {
    deserializedLibrary = [];

    serializedLibrary.forEach((book) => {
      deserializedLibrary.push(
        Book(book.title, book.author, book.pages, book.isRead)
      );
    });

    return deserializedLibrary;
  };

  return {
    isLocal,
    useLocal,
    isFirebase,
    useFirebase,
    save,
    refreshUIFromDatabase,
  };
};
