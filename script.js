const myLibrary = new Array();

function Book(title, author, pages, isRead) {
  if (!new.target) throw Error("Call constructor with 'new' keyword");

  id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.readMessage = this.isRead ? "read" : "not read yet";

  this.info = () =>
    `${this.title} is written by ${this.author}, ${this.pages} pages, ${this.readMessage}`;
}

function addBookToLibrary(title, author, pages, isRead) {
  const book = new Book(title, author, pages, isRead);

  myLibrary.push(book);
}

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 448, true);
addBookToLibrary("What is History?", "E.H. Carr", 100, false);

const shelfRow = document.querySelector(".shelf-row");
const bookOpenSound = document.querySelector("#book-open-sound");

function displayBooks() {
  myLibrary.forEach((book) => {
    const newBook = document.createElement("div");
    newBook.classList.add("book");

    const bookTitle = document.createElement("div");
    bookTitle.classList.add("book-title");
    book.title.split(" ").forEach((word) => {
      const bookTitleWord = document.createElement("span");
      bookTitleWord.classList.add("book-title-word");
      bookTitleWord.textContent = word;
      bookTitle.appendChild(bookTitleWord);
    });

    newBook.addEventListener("mousedown", () => bookOpenSound.play());
    newBook.addEventListener("mouseleave", () => {
      bookOpenSound.pause();
      bookOpenSound.currentTime = 0;
    });

    newBook.appendChild(bookTitle);
    shelfRow.appendChild(newBook);
  });
}

displayBooks();
