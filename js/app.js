const STORAGE_LOCAL = "LOCAL";
const STORAGE_FIREBASE = "FIREBASE";
let storageSelection = STORAGE_LOCAL;

// book and library object

const Book = (title, author, pages, isRead) => {
  const getTitle = () => title;
  const getAuthor = () => author;
  const getPages = () => pages;
  const getIsRead = () => isRead;

  const setAsRead = () => {
    isRead = true;
  };

  const setAsNotRead = () => {
    isRead = false;
  };

  return { getTitle, getAuthor, getPages, getIsRead, setAsRead, setAsNotRead };
};

let library = [];

function addBookToLibrary(newBook) {
  if (
    library.some(
      (book) =>
        book.getTitle().toLowerCase() == newBook.getTitle().toLowerCase()
    )
  ) {
    return false;
  }

  library.push(newBook);
  saveLibraryToDatabase();
  return true;
}

function getBookFromLibrary(bookTitle) {
  for (let book of library) {
    if (book.getTitle().toLowerCase() == bookTitle.toLowerCase()) {
      return book;
    }
  }

  return null;
}

function removeBookFromLibrary(bookTitle) {
  library = library.filter((book) => {
    return book.getTitle().toLowerCase() != bookTitle.toLowerCase();
  });
  saveLibraryToDatabase();
}

// login

function initAuthState() {
  firebase.auth().onAuthStateChanged(function (user) {
    library = getLibraryFromDatabase();

    refreshLibraryUI();
  });
}

function signInHandler() {
  loginModalOpen();
  ui.start("#firebaseui-auth-container", uiConfig);
}

function signOutHandler() {
  firebase.auth().signOut();

  setUserDisplayAsSignedOut();

  switchToLocal();
}

// storage

function switchToLocal() {
  if (storageSelection != STORAGE_LOCAL) {
    storageSelection = STORAGE_LOCAL;
  }
  library = getLibraryFromDatabase();
  refreshLibraryUI();
}

function switchToFirebase() {
  if (storageSelection != STORAGE_FIREBASE) {
    storageSelection = STORAGE_FIREBASE;
  }
  getLibraryFromDatabase();
}

function saveLibraryToDatabase() {
  serializedLibrary = serializeLibrary(library);

  if (storageSelection == STORAGE_FIREBASE) {
    saveLibraryToFirebase(serializedLibrary);
  } else if (storageSelection == STORAGE_LOCAL) {
    saveLibraryToLocalStorage(serializedLibrary);
  }
}

function getLibraryFromDatabase() {
  const user = firebase.auth().currentUser;

  if (user && storageSelection == STORAGE_FIREBASE) {
    setUserDisplayAsSignedIn(user);
    serializedLibrary = getLibraryFromFirebase();
  } else if (!user && storageSelection == STORAGE_FIREBASE) {
    signInHandler();
  } else if (user && storageSelection == STORAGE_LOCAL) {
    setUserDisplayAsSignedIn(user);
    serializedLibrary = getLibraryFromLocalStorage();
  } else if (!user && storageSelection == STORAGE_LOCAL) {
    serializedLibrary = getLibraryFromLocalStorage();
  }

  return deserializeLibrary(serializedLibrary);
}

function serializeLibrary(deserializedLibrary) {
  serializedLibrary = [];

  deserializedLibrary.forEach((book) => {
    const title = book.getTitle();
    const author = book.getAuthor();
    const pages = book.getPages();
    const isRead = book.getIsRead();

    serializedLibrary.push({title, author, pages, isRead});
  });

  return serializedLibrary;
}

function deserializeLibrary(serializedLibrary) {
  deserializedLibrary = [];

  serializedLibrary.forEach((book) => {
    deserializedLibrary.push(
      Book(book.title, book.author, book.pages, book.isRead)
    );
  });

  return deserializedLibrary;
}