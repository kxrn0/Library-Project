import { fit_image } from "./utilities.js";
import { generate_cover } from "./generative_utilities.js";

let bookID;
let bookshelf;
let cover;
const inputCover = document.getElementById("entry-butt-cover");
const entryCover = document.querySelector(".entry-cover");
const inputWrapper = document.querySelector(".input-wrapper");
const addBook = document.querySelector(".add-book");
const create = document.querySelector(".create");
const cancel = document.querySelector(".cancel");
const entryButt = document.querySelector(".entry-butt");
const changeCover = document.querySelector(".change-cover");
const reading = document.getElementById("reading-count");
const completed = document.getElementById("completed-count");
const hodl = document.getElementById("on-hold");
const total = document.getElementById("total");

inputCover.addEventListener("change", () => {
    let imgCover, promise;

    imgCover = new Image();
    promise = fit_image(URL.createObjectURL(inputCover.files[0]));
    promise.then(value => {
        cover = value;
        imgCover.src = cover;
    });
    inputWrapper.style.display = "none";
    entryCover.appendChild(imgCover);
    changeCover.classList.remove("hidden");
});

addBook.addEventListener("click", () => {
    document.querySelector(".create-entry").style.display = "block";

    const buttons = document.querySelector(".entry-buttons");
    const edit = buttons.querySelector(".edit");
    const create = buttons.querySelector(".create");

    edit.classList.add("hidden");
    create.classList.remove("hidden");
});

create.addEventListener("click", () => {
    let title, author, pages, status;
    let choices = [...document.querySelectorAll(".entry-status .choice")];
    let newBook;

    title = document.getElementById("entry-title").value;
    author = document.getElementById("entry-author").value;
    pages = document.getElementById("entry-pages").value;
    status = choices.filter(choice => choice.checked)[0];

    if (!title || !author || !pages || !status) {
        if (!title)
            show_warning("title-warning");
        if (!author)
            show_warning("author-warning");
        if (!pages)
            show_warning("pages-warning");
        if (!status)
            show_warning("butt-warning");
    }
    else {
        if (!cover) {
            cover = generate_cover();
        }
        newBook = new Book(title, author, pages, status.value, cover, bookID);
        bookshelf.push(newBook);
        localStorage.setItem("_bookshelf_", JSON.stringify(bookshelf));
        localStorage.setItem("_book_id_", bookID);
        add_book(newBook);
        close_modal();
        bookID++;
    }
});

cancel.addEventListener("click", close_modal);

entryButt.addEventListener("click", () => {
    const entryStatus = document.querySelector(".entry-status");
    const choicesMenu = entryStatus.querySelector(".status-choices");
    const choices = entryStatus.querySelectorAll(".choice");

    if (choicesMenu.classList.contains("inactive")) {
        choicesMenu.classList.remove("inactive");
        choicesMenu.classList.add("active");

        entryButt.innerText = entryButt.innerText.slice(0, entryButt.innerText.length - 1) + " ☟";
    }

    choices.forEach(choice => choice.addEventListener("click", () => {
        entryButt.innerText = choice.value + " ☞";

        choicesMenu.classList.remove("active");
        choicesMenu.classList.add("inactive");

        if (choice.value == "Completed")
            entryButt.style.background = "#99df2e";
        else if (choice.value == "Reading")
            entryButt.style.background = "#d7c129";
        else if (choice.value == "Plan to Read")
            entryButt.style.background = "#19b1f9";
    }));
});

changeCover.addEventListener("click", () => {
    reset_input_cover();
});

function update_count() {
    let  completedCount, readingCount, hodlCount, totalCount;

    totalCount = bookshelf.length;
    completedCount = bookshelf.reduce((count, book) => count += book.status == "Completed" ? 1 : 0, 0);
    readingCount = bookshelf.reduce((count, book) => count += book.status == "Reading" ? 1 : 0, 0);
    hodlCount = bookshelf.reduce((count, book) => count += book.status == "Plan to Read" ? 1 : 0, 0);
    completed.innerText = completedCount;
    reading.innerText = readingCount;
    hodl.innerText = hodlCount;
    total.innerText = totalCount;
}

