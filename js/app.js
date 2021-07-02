const App = () => {
  // library

  let library = Library([]);

  function getLibrary() {
    return library.getBooks();
  }

  function setLibrary(books) {
    library.setBooks(books);
    saveLibrary();
  }

  function addBookToLibrary(newBook) {
    if (library.addBook(newBook)) {
      saveLibrary();
      return true;
    }

    return false;
  }

  function getBookFromLibrary(bookTitle) {
    return library.getBook(bookTitle);
  }

  function removeBookFromLibrary(bookTitle) {
    if (library.removeBook(bookTitle)) {
      saveLibrary();
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

  function saveLibrary() {
    database.save(library.getBooks());
  }

  function useLocalDatabase() {
    if (database.getDatabaseLocation() != database.LOCAL_STORAGE) {
      database.useLocal();
    }
  }

  function useFirebaseDatabase() {
    if (database.getDatabaseLocation() != database.FIREBASE) {
      database.useFirebase();
    }
  }

  // login

  function initAuthState(refreshUICallback) {
    firebase.auth().onAuthStateChanged(function (user) {
      database.refreshUI(library, refreshUICallback);
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
    saveLibrary,
    useLocalDatabase,
    useFirebaseDatabase,
    initAuthState,
  };
};

const app = App();
