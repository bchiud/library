const COLOR_PRIMARY = "#90caf9";
const COLOR_PRIMARY_LIGHT = "#c3fdff";
const COLOR_PRIMARY_DARK = "#5d99c6";

const READ = "Read";
const UNREAD = "Unread";
const REMOVE = "Remove";

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
  if (library.some((book) => book.title.toLowerCase() == newBook.title.toLowerCase())) {
    return false;
  }

  library.push(newBook);
  saveToLocalStorage();
  return true;
}

function removeBookFromLibrary(bookTitle) {
  library = library.filter((book) => {
    book.title.toLowerCase() != bookTitle.toLowerCase();
  });
  saveToLocalStorage();
}

function getBookFromLibrary(bookTitle) {
  for (let book of library) {
    if (book.title.toLowerCase() == bookTitle.toLowerCase()) {
      return book;
    }
  }

  return null;
}

// new book modal

const newBookModal = document.querySelector(".new-book-modal");

const newBookButton = document.querySelector(".new-book-button");
newBookButton.addEventListener("click", () => {
  openModal();
});

const newBookCloseButton = document.querySelector(".new-book-close");
newBookCloseButton.addEventListener("click", () => {
  closeModal();
});

window.addEventListener("keydown", e => {
  if (e.key == "Escape") closeModal();
})

function openModal() {
  newBookModal.style.display = "flex";
}

function closeModal() {
  newBookModal.style.display = "none";
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
  const book = new Book(title, author, pages, isRead);

  if (addBookToLibrary(book)) {
    createBookCard(book);
    newBookForm.reset();
    closeModal();
  } else {
    alert("Book already exists");
  }
}

// books grid

const bookGrid = document.querySelector(".book-grid");
bookGrid.addEventListener('click', bookGridClick);

function bookGridClick(e) {
  bookTitle = e.target.parentNode.parentNode.firstChild.innerHTML;

  if (e.target.classList.contains("book-card-read-button-active")) {
    getBookFromLibrary(bookTitle).isRead = false;
    e.target.innerHTML = UNREAD;
    e.target.classList.remove("book-card-read-button-active");
    e.target.classList.add("book-card-read-button-inactive");
    saveToLocalStorage();
  } else if (e.target.classList.contains("book-card-read-button-inactive")) {
    getBookFromLibrary(bookTitle).isRead = true;
    e.target.innerHTML = READ;
    e.target.classList.remove("book-card-read-button-inactive");
    e.target.classList.add("book-card-read-button-active");
    saveToLocalStorage();
  } else if (e.target.classList.contains("book-card-remove-button")) {
    removeBookFromLibrary(bookTitle);
    bookGrid.removeChild(e.target.parentNode.parentNode);
  }
}

function createBookCard(book) {
  const bookCard = document.createElement("div");
  const title = document.createElement("h3");
  const author = document.createElement("h3");
  const pages = document.createElement("h3");
  const bookCardMenu = document.createElement("div");
  const read = document.createElement("button");
  const remove = document.createElement("button");

  bookCard.classList.add("book-card");

  title.textContent = book.title;

  author.textContent = book.author;

  pages.textContent = book.pages;

  read.classList.add("book-card-menu-button");
  if (book.isRead) {
    read.classList.add("book-card-read-button-active");
    read.textContent = READ;
  } else {
    read.classList.add("book-card-read-button-inactive");
    read.textContent = UNREAD;
  }

  remove.textContent = REMOVE;
  remove.classList.add("book-card-menu-button");
  remove.classList.add("book-card-remove-button");

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCardMenu.appendChild(read);
  bookCardMenu.appendChild(remove);
  bookCard.appendChild(bookCardMenu);
  bookGrid.appendChild(bookCard);
}

// local storage

function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(library));
  console.log('save');
}

function restoreFromLocalStorage() {
  library = JSON.parse(localStorage.getItem("library"));
  if (library === null) library = [];

  library.forEach(book => createBookCard(book));
}

restoreFromLocalStorage();