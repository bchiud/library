const Database = () => {
  const databaseOptions = {
    LOCAL: "LOCAL",
    FIREBASE: "FIREBASE",
  };

  // init databases

  var databases = {
    localStorage: LocalStorage(),
    firebase: Firebase()
  };

  // database locations

  let databaseLocation = databaseOptions.LOCAL;

  const getDatabaseLocation = () => {
    return databaseLocation;
  }

  const useLocal = () => {
    databaseLocation = databaseOptions.LOCAL;
  };

  const useFirebase = () => {
    databaseLocation = databaseOptions.FIREBASE;
  };

  // interfaces

  const save = (library) => {
    serializedLibrary = serializeLibrary(library);

    if (databaseLocation == databaseOptions.FIREBASE) {
      databases.firebase.saveLibraryToFirebase(serializedLibrary);
    } else if (databaseLocation == databaseOptions.LOCAL) {
      databases.localStorage.saveLibraryToLocalStorage(serializedLibrary);
    }
  };

  const refreshUI = (library, refreshUICallback) => {
    const user = firebase.auth().currentUser;

    if (user) {
      setUserDisplayAsSignedIn(user);
    }

    if (databaseLocation == databaseOptions.LOCAL) {
      refershLibraryFromLocalStorage(library, refreshUICallback);
    } else if (databaseLocation == databaseOptions.FIREBASE) {
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
    databaseOptions,
    getDatabaseLocation,
    useLocal,
    useFirebase,
    save,
    refreshUI,
  };
};
