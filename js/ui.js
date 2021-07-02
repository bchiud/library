const READ = "Read";
const UNREAD = "Unread";
const REMOVE = "\u2716";

const SIGN_IN = "Sign In";
const SIGN_OUT = "Sign Out";

// storage modal

const storageModal = document.querySelector(".data-storage-modal");

const storageLocalButton = document.querySelector("#data-storage-button-local");
storageLocalButton.addEventListener("click", () => {
  app.useLocalDatabase();
  storageModal.style.display = "none";
  app.initAuthState(refreshLibraryUI);
});

const storageCloudButton = document.querySelector("#data-storage-button-cloud");
storageCloudButton.addEventListener("click", () => {
  app.useFirebaseDatabase();
  storageModal.style.display = "none";
  app.initAuthState(refreshLibraryUI);
});

// firebase ui

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      app.useFirebaseDatabase();
      loginModalClose();
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

const loginButton = document.querySelector(".login-close");
loginButton.addEventListener("click", () => {
  loginModalClose();
});

function loginModalOpen() {
  loginModal.style.display = "flex";
}

function loginModalClose() {
  loginModal.style.display = "none";
}

function signInHandler() {
  loginModalOpen();
  ui.start("#firebaseui-auth-container", uiConfig);
}

function signOutHandler() {
  app.useLocalDatabase();
  firebase.auth().signOut();
  setUserDisplayAsSignedOut();
}

// new book

const newBookModal = document.querySelector(".new-book-modal");

const newBookButton = document.querySelector(".new-book-button");
newBookButton.addEventListener("click", () => {
  newBookModalOpen();
});

const newBookCloseButton = document.querySelector(".new-book-close");
newBookCloseButton.addEventListener("click", () => {
  newBookModalClose();
});

window.addEventListener("keydown", (e) => {
  if (e.key == "Escape") newBookModalClose();
});

function newBookModalOpen() {
  newBookModal.style.display = "flex";
}

function newBookModalClose() {
  newBookModal.style.display = "none";
}

// library

function refreshLibraryUI() {
  refreshBookGrid();
  refreshMetadata();
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
    newBookModalClose();
    refreshMetadata();
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
      app.saveLibrary();
    } else if (e.target.classList.contains("book-card-read-button-inactive")) {
      app.getBookFromLibrary(bookTitle).setAsRead();
      e.target.innerHTML = READ;
      e.target.classList.remove("book-card-read-button-inactive");
      e.target.classList.add("book-card-read-button-active");
      app.saveLibrary();
    } else if (e.target.classList.contains("book-card-remove-button")) {
      app.removeBookFromLibrary(bookTitle);
      bookGrid.removeChild(e.target.parentNode);
    }
  }
  refreshMetadata();
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
    book.getPages() + " " + (book.getPages() == 1 ? "page" : "pages");
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
userAuthButton.addEventListener("click", signInHandler);

function setUserDisplayAsSignedIn(user) {
  document.querySelector(".user-name").textContent = user.displayName;

  const userPhoto = document.querySelector(".user-photo");
  userPhoto.setAttribute("src", user.photoURL);

  userAuthButton.textContent = SIGN_OUT;
  userAuthButton.removeEventListener("click", signInHandler);
  userAuthButton.addEventListener("click", signOutHandler);
}

function setUserDisplayAsSignedOut() {
  document.querySelector(".user-name").textContent = "";

  document.querySelector(".user-photo").setAttribute("src", "");

  userAuthButton.textContent = SIGN_IN;
  userAuthButton.removeEventListener("click", signOutHandler);
  userAuthButton.addEventListener("click", signInHandler);
}

// metadata

const metadataReadBooksValue = document.querySelector(
  "#metadata-read-books-value"
);
const metadataUnreadBooksValue = document.querySelector(
  "#metadata-unread-books-value"
);
const metadataTotalBooksValue = document.querySelector(
  "#metadata-total-books-value"
);

function refreshMetadata() {
  const books = app.getLibrary();
  var read = 0;
  var unread = 0;

  if (books > 0) {
    books.forEach((book) => {
      book.getIsRead() ? (read += 1) : (unread += 1);
    });
  }

  metadataReadBooksValue.textContent = read;
  metadataUnreadBooksValue.textContent = unread;
  metadataTotalBooksValue.textContent = books.length;
}
