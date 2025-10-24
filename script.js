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
    const bookTitle = document.createElement("div");

    newBook.classList.add("book");
    bookTitle.classList.add("book-title");

    book.title.split(" ").forEach((word) => {
      const bookTitleWord = document.createElement("span");
      bookTitleWord.classList.add("book-title-word");
      bookTitleWord.textContent = word;
      bookTitle.appendChild(bookTitleWord);
    });

    const bookCard = createCard(book);

    setEventListener(newBook, bookCard);

    newBook.appendChild(bookTitle);
    shelfRow.appendChild(newBook);
  });
}

function createCard(book) {
  const bookCard = document.createElement("dialog");
  const cardTitle = document.createElement("h2");
  const cardAuthor = document.createElement("p");
  const cardPages = document.createElement("p");
  const cardReadMessage = document.createElement("p");
  const buttonContainer = document.createElement("div");
  const editButton = document.createElement("div");
  const removeButton = document.createElement("div");

  bookCard.classList.add("book-card");
  bookCard.setAttribute("closedby", "any");
  cardTitle.textContent = "Title: " + book.title;
  cardAuthor.textContent = "Written by " + book.author;
  cardPages.textContent = book.pages + " Pages";
  cardReadMessage.textContent = "Status: " + book.readMessage;
  buttonContainer.classList.add("button-container");
  editButton.classList.add("button", "edit");
  removeButton.classList.add("button", "remove");

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(removeButton);

  bookCard.appendChild(cardTitle);
  bookCard.appendChild(cardAuthor);
  bookCard.appendChild(cardPages);
  bookCard.appendChild(cardReadMessage);
  bookCard.appendChild(buttonContainer);

  modalContainer.appendChild(bookCard);

  return bookCard;
}

function setEventListener(book, card) {
  book.addEventListener("click", () => {
    card.showModal();
    bookOpenSound.play();
  });

  card.addEventListener("close", () => {
    bookOpenSound.pause();
    bookOpenSound.currentTime = 0;
  });

  book.addEventListener("mouseenter", () => bookHoverSound.play());
  book.addEventListener("mouseleave", () => {
    bookHoverSound.pause();
    bookHoverSound.currentTime = 0;
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
