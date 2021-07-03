const App = () => {
  // library

  var library = new Library([]);

  function createBook(title, author, pages, isRead) {
    const book = new Book(title, author, pages, isRead);
    if (library.addBook(book)) {
      saveLibraryToDatabase();
      return book;
    }

    return;
  }

  function getBook(bookTitle) {
    return library.getBook(bookTitle);
  }

  function getAllBooks() {
    return library.books;
  }

  function deleteBook(bookTitle) {
    if (library.removeBook(bookTitle)) {
      saveLibraryToDatabase();
      return true;
    }

    return false;
  }

  function markBookAsRead(bookTitle) {
    getBook(bookTitle).setAsRead();
    saveLibraryToDatabase();
  }

  function markBookAsUnread(bookTitle) {
    getBook(bookTitle).setAsNotRead();
    saveLibraryToDatabase();
  }

  // databases

  let database = Database();

  const databaseOptions = database.databaseOptions;

  function saveLibraryToDatabase() {
    database.save(library.books);
  }


  function getDatabaseLocation() {
    return database.getDatabaseLocation();
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

  function isDatabaseLocal() {
    return database.getDatabaseLocation() == database.databaseOptions.LOCAL;
  }

  function isDatabaseFirebase() {
    return database.getDatabaseLocation() == database.databaseOptions.FIREBASE;
  }

  function deleteLocalDatabase() {
    deleteDatabase(databaseOptions.LOCAL);
  }

  function deleteFirebaseDatabase() {
    deleteFirebaseDatabase(databaseOptions.FIREBASE);
  }

  function deleteDatabase(source = app.getDatabaseLocation()) {
    if (source === app.getDatabaseLocation()) {
      library.clear();
      database.clear();
    } else {
      database.clear(source);
    }
  }

  function refreshFromDatabase(refreshUICallback, userSignInHandler) {
    database.refreshLibrary(library, refreshUICallback, userSignInHandler);
  }

  // login

  function initAuthState(refreshUICallback, userSignInHandler) {
    firebase.auth().onAuthStateChanged(function (user) {
      refreshFromDatabase(refreshUICallback, userSignInHandler);
    });
  }

  return {
    databaseOptions,

    createBook,
    getBook,
    getAllBooks,
    deleteBook,
    markBookAsRead,
    markBookAsUnread,

    getDatabaseLocation,
    useLocalDatabase,
    useFirebaseDatabase,
    isDatabaseLocal,
    isDatabaseFirebase,
    deleteLocalDatabase,
    deleteFirebaseDatabase,
    deleteDatabase,
    refreshFromDatabase,
    
    initAuthState,
  };
};

const app = App();
