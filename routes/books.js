const express = require('express');
const {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviews,
  addOrUpdateReview,
  deleteReview,
  searchBookByISBN,
  searchBookByTitle // Neue Funktion importieren
} = require('../controllers/booksController');

const router = express.Router();

router.get('/', getAllBooks); // Task 1
router.get('/:isbn', getBookByISBN); // Task 2
router.get('/author/:author', getBooksByAuthor); // Task 3
router.get('/title/:title', getBooksByTitle); // Task 4
router.get('/:isbn/reviews', getBookReviews); // Task 5
router.post('/:isbn/reviews', addOrUpdateReview); // Task 8
router.delete('/:isbn/reviews', deleteReview); // Task 9
router.get('/search/isbn/:isbn', searchBookByISBN); // Task 11
router.get('/search/title/:title', searchBookByTitle); // Task 13

module.exports = router;
