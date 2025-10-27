const myLibrary = new Array();

function Book(title, author, pages, isRead) {
  if (!new.target) throw Error("Call constructor with 'new' keyword");

  this.id = crypto.randomUUID();
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
    const bookTitle = document.createElement("div");

    newBook.classList.add("book");
    bookTitle.classList.add("book-title");

    book.title.split(" ").forEach((word) => {
      const bookTitleWord = document.createElement("span");
      bookTitleWord.classList.add("book-title-word");
      bookTitleWord.textContent = word;
      bookTitle.appendChild(bookTitleWord);
    });

    const bookCard = document.querySelector(".book-card");
    setCard(book, bookCard);

    newBook.addEventListener("click", () => {
      bookCard.showModal();
      bookOpenSound.play();
    });

    newBook.addEventListener("mouseenter", () => bookHoverSound.play());
    newBook.addEventListener("mouseleave", () => {
      bookHoverSound.pause();
      bookHoverSound.currentTime = 0;
    });

    newBook.appendChild(bookTitle);
    shelfRow.appendChild(newBook);
  });
}
document.querySelector("#card-title").focus();

function setCard(book, bookCard) {
  // view form
  const viewForm = document.querySelector(".book-card .view");
  const cardTitle = document.querySelector(".card-title");
  const cardAuthor = document.querySelector(".card-author");
  const cardPages = document.querySelector(".card-pages");
  const cardReadMessage = document.querySelector(".card-status");
  const editButton = document.querySelector(".button.edit");

  cardId = book.id;
  cardTitle.textContent = "Title: " + book.title;
  cardAuthor.textContent = "Written by " + book.author;
  cardPages.textContent = book.pages + " Pages";
  cardReadMessage.textContent = "Status: " + book.readMessage;

  bookCard.addEventListener("close", () => {
    bookOpenSound.pause();
    bookOpenSound.currentTime = 0;
  });

  // edit form
  const editForm = document.querySelector("form.edit");
  const newTitle = document.querySelector("#card-title");
  const newAuthor = document.querySelector("#card-author");
  const newPages = document.querySelector("#card-pages");
  const newStatus = document.querySelector("#card-status");
  const confirmButton = document.querySelector(".button.confirm");
  const cancelButton = document.querySelector(".button.cancel");

  newTitle.value = book.title;
  newAuthor.value = book.author;
  newPages.value = book.pages;
  newStatus.value = book.isRead;

  editButton.addEventListener("click", () => {
    viewForm.style.display = "none";
    editForm.style.display = "contents";

    newTitle.focus();
  });

  confirmButton.addEventListener("click", () => {
    viewForm.style.display = "contents";
    editForm.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    viewForm.style.display = "contents";
    editForm.style.display = "none";
  });
}

const muteButton = document.querySelector(".button.mute");
muteButton.addEventListener("click", () => {
  muteButton.classList.toggle("on");
  document
    .querySelectorAll("audio")
    .forEach((sound) => (sound.muted = !sound.muted));
});

const addBookButton = document.querySelector(".button.add-book");
const newBookCard = document.querySelector(".new-book-dialog");
addBookButton.addEventListener("click", () => {
  shelfRow.replaceChildren();
  addBookToLibrary("", "", "", "");
  displayBooks();
  const clickEvent = new Event("click");
  shelfRow.lastChild.dispatchEvent(clickEvent);
});

displayBooks();
