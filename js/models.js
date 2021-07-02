
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

const Library = (allBooks) => {
  const getBooks = () => allBooks;

  const setBooks = (newBooks) => {
    allBooks = newBooks;
  };

  const addBook = (newBook) => {
    if (
      allBooks.some(
        (book) =>
          book.getTitle().toLowerCase() == newBook.getTitle().toLowerCase()
      )
    ) {
      return false;
    }

    allBooks.push(newBook);
    return true;
  }

  const getBook = (bookTitle) => {
    for (let book of allBooks) {
      if (book.getTitle().toLowerCase() == bookTitle.toLowerCase()) {
        return book;
      }
    }

    return null;
  }

  const removeBook = (bookTitle) => {
    if (getBook(bookTitle)) {
      allBooks = allBooks.filter((book) => {
        return book.getTitle().toLowerCase() != bookTitle.toLowerCase();
      });

      return true;
    }

    return false;
  }

  const clear = () => {
    allBooks = [];
  }

  return { getBooks, setBooks, addBook, getBook, removeBook, clear };
}
