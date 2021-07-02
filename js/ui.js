const READ = "Read";
const UNREAD = "Unread";
const REMOVE = "\u2716";

const SIGN_IN = "Sign In";
const SIGN_OUT = "Sign Out";

// storage modal

const storageModal = document.querySelector(".storage-modal");

function hideStorageModal() {
  storageModal.style.display = "none";
}

const storageModalButtonLocal = document.querySelector("#storage-modal-button-local");
storageModalButtonLocal.addEventListener("click", () => {
  switchToLocalDatabase();
  hideStorageModal();
  app.initAuthState(refreshLibraryUI, userSignInHandler);
});

const storageModalButtonCloud = document.querySelector("#storage-modal-button-cloud");
storageModalButtonCloud.addEventListener("click", () => {
  switchToFirebaseDatabase();
  hideStorageModal();
  app.initAuthState(refreshLibraryUI, userSignInHandler);
});

// firebase ui

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      switchToAndRefreshFromFirebaseDatabase();
      hideLoginModal();
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "<url-to-redirect-to-on-success>",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn();

// login modal

const loginModal = document.querySelector(".login-modal");

loginModal.addEventListener("keydown", (e) => {
  if (e.key == "Escape") hideLoginModal();
});

const loginModalCloseButton = document.querySelector(".login-modal-close");
loginModalCloseButton.addEventListener("click", () => {
  hideLoginModal();
});

function showLoginModal() {
  loginModal.style.display = "flex";
}

function hideLoginModal() {
  loginModal.style.display = "none";
}

// new book button

const newBookButton = document.querySelector(".new-book-button");
newBookButton.addEventListener("click", () => {
  showNewBookModal();
});

// new book modal

const newBookModal = document.querySelector(".new-book-modal");

newBookModal.addEventListener("keydown", (e) => {
  if (e.key == "Escape") hideNewBookModal();
});

const newBookModalCloseButton = document.querySelector(".new-book-modal-close");
newBookModalCloseButton.addEventListener("click", () => {
  hideNewBookModal();
});

function showNewBookModal() {
  newBookModal.style.display = "flex";
}

function hideNewBookModal() {
  newBookModal.style.display = "none";
}

// new book form

const newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener("submit", addBookFromForm);

function addBookFromForm(e) {
  e.preventDefault();

  const title = document.querySelector("#new-book-form-book-title").value;
  const author = document.querySelector("#new-book-form-book-author").value;
  const pages = document.querySelector("#new-book-form-book-pages").value;
  const isRead = document.querySelector("#is-read").checked;
  const book = Book(title, author, pages, isRead);

  if (app.addBookToLibrary(book)) {
    createBookCard(book);
    newBookForm.reset();
    hideNewBookModal();
    refreshStatisticsPanel();
  } else {
    alert("Book already exists");
  }
}

// books grid

const bookGrid = document.querySelector(".book-grid");
bookGrid.addEventListener("click", bookGridClick);

function clearBookGrid() {
  var first = bookGrid.firstElementChild;
  while (first && first != newBookButton) {
    first.remove();
    first = bookGrid.firstElementChild;
  }
}

function refreshBookGrid() {
  clearBookGrid();
  const books = app.getLibrary();
  if (books.length > 0) {
    books.forEach((book) => createBookCard(book));
  }
}

function bookGridClick(e) {
  if (e.target != newBookButton) {
    bookTitle = e.target.parentNode.firstChild.innerHTML.match('^"(.*)"$')[1];

    if (e.target.classList.contains("book-card-read-button-active")) {
      app.getBookFromLibrary(bookTitle).setAsNotRead();
      e.target.innerHTML = UNREAD;
      e.target.classList.remove("book-card-read-button-active");
      e.target.classList.add("book-card-read-button-inactive");
      app.saveLibraryToDatabase();
    } else if (e.target.classList.contains("book-card-read-button-inactive")) {
      app.getBookFromLibrary(bookTitle).setAsRead();
      e.target.innerHTML = READ;
      e.target.classList.remove("book-card-read-button-inactive");
      e.target.classList.add("book-card-read-button-active");
      app.saveLibraryToDatabase();
    } else if (e.target.classList.contains("book-card-remove-button")) {
      app.removeBookFromLibrary(bookTitle);
      bookGrid.removeChild(e.target.parentNode);
    }
  }
  refreshStatisticsPanel();
}

