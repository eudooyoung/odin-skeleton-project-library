// common
const myLibrary = new Array();
const clickEvent = new Event("click");

function Book(title, author, pages, isRead) {
  if (!new.target) {
    throw Error("Call constructor with 'new' keyword");
  }

  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.setCard = function () {
  bookCard.dataset.id = this.id;

  cardTitle.textContent = "Title: " + this.title;
  cardAuthor.textContent = "Written by " + this.author;
  cardPages.textContent = "Page(s): " + this.pages;
  if (this.isRead) {
    cardReadMessage.textContent = "Status: Read";
  } else {
    cardReadMessage.textContent = "Status: Not read";
  }

  newTitle.value = this.title;
  newAuthor.value = this.author;
  newPages.value = this.pages;
  if (this.isRead) {
    statusRead.checked = true;
  } else {
    statusNotRead.checked = true;
  }
};

Book.prototype.update = function () {
  this.title = newTitle.value;
  this.author = newAuthor.value;
  this.pages = Number(newPages.value);
  this.isRead = statusRead.checked ? true : false;
};

Book.prototype.remove = function () {
  const index = myLibrary.indexOf(this);
  if (index || index === 0) {
    myLibrary.splice(index, 1);
  }
};

Book.prototype.removeIfEmpty = function () {
  if (!this.title && !this.author && !this.pages) {
    removeButton.dispatchEvent(clickEvent);
  }
};

function addBookToLibrary(title, author, pages, isRead) {
  const book = new Book(title, author, pages, isRead);

  myLibrary.push(book);
}

// sample
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 448, true);
addBookToLibrary("What is History?", "E.H. Carr", 100, false);

// sounds
const bookOpenSound = document.querySelector("#book-open-sound");
const bookHoverSound = document.querySelector("#book-hover-sound");

// modal
const modalContainer = document.querySelector(".modal-container");
const bookCard = document.querySelector(".book-card");

// modal-view
const viewForm = document.querySelector(" .view");
const cardTitle = document.querySelector(" .card-title");
const cardAuthor = document.querySelector(" .card-author");
const cardPages = document.querySelector(" .card-pages");
const cardReadMessage = document.querySelector(" .card-status");
const editButton = document.querySelector(" .button.edit");

// modal-edit
const editForm = document.querySelector(" form.edit");
const newTitle = document.querySelector("#card-title");
const newAuthor = document.querySelector("#card-author");
const newPages = document.querySelector("#card-pages");
const statusRead = document.querySelector("#read");
const statusNotRead = document.querySelector("#not-read");
const confirmButton = document.querySelector(" .button.confirm");
const cancelButton = document.querySelector(" .button.cancel");
const removeButton = document.querySelector(" .button.remove");

// shelf
const shelfRow = document.querySelector(".shelf-row");

// shelf-functions
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

    newBook.addEventListener("click", () => {
      book.setCard();
      bookCard.showModal();
      bookOpenSound.play();
    });

    newBook.addEventListener("mouseenter", () =>
      bookHoverSound.play().catch(() => {})
    );

    newBook.addEventListener("mouseleave", () => {
      bookHoverSound.pause();
      bookHoverSound.currentTime = 0;
    });

    newBook.appendChild(bookTitle);
    shelfRow.appendChild(newBook);
  });
}

function refreshShelf() {
  shelfRow.replaceChildren();
  displayBooks();
}

function getBookWithId(bookCard) {
  const bookId = bookCard.dataset.id;
  return myLibrary.filter((book) => book.id === bookId)[0];
}

// mute
const muteButton = document.querySelector(".button.mute");
muteButton.addEventListener("click", () => {
  muteButton.classList.toggle("on");
  document
    .querySelectorAll("audio")
    .forEach((sound) => (sound.muted = !sound.muted));
});

// add-book
const addBookButton = document.querySelector(".button.add-book");
addBookButton.addEventListener("click", () => {
  addBookToLibrary("", "", "", "");
  refreshShelf();
  shelfRow.lastChild.dispatchEvent(clickEvent);
  editButton.dispatchEvent(clickEvent);
});

// close-card
bookCard.addEventListener("close", () => {
  bookOpenSound.pause();
  bookOpenSound.currentTime = 0;

  viewForm.style.display = "contents";
  editForm.style.display = "none";

  const book = getBookWithId(bookCard);
  book.removeIfEmpty();
});

// edit-book
editButton.addEventListener("click", () => {
  viewForm.style.display = "none";
  editForm.style.display = "contents";

  newTitle.focus();
});

// edit-confirm
confirmButton.addEventListener("click", () => {
  const book = getBookWithId(bookCard);
  book.update();
  book.removeIfEmpty();

  refreshShelf();
  viewForm.style.display = "contents";
  editForm.style.display = "none";
  bookCard.close();
});

document.addEventListener("keydown", (e) => {
  if (editForm.style.display === "contents" && e.key === "Enter") {
    confirmButton.dispatchEvent(clickEvent);
  }
});

// edit-cancel
cancelButton.addEventListener("click", () => {
  viewForm.style.display = "contents";
  editForm.style.display = "none";

  const book = getBookWithId(bookCard);
  book.removeIfEmpty();
});

// remove
removeButton.addEventListener("click", () => {
  const book = getBookWithId(bookCard);
  book.remove();

  refreshShelf();
  bookCard.close();
});

displayBooks();
