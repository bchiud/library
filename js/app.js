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

  function saveLibrary() {
    database.save(library.getBooks());
  }

  function useLocalDatabase() {
    if (!database.isLocal()) {
      database.useLocal();
    }
  }

  function useFirebaseDatabase() {
    if (!database.isFirebase()) {
      database.useFirebase();
    }
  }

  // login

  function initAuthState(refreshUICallback) {
    firebase.auth().onAuthStateChanged(function (user) {
      database.refreshUIFromDatabase(library, refreshUICallback);
    });
  }

  return {
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
