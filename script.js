const myLibrary = new Array();

function Book(title, author, pages, isRead) {
  if (!new.target) throw Error("Call constructor with 'new' keyword");

  id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.readMessage = this.isRead ? "Read" : "Not read";

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
const bookHoverSound = document.querySelector("#book-hover-sound");
const modalContainer = document.querySelector(".modal-container");

function displayBooks() {
  myLibrary.forEach((book) => {
    const newBook = document.createElement("div");
    newBook.classList.add("book");

    // book spine
    const bookTitle = document.createElement("div");
    bookTitle.classList.add("book-title");
    book.title.split(" ").forEach((word) => {
      const bookTitleWord = document.createElement("span");
      bookTitleWord.classList.add("book-title-word");
      bookTitleWord.textContent = word;
      bookTitle.appendChild(bookTitleWord);
    });

    // book opened
    const bookDialog = document.createElement("dialog");
    const dialogTitle = document.createElement("h2");
    const dialogAuthor = document.createElement("p");
    const dialogPages = document.createElement("p");
    const dialogReadMessage = document.createElement("p");

    bookDialog.classList.add("book-dialog");
    bookDialog.setAttribute("closedby", "any");
    dialogTitle.textContent = "Title: " + book.title;
    dialogAuthor.textContent = "Written by " + book.author;
    dialogPages.textContent = book.pages + " Pages";
    dialogReadMessage.textContent = "Status: " + book.readMessage;

    bookDialog.appendChild(dialogTitle);
    bookDialog.appendChild(dialogAuthor);
    bookDialog.appendChild(dialogPages);
    bookDialog.appendChild(dialogReadMessage);

    modalContainer.appendChild(bookDialog);

    newBook.addEventListener("click", () => {
      bookDialog.showModal();
      bookOpenSound.play();
    });

    bookDialog.addEventListener("close", () => {
      bookOpenSound.pause();
      bookOpenSound.currentTime = 0;
    });

    newBook.addEventListener("mouseenter", () => bookHoverSound.play());
    newBook.addEventListener("mouseleave", () => {
      bookHoverSound.pause();
      bookHoverSound.currentTime = 0;
    })

    newBook.appendChild(bookTitle);
    shelfRow.appendChild(newBook);
  });
}

const muteButton = document.querySelector(".button.mute");
muteButton.addEventListener("click", () => {
  muteButton.classList.toggle("on");
  document
    .querySelectorAll("audio")
    .forEach((sound) => (sound.muted = !sound.muted));
});

displayBooks();
