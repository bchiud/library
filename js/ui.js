const COLOR_PRIMARY = "#90caf9";
const COLOR_PRIMARY_LIGHT = "#c3fdff";
const COLOR_PRIMARY_DARK = "#5d99c6";

const READ = "Read";
const UNREAD = "Unread";
const REMOVE = "\u2716";

const SIGN_IN = "Sign In";
const SIGN_OUT = "Sign Out";

// storage modal

const storageModal = document.querySelector(".data-storage-modal");

const storageLocalButton = document.querySelector("#data-storage-button-local");
storageLocalButton.addEventListener("click", () => {
  storageSelection = STORAGE_LOCAL;
  storageModal.style.display = "none";
  initAuthState();
});

const storageCloudButton = document.querySelector("#data-storage-button-cloud");
storageCloudButton.addEventListener("click", () => {
  storageSelection = STORAGE_FIREBASE;
  storageModal.style.display = "none";
  initAuthState();
});

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

// form

const newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener("submit", addBookFromForm);

function addBookFromForm(e) {
  e.preventDefault();

  const title = document.querySelector("#new-book-form-book-title").value;
  const author = document.querySelector("#new-book-form-book-author").value;
  const pages = document.querySelector("#new-book-form-book-pages").value;
  const isRead = document.querySelector("#is-read").checked;
  const book = Book(title, author, pages, isRead);

  if (addBookToLibrary(book)) {
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
  if (library.length > 0) {
    library.forEach((book) => createBookCard(book));
  }
}

function bookGridClick(e) {
  if (e.target != newBookButton) {
    bookTitle = e.target.parentNode.firstChild.innerHTML.match('^"(.*)"$')[1];

    if (e.target.classList.contains("book-card-read-button-active")) {
      // getBookFromLibrary(bookTitle).isRead = false;
      getBookFromLibrary(bookTitle).setAsNotRead();
      e.target.innerHTML = UNREAD;
      e.target.classList.remove("book-card-read-button-active");
      e.target.classList.add("book-card-read-button-inactive");
      saveLibraryToDatabase();
    } else if (e.target.classList.contains("book-card-read-button-inactive")) {
      // getBookFromLibrary(bookTitle).isRead = true;
      getBookFromLibrary(bookTitle).setAsRead();
      e.target.innerHTML = READ;
      e.target.classList.remove("book-card-read-button-inactive");
      e.target.classList.add("book-card-read-button-active");
      saveLibraryToDatabase();
    } else if (e.target.classList.contains("book-card-remove-button")) {
      removeBookFromLibrary(bookTitle);
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
  var read = 0;
  var unread = 0;

  if (library) {
    library.forEach((book) => {
      book.getIsRead() ? (read += 1) : (unread += 1);
    });
  }

  metadataReadBooksValue.textContent = read;
  metadataUnreadBooksValue.textContent = unread;
  metadataTotalBooksValue.textContent = library.length;
}

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
  if (storageSelection != STORAGE_LOCAL) {
    switchToLocal();
  }
}
