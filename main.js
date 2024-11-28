document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById('bookForm');
  const searchBookForm = document.getElementById('searchBook');
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  const loadBooks = (searchQuery = '') => {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    books
      .filter(book => book.judul_buku.toLowerCase().includes(searchQuery.toLowerCase()))
      .forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
  };
  const saveBooks = (books) => {
    localStorage.setItem('books', JSON.stringify(books));
  };
  const createBookElement = (book) => {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.ID_buku);
    bookItem.setAttribute('data-testid', 'bookItem');
    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.textContent = book.judul_buku;
    bookItem.appendChild(bookTitle);
    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.textContent = `Penulis: ${book.penulis_buku}`;
    bookItem.appendChild(bookAuthor);
    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.textContent = `Tahun: ${book.tahun_rilis_buku}`;
    bookItem.appendChild(bookYear);
    const buttonContainer = document.createElement('div');
    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    completeButton.addEventListener('click', () => {
      book.isComplete = !book.isComplete;
      const books = getBooks();
      const updatedBooks = books.map(b => b.ID_buku === book.ID_buku ? book : b);
      saveBooks(updatedBooks);
      loadBooks();
    });
    buttonContainer.appendChild(completeButton);
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.addEventListener('click', () => {
      const books = getBooks();
      const updatedBooks = books.filter(b => b.ID_buku !== book.ID_buku);
      saveBooks(updatedBooks);
      loadBooks();
    });
    buttonContainer.appendChild(deleteButton);
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.textContent = 'Edit Buku';
    editButton.addEventListener('click', () => {
      showEditForm(book);
    });
    buttonContainer.appendChild(editButton);
    bookItem.appendChild(buttonContainer);
    return bookItem;
  };
  const getBooks = () => {
    return JSON.parse(localStorage.getItem('books')) || [];
  };
  const showEditForm = (book) => {
    const editForm = document.createElement('form');
    editForm.setAttribute('data-testid', 'editBookForm');
    editForm.innerHTML = `
      <div>
        <label for="editBookTitle">Judul</label>
        <input id="editBookTitle" type="text" required value="${book.judul_buku}" />
      </div>
      <div>
        <label for="editBookAuthor">Penulis</label>
        <input id="editBookAuthor" type="text" required value="${book.penulis_buku}" />
      </div>
      <div>
        <label for="editBookYear">Tahun</label>
        <input id="editBookYear" type="number" required value="${book.tahun_rilis_buku}" />
      </div>
      <button type="submit">Simpan Perubahan</button>
      <button type="button" id="cancelEdit">Batal</button>
    `;
    document.body.appendChild(editForm);
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      book.judul_buku = editForm.querySelector('#editBookTitle').value;
      book.penulis_buku = editForm.querySelector('#editBookAuthor').value;
      book.tahun_rilis_buku = editForm.querySelector('#editBookYear').value;
      const books = getBooks();
      const updatedBooks = books.map(b => b.ID_buku === book.ID_buku ? book : b);
      saveBooks(updatedBooks);
      loadBooks();
      document.body.removeChild(editForm);
    });
    document.getElementById('cancelEdit').addEventListener('click', () => {
      document.body.removeChild(editForm);
    });
  };
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookTitleInput = document.getElementById('bookFormTitle');
    const bookAuthorInput = document.getElementById('bookFormAuthor');
    const bookYearInput = document.getElementById('bookFormYear');
    const bookIsCompleteInput = document.getElementById('bookFormIsComplete');
    const newBook = {
      Id: Date.now().toString(),
      Title: bookTitleInput.value,
      Author: bookAuthorInput.value,
      Year: parseInt(bookYearInput.value),
      IsComplete: bookIsCompleteInput.checked
    };
    const books = getBooks();
    books.push(newBook);
    saveBooks(books);
    loadBooks();
    bookForm.reset();
  });
  searchBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchBookTitleInput = document.getElementById('searchBookTitle');
    const searchQuery = searchBookTitleInput.value.trim();
    loadBooks(searchQuery);
  });
  loadBooks();
});
let buku = { 
  ID_buku: "123", 
  judul_buku: "Belajar JavaScript", 
  penulis_buku: "John Doe", 
  tahun_rilis_buku: "2021" 
};
