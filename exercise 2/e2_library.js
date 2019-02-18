/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/

// enhancements code other than typecasting
const deleteBook = document.querySelector("#bookTable");
const deletePatron = document.querySelector("#patronDeleteForm");
deleteBook.addEventListener("click", deleteLibraryBook);
deletePatron.addEventListener("submit", deletePatronFunc);

// lets you delete library books from the repository
function deleteLibraryBook(e){
	e.preventDefault();
	let target = e.target;
	let deleteId = target.parentElement.parentElement.children[0].innerHTML.trim();

	for (let i = 0; i < libraryBooks.length; i++) {
		if (libraryBooks[i].bookId == deleteId) {

			let possible = document.getElementById("bookTable").children[0].children;
			for (let j = 1; j < possible.length; j++){
				let el = possible[j];
				if (el.children[0].innerHTML.trim() == deleteId){
					el.parentNode.removeChild(el);
					break
				}
			}

			deleteBorrowedBook(libraryBooks[i]);
			deleteBookInfo(deleteId);
			libraryBooks.splice(libraryBooks.indexOf(libraryBooks[i]), 1);

			break
		}
	}
}

// delete a book from a user's borrowed books if the book is deleted from the library's repo
function deleteBorrowedBook(book){
	if (!book.patron){
		return
	}
	let possible = document.getElementById("patrons").children;
	for (let i = 0; i < possible.length; i++){
		if (possible[i].children[0].children[0].innerHTML == (book.patron.name)){
			let books = possible[i].children[3].children[0].children
			for (j = 1; j < books.length; j++){
				let el = books[j]
				if (el.children[0].innerHTML.trim() == book.bookId){
					el.parentNode.removeChild(el);
					break
				}
			}
			break
		}
	}
}

//removes the info from the book info section if the book is the one deleted
function deleteBookInfo(deleteId){
	let id = document.getElementById("bookInfo").children[0].children[0].innerHTML;
	if (id == deleteId){
		document.getElementById("bookInfo").innerHTML = '';
	}
	return
}

//check for a book being in our LibraryBooks(can't use indexing since we can delete)
function checkBookInLibrary(id){
	// book in libraryboooks
	for (let i = 0; i < libraryBooks.length; i++){
		if (libraryBooks[i].bookId == id){
			return true
		}
	}
	return false
}

function deletePatronFunc(e) {
	e.preventDefault();
	let cardNumber = document.getElementById("deleteName").value;
	if (isNaN(cardNumber)){
		alert("Please enter a number!")
		return
	} else {
		if (checkPatronExists(cardNumber)){
			let patronss = document.getElementById("patrons").children;
			let returnedBooks = [];
			for (let i = 0; i < patronss.length; i++) {
				if (patronss[i].children[1].children[0].innerHTML.trim() == cardNumber){
					for (let j = 1; j < patronss[i].children[3].children[0].children.length; j++ ){
						returnedBooks.push(patronss[i].children[3].children[0].children[j].children[0].innerHTML.trim());
					}
					for (let k = 0; k< returnedBooks.length; k++){
						let bookId = returnedBooks[k];
						for (let i = 0; i < libraryBooks.length; i++){
							if (libraryBooks[i].bookId == parseInt(bookId)){
								let book = libraryBooks[i];
								removeBookFromPatronTable(book);
					
								// Change the book object to have a patron of 'null'
								book.patron = null;
								let id = document.getElementById("bookInfo").children[0].children[0].innerHTML;
								if (id == parseInt(bookId)) {
									displayBookInfo(book);
								}
								break
							}
						}
					}
					for (let p = 0; p < patrons.length; p++){
						if (patrons[p].cardNumber == cardNumber){
							patrons.splice(p, 1);
							break
						}
					}
					let el = patronss[i];
					el.parentNode.removeChild(el);
					console.log(patrons)
					return
				}
			}
		} else {
			alert("Card does not exist!")
			return
		}
	}
}

function checkPatronExists(cardNumber){
	for (let i = 0; i < patrons.length; i++){
		if (patrons[i].cardNumber == cardNumber){
			return true
		}
	}
	return false
}


//enhancements
/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()