function add_status(book) {
    const butt = book.querySelector(".status-butt");
    const choicesMenu = book.querySelector(".status-choices");
    const choices = book.querySelectorAll(".choice");

    choices.forEach(choice => choice.addEventListener("click", () => {
        let bookData = book_data(book);
        butt.innerText = choice.value + " ☞";

        choicesMenu.classList.remove("active");
        choicesMenu.classList.add("inactive");

        if (choice.value == "Completed")
            butt.style.background = "#99df2e";
        else if (choice.value == "Reading")
            butt.style.background = "#d7c129";
        else if (choice.value == "Plan to Read")
            butt.style.background = "#19b1f9";

        bookData.status = choice.value;
        localStorage.setItem("_bookshelf_", JSON.stringify(bookshelf));
    }));

    butt.addEventListener("click", () => {
        if (choicesMenu.classList.contains("inactive")) {
            choicesMenu.classList.remove("inactive");
            choicesMenu.classList.add("active");

            butt.innerText = butt.innerText.slice(0, butt.innerText.length - 1) + " ☟";
        }
    });
}

function add_book(newBook) {
    const books = document.querySelector(".books");
    let book = document.createElement("div");

    book.innerHTML = `<div>
        <img src="${newBook.cover}" alt="book cover">
    </div>
    <div class="book-info">
        <p>Title : <span class="book-title">${newBook.title}</span></p>
        <p>Author : <span class="author">${newBook.author}</span></p>
        <p>Pages : <span class="pages">${newBook.pages}</span></p>
        <div class="status">
            <button class="status-butt">${newBook.status} ☞</button>                        
            <div class="status-choices inactive">
                <div id="choice-completed">
                    <input type="radio" id="completed-${newBook.id}" name="status-${newBook.id}" value="Completed" class="choice">
                    <label for="completed-${newBook.id}">Completed</label>
                </div>
                <div id="choice-reading">
                    <input type="radio" id="reading-${newBook.id}" name="status-${newBook.id}" value="Reading" class="choice">
                    <label for="reading-${newBook.id}">Reading</label>
                </div>
                <div id="choice-plan-to-read">
                    <input type="radio" id="plan-to-read-${newBook.id}" name="status-${newBook.id}" value="Plan to Read" class="choice">
                    <label for="plan-to-read-${newBook.id}">Plan to Read</label>
                </div>
            </div>
        </div>
        <div class="change id${newBook.id}">
            <button class="edit">E</button>
            <button class="remove">R</button>
        </div>
    </div>`;
    book.classList.add("book");

    let choices, butt;

    choices = book.querySelectorAll(".choice");
    choices.forEach(choice => {
        choice.addEventListener("change", update_count);
        if (choice.value == newBook.status)
            choice.checked = true;
    });

    butt = book.querySelector(".status-butt");
    for (let choice of choices) {
        if (choice.checked) {
            if (choice.value == "Completed")
                butt.style.background = "#99df2e";
            else if (choice.value == "Reading")
                butt.style.background = "#d7c129";
            else if (choice.value == "Plan to Read")
                butt.style.background = "#19b1f9";

            break;
        }
    }

    book.querySelector(".remove").addEventListener("click", () => remove(book));
    book.querySelector(".edit").addEventListener("click", () => edit(book));
    add_status(book);
    books.appendChild(book);
    update_count();
}

function book_data(book) {
    for (let i = 0; i < bookshelf.length; i++) {
        let idElem = book.querySelector(".change");

        if (idElem.classList.contains(`id${bookshelf[i].id}`))
            return bookshelf[i];
    }
}

function remove(book) {
    const books = document.querySelector(".books");
    for (let i = 0; i < bookshelf.length; i++) {
        let idElement = book.querySelector(".change");
        if (idElement.classList.contains(`id${bookshelf[i].id}`)) {
            bookshelf = bookshelf.slice(0, i).concat(bookshelf.slice(i + 1));
            localStorage.setItem("_bookshelf_", JSON.stringify(bookshelf));
            break;
        }
    }

    update_count();

    books.removeChild(book);
}

