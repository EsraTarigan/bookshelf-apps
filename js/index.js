const storageKey = "STORAGE_KEY";

document.addEventListener('DOMContentLoaded', function(){
  const logoutButton = document.getElementById('logout-button');

  logoutButton.addEventListener('click', function(){
    logoutUser();
    window.location.href = 'login.html';
  });
});

const addNewBook = document.getElementById("inputBook");
const searchingBook = document.getElementById("searchBook");
// cek web storage apakah tersedia atau tidak
function isStorageExist() {
  if(typeof (Storage) === undefined){
    alert('Browser anda tidak mendukung web local storage');
    return false;
  }
  return true;
}

function logoutUser(){
  sessionStorage.removeItem('userSession');
};


// menambah buku berdasarkan Id, serta membuat object untuk ketentuan buku
addNewBook.addEventListener("submit", function () {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  if (idTemp !== "") {
    const bookData = getBookshelf();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    // setItem di web storage denga mengubah objek js menjadi teks JSON kedalam bentuk string
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    renderBookshelf(bookData);
    return;
  }

//   generate id buku yang akan ditambah dan membuat objek newBook
  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = getBookshelf();
  renderBookshelf(bookData);
});

function PutBookList(data) {
  if (isStorageExist()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function renderBookshelf(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    //isi objek buku di rak
    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    //tempat menampung data buku kita perlu buat div
    let elementBookObject = document.createElement("div");
    elementBookObject.classList.add("action");

    //event tombol hijau list buku
    const greenButton = CreateGreenButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = getBookshelf();
      ResetAllForm();
      renderBookshelf(bookData);
    });

    //event tombol merah list buku
    const redButton = CreateRedButton(function (event) {
      DeleteAnItem(event.target.parentElement.parentElement);

      const bookData = getBookshelf();
      ResetAllForm();
      renderBookshelf(bookData);
    });

    elementBookObject.append(greenButton, redButton);

    bookItem.append(elementBookObject);

    //belum selesai dibaca
    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });

      continue;
    }

    //selesai dibaca
    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}

// membuat tombol di list buku 
function CreateGreenButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = isSelesai + " di Baca";
  greenButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return greenButton;
}

// fungsi tombol merah
function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return redButton;
}

// checklist buku 
function isCompleteBookHandler(itemElement) {
  const bookData = getBookshelf();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

// fungsi untuk fitur pencarian buku
function SearchBookList(title) {
  const bookData = getBookshelf();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function GreenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

// fungsi utnuk mengambil list buku
function getBookshelf() {
  if (isStorageExist) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

// fungsi untuk hapus buku di rak
function DeleteAnItem(itemElement) {
  const bookData = getBookshelf();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

// update list buku selesai baca atau belum selesai dibaca
function UpdateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = getBookshelf();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

// event fitur pencarian buku
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = getBookshelf();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    renderBookshelf(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  renderBookshelf(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

// load data/ render semua list buku yang tersimpan di webStorage 
window.addEventListener("load", function () {
  if (isStorageExist) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = getBookshelf();
      renderBookshelf(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});