function createBookCard(book) {
  const bookCard = document.createElement("div");
  const title = document.createElement("h3");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const read = document.createElement("button");
  const remove = document.createElement("h3");

  bookCard.classList.add("book-card");

  title.textContent = '"' + book.getTitle() + '"';
  title.classList.add("book-card-text");
  title.classList.add("book-card-title");

  author.textContent = "by " + book.getAuthor();
  author.classList.add("book-card-text");
  author.classList.add("book-card-author");

  pages.textContent =
    book.getPages() + " " + (book.getPages() === 1 ? "page" : "pages");
  pages.classList.add("book-card-text");
  pages.classList.add("book-card-pages");

  read.classList.add("book-card-menu-button");
  if (book.getIsRead()) {
    read.classList.add("book-card-read-button-active");
    read.textContent = READ;
  } else {
    read.classList.add("book-card-read-button-inactive");
    read.textContent = UNREAD;
  }

  remove.textContent = REMOVE;
  remove.classList.add("close", "book-card-remove-button");

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(read);
  bookCard.appendChild(remove);

  bookGrid.insertBefore(bookCard, newBookButton);
}

// user

const userAuthButton = document.querySelector(".user-auth");
userAuthButton.addEventListener("click", userSignInHandler);

function setUserDisplayAsSignedIn(user) {
  document.querySelector(".user-name").textContent = user.displayName;

  const userPhoto = document.querySelector(".user-photo");
  userPhoto.setAttribute("src", user.photoURL);

  userAuthButton.textContent = SIGN_OUT;
  userAuthButton.removeEventListener("click", userSignInHandler);
  userAuthButton.addEventListener("click", userSignOutHandler);
}

function setUserDisplayAsSignedOut() {
  document.querySelector(".user-name").textContent = "";

  document.querySelector(".user-photo").setAttribute("src", "");

  userAuthButton.textContent = SIGN_IN;
  userAuthButton.removeEventListener("click", userSignOutHandler);
  userAuthButton.addEventListener("click", userSignInHandler);
}

function userSignInHandler() {
  showLoginModal();
  ui.start("#firebaseui-auth-container", uiConfig);
}

function userSignOutHandler() {
  switchToAndRefreshFromLocalDatabase();
  firebase.auth().signOut();
  setUserDisplayAsSignedOut();
}

// statistics panel

const statisticsReadBooks = document.querySelector("#statistics-read-books");
const statisticsUnreadBooks = document.querySelector("#statistics-unread-books");
const statisticsTotalBooks = document.querySelector("#statistics-total-books");

function refreshStatisticsPanel() {
  const books = app.getLibrary();
  var read = 0;
  var unread = 0;

  if (books.length > 0) {
    books.forEach((book) => {
      book.getIsRead() ? (read += 1) : (unread += 1);
    });
  }

  statisticsReadBooks.textContent = read;
  statisticsUnreadBooks.textContent = unread;
  statisticsTotalBooks.textContent = books.length;
}

// storage panel

const storagePanelCloudButton = document.querySelector("#storage-panel-button-cloud");
storagePanelCloudButton.addEventListener("click", switchToAndRefreshFromFirebaseDatabase);

const storagePanelLocalButton = document.querySelector("#storage-panel-button-local");
storagePanelLocalButton.addEventListener("click", switchToAndRefreshFromLocalDatabase);

function refreshStoragePanel() {
  const databaseLocation = app.getDatabaseLocation();

  if (databaseLocation === app.databaseOptions.LOCAL) {
    setStoragePanelButtonAsActive(storagePanelLocalButton);
  } else if (databaseLocation === app.databaseOptions.FIREBASE) {
    setStoragePanelButtonAsActive(storagePanelCloudButton);
  }
}

