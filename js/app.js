const STORAGE_LOCAL = "LOCAL";
const STORAGE_FIREBASE = "FIREBASE";
let storageSelection = STORAGE_LOCAL;

// book and library object

class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

let library = [];

function addBookToLibrary(newBook) {
  if (
    library.some(
      (book) => book.title.toLowerCase() == newBook.title.toLowerCase()
    )
  ) {
    return false;
  }

  library.push(newBook);
  saveLibrary();
  return true;
}

function getBookFromLibrary(bookTitle) {
  for (let book of library) {
    if (book.title.toLowerCase() == bookTitle.toLowerCase()) {
      return book;
    }
  }

  return null;
}

function removeBookFromLibrary(bookTitle) {
  library = library.filter((book) => {
    return book.title.toLowerCase() != bookTitle.toLowerCase();
  });
  saveLibrary();
}

function saveLibrary() {
  if (storageSelection == STORAGE_FIREBASE) {
    saveLibraryToFirebase(library);
  } else if (storageSelection == STORAGE_LOCAL) {
    saveLibraryToLocalStorage(library);
  }
}

// login

function initAuthState() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user && storageSelection == STORAGE_FIREBASE) {
      setUserDisplayAsSignedIn(user);
      library = getLibraryFromFirebase();
    } else if (!user && storageSelection == STORAGE_FIREBASE) {
      signInHandler();
    } else if (user && storageSelection == STORAGE_LOCAL) {
      setUserDisplayAsSignedIn(user);
      library = getLibraryFromLocalStorage();
    } else if (!user && storageSelection == STORAGE_LOCAL) {
      library = getLibraryFromLocalStorage();
    }

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
  library = getLibraryFromLocalStorage();
  refreshLibraryUI();
}

function switchToFirebase() {
  if (storageSelection != STORAGE_FIREBASE) {
    storageSelection = STORAGE_FIREBASE;
  }
  getLibraryFromFirebase();
}