function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	let newBookGenre = document.getElementById("newBookGenre").value;
	let newBookName =  document.getElementById("newBookName").value;
	let newBookAuthor =  document.getElementById("newBookAuthor").value;
	// Call addBookToLibraryTable properly to add book to the DOM
	let newBook = new Book(newBookName, newBookAuthor, newBookGenre);
	libraryBooks.push(newBook);
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	let id = document.getElementById("loanBookId").value;
	let card = document.getElementById("loanCardNum").value;
	let currBook = '';
	let currPatron = '';
	if (isNaN(id)){
		alert("Book IDs must be numbers!")
		return
	}
	if (checkBookInLibrary(id)) {
		for (let i = 0; i < libraryBooks.length; i++){
			if (libraryBooks[i].bookId == id){
				currBook = libraryBooks[i];
				if (currBook.patron != null){
					alert("This book is already checked out!")
					return
				}
				break
			}
		}
		
	} else {
		alert("This book doesn't exist in our system!")
		return
	}
	if (isNaN(card)) {
		alert("Card numbers must be numbers!")
		return
	}
	if (checkPatronExists(card)) {
		for (let i = 0; i < patrons.length; i++){
			if (patrons[i].cardNumber == card){
				currPatron = patrons[i];
				break
			}
		}
	} else {
		alert("This card doesn't belong to anyone in the system!")
		return
	}

	// Add patron to the book's patron property
	currBook.patron = currPatron;

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(currBook)

	// Start the book loan timer.
	currBook.setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	let target = e.target;
	let bookId = target.parentElement.parentElement.children[0].innerHTML;
	for (let i = 0; i < libraryBooks.length; i++){
		if (libraryBooks[i].bookId == parseInt(bookId)){
			let book = libraryBooks[i];
			removeBookFromPatronTable(book);

			// Change the book object to have a patron of 'null'
			book.patron = null;
			let id = document.getElementById("bookInfo").children[0].children[0].innerHTML;
			if (id == parseInt(bookId)) {
				displayBookInfo(book);
			}
			return
		}
	}
	

	// Call removeBookFromPatronTable()
	
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	let patronName = document.getElementById("newPatronName").value;
	let patron = new Patron(patronName);
	patrons.push(patron);
	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book

	// Call displayBookInfo()	
	let id = document.getElementById("bookInfoId").value
	if (isNaN(id)){
		alert("Book IDs must be numbers.")
		return
	}
	if (checkBookInLibrary(id)) {
		for (let i = 0; i < libraryBooks.length; i++){
			if (libraryBooks[i].bookId == id){
				displayBookInfo(libraryBooks[i]);
			}
		}
		
	}
	else {
		alert("This ID doesn't belong to any book in our system!")
	}
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	let tableRef = document.getElementById("bookTable").getElementsByTagName('tbody')[0];
	// kinda clunky
	let id = "<td>" + book.bookId.toString() + "</td>";
	let title = "<td><strong>" + book.title + "<strong></td>";
	//todo
	let cardNumber = "<td></td>";
	let remove  = "<td><button class = 'remove'> Delete Book </button></td>";

	tableRef.insertRow(tableRef.rows.length).innerHTML = "<tr>"+ id + title + cardNumber + remove+"</tr>";
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	let section = document.getElementById("bookInfo");
	let id = "<p>Book Id: <span>" + book.bookId + "</span>";
	let title = "<p>Title: <span>" + book.title + "</span>";
	let author = "<p>Author: <span>" + book.author + "</span>";
	let genre = "<p>Genre: <span>" + book.genre + "</span>";
	let loaned = "<p>Currently loaned out to: <span>" + (book.patron ? book.patron.name : "N/A")  + "</span>";
	section.innerHTML = id + title + author + genre + loaned;
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	let tableRef = '';
	let possible = document.getElementById("patrons").children;
	for (let i = 0; i < possible.length; i++){
		if (possible[i].children[1].children[0].innerHTML == book.patron.cardNumber){

			tableRef = possible[i].children[3].getElementsByTagName('tbody')[0];
			break
		}
	}
	if (!tableRef) {
		return
	}
	let id = "<td>" + book.bookId + "</td>";
	let title = "<td><strong>" + book.title + "</strong></td>";
	let status = "<td><span class = 'green'>Within due date</span></td>"
	let returns = "<td><button class='return'>return</button></td>";
	let content = id + title + status + returns;
	tableRef.insertRow(tableRef.rows.length).innerHTML = "<tr>"+content+"</tr>";

	let tableTop = document.getElementById("bookTable");
	let books = tableTop.children[0].children;
	for (let i = 0; i < books.length; i++){
		if (parseInt(books[i].children[0].innerHTML.trim()) == book.bookId ){
			books[i].children[2].innerHTML =  book.patron.cardNumber;
			break
		}
	}
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	let patronName = patron.name;
	let cardNumber = patron.cardNumber;
	let content = document.createElement('div')
	content.setAttribute("class", "patron")
	let contentInner = "<p>Name: <span>"+ patronName +"</span></p>\
	<p>Card Number: <span>"+cardNumber+"</span>\
		</p><h4>Books on loan:</h4> \
	 		<table class='patronLoansTable'> \
	 			<tbody> \
			 		<tr>\
			 			<th>\
			 				BookID\
			 			</th>\
			 			<th>\
			 				Title\
			 			</th>\
			 			<th>	\
			 				Status\
			 			</th>	\
			 			<th>	\
			 				Return\
			 			</th>\
			 		</tr>\
		 		</tbody>\
			 </table>";
	content.innerHTML = contentInner;
	document.getElementById("patrons").appendChild(content);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {

	// remove the book from the patrons
	let possible = document.getElementById("patrons").children;
	for (let i = 0; i < possible.length; i++){
		if (possible[i].children[1].children[0].innerHTML == book.patron.cardNumber){
			let books = possible[i].children[3].children[0].children
			for (j = 1; j < books.length; j++){
				let el = books[j]
				if (el.children[0].innerHTML == book.bookId){
					el.parentNode.removeChild(el);
				}
			}
		}
	}

	//search for which book to remove the patron from in the top table
	let tableTop = document.getElementById("bookTable");
	let books = tableTop.children[0].children;
	for (let i = 0; i < books.length; i++){
		if (parseInt(books[i].children[0].innerHTML.trim()) == book.bookId ){
			books[i].children[2].innerHTML =  '';
			break
		}
	}
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	let possible = document.getElementById("patrons").children;
	for (let i = 0; i < possible.length; i++){
		if (possible[i].children[1].children[0].innerHTML == book.patron.cardNumber){
			let books = possible[i].children[3].children[0].children
			for (j = 1; j < books.length; j++){
				if (books[j].children[0].innerHTML == book.bookId){
					books[j].children[2].innerHTML = "<span class='red'>Overdue</span>"
					break
				}
			}
		}
	}
}


