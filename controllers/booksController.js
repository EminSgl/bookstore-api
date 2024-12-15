const fs = require('fs');
const path = require('path');

// Bücher aus der JSON-Datei laden
const booksFilePath = path.join(__dirname, '../data/books.json');
let books = JSON.parse(fs.readFileSync(booksFilePath, 'utf8'));

// Alle Bücher abrufen
exports.getAllBooks = (req, res) => {
  res.json(books);
};

// Buch basierend auf ISBN abrufen
exports.getBookByISBN = (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  book ? res.json(book) : res.status(404).send('Buch nicht gefunden');
};

// Bücher nach Autor suchen
exports.getBooksByAuthor = (req, res) => {
  const authorBooks = books.filter((b) => b.author === req.params.author);
  res.json(authorBooks);
};

// Bücher nach Titel suchen
exports.getBooksByTitle = (req, res) => {
  const titleBooks = books.filter((b) =>
    b.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  res.json(titleBooks);
};

// Rezensionen eines Buchs abrufen
exports.getBookReviews = (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (book) {
    res.json({ reviews: book.reviews });
  } else {
    res.status(404).send('Buch nicht gefunden');
  }
};

// Rezension hinzufügen oder aktualisieren
exports.addOrUpdateReview = (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ error: 'Benutzername und Rezension sind erforderlich.' });
  }

  const book = books.find((b) => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ error: 'Buch nicht gefunden.' });
  }

  const existingReview = book.reviews.find((r) => r.username === username);
  if (existingReview) {
    existingReview.review = review; // Rezension aktualisieren
    res.status(200).json({ message: 'Rezension aktualisiert.', book });
  } else {
    book.reviews.push({ username, review }); // Neue Rezension hinzufügen
    res.status(201).json({ message: 'Rezension hinzugefügt.', book });
  }

  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
};

// Rezension löschen
exports.deleteReview = (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.body;

  const book = books.find((b) => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ error: 'Buch nicht gefunden.' });
  }

  const reviewIndex = book.reviews.findIndex((r) => r.username === username);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: 'Rezension nicht gefunden.' });
  }

  book.reviews.splice(reviewIndex, 1);
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
  res.status(200).json({ message: 'Rezension gelöscht.', book });
};

// Suche nach ISBN - mit Promises
exports.searchBookByISBN = (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books.find((b) => b.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject('Kein Buch mit dieser ISBN gefunden.');
    }
  })
    .then((result) => {
      res.status(200).json({ book: result });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Suche nach Titel - mit Promises
exports.searchBookByTitle = (req, res) => {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const matchedBooks = books.filter((b) => b.title.toLowerCase().includes(title));
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject('Keine Bücher mit diesem Titel gefunden.');
    }
  })
    .then((result) => {
      res.status(200).json({ books: result });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
