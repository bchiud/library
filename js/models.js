class Book {
  constructor(title, author, pages, isRead) {
    this._title = title;
    this._author = author;
    this._pages = pages;
    this._isRead = isRead;
  }

  get title() {
    return this._title;
  }

  get author() {
    return this._author;
  }

  get pages() {
    return this._pages;
  }

  get isRead() {
    return this._isRead;
  }

  setAsRead = () => {
    this._isRead = true;
  };

  setAsNotRead = () => {
    this._isRead = false;
  };
}

class Library {

  constructor(books) {
    this._books = books ? books : [];
  }

  get books() {
    return this._books;
  }

  set books(newBooks) {
    this._books = newBooks;
  }

  addBook = (newBook) => {
    if (this._books.some((book) => book.title.toLowerCase() == newBook.title.toLowerCase())) {
      return false;
    }

    this._books.push(newBook);
    return true;
  }

  getBook = (bookTitle) => {
    for (let book of this._books) {
      if (book.title.toLowerCase() == bookTitle.toLowerCase()) {
        return book;
      }
    }

    return null;
  }

  removeBook = (bookTitle) => {
    if (getBook(bookTitle)) {
      this._books = this._books.filter((book) => {
        return book.title.toLowerCase() != bookTitle.toLowerCase();
      });

      return true;
    }

    return false;
  }

  clear = () => {
    this._books = [];
  }
}
