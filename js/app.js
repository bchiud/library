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
  console.log(library.length);
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

const loginModal = document.querySelector(".login-modal");

const userAuthButton = document.querySelector(".user-auth");
userAuthButton.addEventListener("click", signInHandler);

function initAuthState() {
  console.log("initAuthState");

  firebase.auth().onAuthStateChanged(function (user) {
    console.log("onAuthStateChanged : " + (user ? user.uid : 'No User') + " , " + storageSelection);
    if (user && storageSelection == STORAGE_FIREBASE) {
      setUserDisplayAsSignedIn(user);
      library = getLibraryFromFirebase();
    } else if (!user && storageSelection == STORAGE_FIREBASE) {
      

      loginModal.style.display = "flex";
      ui.start("#firebaseui-auth-container", uiConfig);
    } else if (user && storageSelection == STORAGE_LOCAL) {
      setUserDisplayAsSignedIn(user);
      library = getLibraryFromLocalStorage();
    } else if (!user && storageSelection == STORAGE_LOCAL) {
      library = getLibraryFromLocalStorage();
    }

    refreshLibrary();
  });
}

function signInHandler() {
  console.log("signInHandler");

  // uiConfig.callbacks.signInSuccessWithAuthResult = function (authResult, redirectUrl) {
  //       // User successfully signed in.
  //       // Return type determines whether we continue the redirect automatically
  //       // or whether we leave that to developer to handle.
  //       console.log('signInSuccessWithAuthResult');
  //       signInSuccessHandler()
  //       return false;
  //     };

  loginModal.style.display = "flex";

  ui.start("#firebaseui-auth-container", uiConfig);
}

function signOutHandler() {
  console.log("signOutHandler");

  storageSelection = STORAGE_LOCAL;

  firebase.auth().signOut();

  setUserDisplayAsSignedOut();

  clearBookGrid();
}


