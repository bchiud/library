const App = () => {
  // library

  let library = Library([]);

  function getLibrary() {
    return library.getBooks();
  }

  function setLibrary(books) {
    library.setBooks(books);
    saveLibraryToDatabase();
  }

  function addBookToLibrary(newBook) {
    if (library.addBook(newBook)) {
      saveLibraryToDatabase();
      return true;
    }

    return false;
  }

  function getBookFromLibrary(bookTitle) {
    return library.getBook(bookTitle);
  }

  function removeBookFromLibrary(bookTitle) {
    if (library.removeBook(bookTitle)) {
      saveLibraryToDatabase();
      return true;
    }

    return false;
  }

  // databases

  let database = Database();

  const databaseOptions = database.databaseOptions;

  function getDatabaseLocation() {
    return database.getDatabaseLocation();
  }

  function saveLibraryToDatabase() {
    database.save(library.getBooks());
  }

  function refreshLibraryFromDatabase(refreshUICallback, userSignInHandler) {
    database.refreshLibrary(library, refreshUICallback, userSignInHandler);
  }


  function setDatabaseToLocal() {
    if (database.getDatabaseLocation() != database.LOCAL_STORAGE) {
      database.useLocal();
    }
  }

  function setDatabaseToFirebase() {
    if (database.getDatabaseLocation() != database.FIREBASE) {
      database.useFirebase();
    }
  }

  
  // login

  function initAuthState(refreshUICallback, userSignInHandler) {
    firebase.auth().onAuthStateChanged(function (user) {
      refreshLibraryFromDatabase(refreshUICallback, userSignInHandler);
    });
  }

  return {
    databaseOptions,
    getDatabaseLocation,
    getLibrary,
    setLibrary,
    addBookToLibrary,
    getBookFromLibrary,
    removeBookFromLibrary,
    saveLibraryToDatabase,
    refreshLibraryFromDatabase,
    setDatabaseToLocal,
    setDatabaseToFirebase,
    initAuthState,
  };
};

const app = App();