function setStoragePanelButtonAsActive(activeButton) {
  const storageOptionButtons = document.querySelectorAll(".storage-panel-button-storage-option");

  storageOptionButtons.forEach((button) => {
    if (button === activeButton) {
      if (button.classList.contains("storage-panel-button-inactive")) {
        button.classList.remove("storage-panel-button-inactive");
      }

      if (!button.classList.contains("storage-panel-button-active")) {
        button.classList.add("storage-panel-button-active");
      }

    } else {  // mark other buttons as inactive
      if (button.classList.contains("storage-panel-button-active")) {
        button.classList.remove("storage-panel-button-active");
      }

      if (!button.classList.contains("storage-panel-button-inactive")) {
        button.classList.add("storage-panel-button-inactive");
      }
    }
  });
}

// delete data

const storagePanelDeleteCloudButton = document.querySelector("#storage-panel-button-delete-cloud");

storagePanelDeleteCloudButton.addEventListener("click", () => {
  showConfirmDeleteModal(app.databaseOptions.FIREBASE);
});

const storagePanelDeleteLocalButton = document.querySelector("#storage-panel-button-delete-local");

storagePanelDeleteLocalButton.addEventListener("click", () => {
  showConfirmDeleteModal(app.databaseOptions.LOCAL);
});

function deleteFirebaseDatabase() {
  app.deleteLibraryFromDatabase(app.databaseOptions.FIREBASE);

  if (app.getDatabaseLocation() === app.databaseOptions.FIREBASE) {
    refreshLibraryUI();
  }
}

function deleteLocalDatabase() {
  app.deleteLibraryFromDatabase(app.databaseOptions.LOCAL);

  if (app.getDatabaseLocation() === app.databaseOptions.LOCAL) {
    refreshLibraryUI();
  }
}

// confirm delete modal

const confirmDeleteModal = document.querySelector(".confirm-delete-modal");
const confirmDeleteModalCloseButton = document.querySelector(".confirm-delete-modal-close");
const confirmDeletePrompt = document.querySelector("#confirm-delete-prompt");
const confirmDeleteYesButton = document.querySelector("#confirm-delete-yes-button");
const confirmDeleteNoButton = document.querySelector("#confirm-delete-no-button");

confirmDeleteModal.addEventListener("keydown", (e) => {
  if (e.key == "Escape") hideConfirmDeleteModal();
});

function showConfirmDeleteModal(source) {
  sourceStr = (() => {
    if (source === app.databaseOptions.LOCAL) {
      return 'Local';
    } else if (source === app.databaseOptions.FIREBASE) {
      return 'Cloud';
    }
  })()
  var prompt = `Are you sure you want to delete the ${sourceStr} library?`
  confirmDeletePrompt.innerHTML = prompt;

  function callback() {
    hideConfirmDeleteModal();

    app.deleteLibraryFromDatabase(source);
    if (source === app.getDatabaseLocation()) {
      refreshLibraryUI();
    }

    confirmDeleteYesButton.removeEventListener('click', callback);
  }

  confirmDeleteYesButton.addEventListener("click", callback);

  confirmDeleteNoButton.addEventListener("click", () => {
    hideConfirmDeleteModal()
  });

  confirmDeleteModalCloseButton.addEventListener("click", () => {
    hideConfirmDeleteModal();
  });

  confirmDeleteModal.style.display = "flex";
}

function hideConfirmDeleteModal() {
  confirmDeleteModal.style.display = "none";
}

// switch databases

function switchToLocalDatabase() {
  app.setDatabaseToLocal();
}

function switchToFirebaseDatabase() {
  app.setDatabaseToFirebase();
}

// refresh library

function refreshLibraryUI() {
  refreshBookGrid();
  refreshStatisticsPanel();
  refreshStoragePanel();
}

function switchToAndRefreshFromLocalDatabase() {
  switchToLocalDatabase();
  app.refreshLibraryFromDatabase(refreshLibraryUI, userSignInHandler);
}

function switchToAndRefreshFromFirebaseDatabase() {
  switchToFirebaseDatabase();
  app.refreshLibraryFromDatabase(refreshLibraryUI, userSignInHandler);
}