function edit(book) {
    let bookData, imgCover;
    const entry = document.querySelector(".create-entry");
    const oldChange = entry.querySelector(".edit");
    const change = oldChange.cloneNode(true);
    const create = entry.querySelector(".create");
    oldChange.parentNode.replaceChild(change, oldChange);

    change.classList.remove("hidden");
    create.classList.add("hidden");

    entry.style.display = "block";
    bookData = book_data(book);

    entry.querySelector("#entry-title").value = bookData.title;
    entry.querySelector("#entry-author").value = bookData.author;
    entry.querySelector("#entry-pages").value = bookData.pages;

    let choices = entry.querySelectorAll(".choice");
    choices.forEach(choice => {
        if (choice.value == bookData.status)
            choice.checked = true;
    });

    let butt = entry.querySelector(".status-butt");
    butt.innerText = `${bookData.status} ☞`;

    for (let choice of choices) {
        if (choice.checked) {
            if (choice.value == "Completed")
                butt.style.background = "#99df2e";
            else if (choice.value == "Reading")
                butt.style.background = "#d7c129";
            else if (choice.value == "Plan to Read")
                butt.style.background = "#19b1f9";
            break;
        }
    }

    imgCover = new Image();
    imgCover.src = bookData.cover;
    inputWrapper.style.display = "none";
    entryCover.appendChild(imgCover);
    changeCover.classList.remove("hidden");

    change.addEventListener("click", () => {
        let newTitle, newAuthor, newPages, newCover;

        newTitle = entry.querySelector("#entry-title").value;
        newAuthor = entry.querySelector("#entry-author").value;
        newPages = entry.querySelector("#entry-pages").value;
        newCover = entry.querySelector("img");

        if (!newCover)
            newCover = generate_cover();
        else
            newCover = newCover.src;

        book.querySelector(".book-title").innerText = newTitle;
        book.querySelector(".author").innerText = newAuthor;
        book.querySelector(".pages").innerText = newPages;
        book.querySelector("img").src = newCover;

        bookData.title = newTitle;
        bookData.author = newAuthor;
        bookData.pages = newPages;
        bookData.cover = newCover;

        const entryStatus = document.querySelector(".entry-status");
        const entryChoices = entryStatus.querySelectorAll(".choice");
        entryChoices.forEach(entryChoice => {
            if (entryChoice.checked) {
                let button, choices;
                
                button = book.querySelector(".status-butt");
                bookData.status = entryChoice.value;
                button.innerText = `${bookData.status} ☞`;

                choices = book.querySelectorAll(".choice");
                choices.forEach(choice => {
                    if (choice.value == bookData.status)
                        choice.checked = true;
                });

                if (entryChoice.value == "Completed")
                    button.style.background = "#99df2e";
                else if (entryChoice.value == "Reading")
                    button.style.background = "#d7c129";
                else if (entryChoice.value == "Plan to Read")
                    button.style.background = "#19b1f9";
            }
        });

        localStorage.setItem("_bookshelf_", JSON.stringify(bookshelf));

        close_modal();
    });
}

function show_warning(id) {
    let warning = document.getElementById(id);

    warning.classList.remove("hidden");
    warning.classList.add("shown");

    setTimeout(() => {
        warning.classList.remove("shown");
        warning.classList.add("hidden");
    }, 5000);
}

function reset_input_cover() {
    let image = document.querySelector(".entry-cover img");
    inputWrapper.style.display = "block";
    if (image)
        entryCover.removeChild(image);
    cover = '';
    changeCover.classList.add("hidden");
}

function close_modal() {
    document.querySelector(".create-entry").style.display = "none"
    document.getElementById("entry-title").value = '';
    document.getElementById("entry-author").value = '';
    document.getElementById("entry-pages").value = '';

    document.getElementById("completed").checked = false;
    document.getElementById("reading").checked = false;
    document.getElementById("plan-to-read").checked = false;

    document.querySelector(".entry-butt").innerText = "Status ☞";
    document.querySelector(".entry-butt").style.background = "rgb(222, 231, 223)";

    reset_input_cover();
}

function init() {
    let idData, shelfData;

    idData = parseInt(localStorage.getItem("_book_id_"));
    shelfData = localStorage.getItem("_bookshelf_");

    if (idData)
        bookID = parseInt(idData) + 1;
    else
        bookID = 0;

    if (shelfData)
        bookshelf = JSON.parse(shelfData);
    else
        bookshelf = [];

    for (let i = 0; i < bookshelf.length; i++)
        add_book(new Book(bookshelf[i].title, bookshelf[i].author, bookshelf[i].pages, bookshelf[i].status, bookshelf[i].cover, bookshelf[i].id));
}
class Book {
    constructor(title, author, pages, status, cover, id) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.cover = cover;
        this.id = id;
    }
}

init();