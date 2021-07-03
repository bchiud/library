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

  const save = (library, source = databaseLocation) => {
    serializedLibrary = serializeLibrary(library);

    if (source == databaseOptions.FIREBASE) {
      databases.firebase.saveLibraryToFirebase(serializedLibrary);
    } else if (source == databaseOptions.LOCAL) {
      databases.localStorage.saveLibraryToLocalStorage(serializedLibrary);
    }
  };

  const clear = (source = databaseLocation) => {
    save([], source);
  };

  const refreshLibrary = (library, refreshUICallback, userSignInHandler) => {
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
        userSignInHandler();
      }
    }
  };

  // databases

  const refershLibraryFromLocalStorage = (library, refreshUICallback) => {
    serializedLibrary = databases.localStorage.getLibraryFromLocalStorage();
    deserializedLibrary = deserializeLibrary(serializedLibrary);
    library.books = deserializedLibrary;
    refreshUICallback();
  };

  const refreshLibraryFromFirebase = (library, refreshUICallback) => {
    function getLibraryFromFirebaseCallback(firebaseLibrary) {
      serializedLibrary = firebaseLibrary;
      deserializedLibrary = deserializeLibrary(serializedLibrary);
      library.books = deserializedLibrary;
      refreshUICallback();
    }

    databases.firebase.getLibraryFromFirebase(getLibraryFromFirebaseCallback);
  };

  // serdes

  const serializeLibrary = (deserializedLibrary) => {
    serializedLibrary = [];

    deserializedLibrary.forEach((book) => {
      const title = book.title;
      const author = book.author;
      const pages = book.pages;
      const isRead = book.isRead;

      serializedLibrary.push({ title, author, pages, isRead });
    });

    return serializedLibrary;
  };

  const deserializeLibrary = (serializedLibrary) => {
    deserializedLibrary = [];

    serializedLibrary.forEach((book) => {
      deserializedLibrary.push(
        new Book(book.title, book.author, book.pages, book.isRead)
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
    clear,
    refreshLibrary,
  };
};
