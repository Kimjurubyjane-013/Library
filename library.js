const library =[];
function Book(title, author,pages,read){
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
const addNewBook = document.getElementById("addBookBtn");
const bookList = document.getElementById("bookList");
addNewBook.addEventListener("click",()=>{
  bookList.style.display = "flex";
  document.querySelector(".actions").style.display = "flex";
})
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click",()=>{
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const pages = document.getElementById("pages").value;
  const read = document.getElementById("readStatus").checked;
  if(title === "" || author === ""){
    return;
  }
  const newBook = new Book(title,author,pages,read);
  library.push(newBook);
  displayBooks();
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("readStatus").checked = false;
  bookList.style.display = "none";
  document.querySelector(".actions").style.display = "none";
})
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click",()=>{
  document.getElementById("bookList").style.display = "none";
  document.querySelector(".actions").style.display = "none";
})
function displayBooks(){
  const bookDisplay = document.getElementById("bookDisplay");
  bookDisplay.innerHTML = "";
  library.forEach((book)=>{
    const card = document.createElement("div");
    card.classList.add("book-card");
    const title = document.createElement("h3");
    title.textContent = "Title: " + book.title;
    const author = document.createElement("p");
    author.textContent = "Author: " + book.author;
    const pages = document.createElement("p");
    pages.textContent = "Pages: " + book.pages;
    if(book.pages <= 0 || book.pages === ""){
      pages.textContent = "Pages: N/A";
    }
    const readStatus = document.createElement("p");
    readStatus.textContent = "Read: " + (book.read ? "Yes" : "No");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click",()=>{
      removeBook(book.id);
      displayBooks();
    })
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(readStatus);
    card.appendChild(removeBtn);
    bookDisplay.appendChild(card);
  });
}
function removeBook(id){
  const index = library.findIndex(book => book.id === id);
  if(index !== -1){
    library.splice(index,1);
  }
}