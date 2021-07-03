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
    isRead = true;
  };

  setAsNotRead = () => {
    isRead = false;
  };
}

// const Book = (title, author, pages, isRead) => {
//   const getTitle = () => title;
//   const getAuthor = () => author;
//   const getPages = () => pages;
//   const getIsRead = () => isRead;

//   const setAsRead = () => {
//     isRead = true;
//   };

//   const setAsNotRead = () => {
//     isRead = false;
//   };

//   return { getTitle, getAuthor, getPages, getIsRead, setAsRead, setAsNotRead };
// };

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
    if (this._books.some((book) => book.getTitle().toLowerCase() == newBook.getTitle().toLowerCase())) {
      return false;
    }

    this._books.push(newBook);
    return true;
  }

  getBook = (bookTitle) => {
    for (let book of this._books) {
      if (book.getTitle().toLowerCase() == bookTitle.toLowerCase()) {
        return book;
      }
    }

    return null;
  }

  removeBook = (bookTitle) => {
    if (getBook(bookTitle)) {
      this._books = this._books.filter((book) => {
        return book.getTitle().toLowerCase() != bookTitle.toLowerCase();
      });

      return true;
    }

    return false;
  }

  clear = () => {
    this._books = [];
  }
}

// const Library = (allBooks) => {
//   const getBooks = () => allBooks;

//   const setBooks = (newBooks) => {
//     allBooks = newBooks;
//   };

//   const addBook = (newBook) => {
//     if (allBooks.some((book) => book.getTitle().toLowerCase() == newBook.getTitle().toLowerCase())) {
//       return false;
//     }

//     allBooks.push(newBook);
//     return true;
//   }

//   const getBook = (bookTitle) => {
//     for (let book of allBooks) {
//       if (book.getTitle().toLowerCase() == bookTitle.toLowerCase()) {
//         return book;
//       }
//     }

//     return null;
//   }

//   const removeBook = (bookTitle) => {
//     if (getBook(bookTitle)) {
//       allBooks = allBooks.filter((book) => {
//         return book.getTitle().toLowerCase() != bookTitle.toLowerCase();
//       });

//       return true;
//     }

//     return false;
//   }

//   const clear = () => {
//     allBooks = [];
//   }

//   return { getBooks, setBooks, addBook, getBook, removeBook, clear };
// }
