const express = require('express');
const app = express();

const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');

// Middleware
app.use(express.json());

// Routen einbinden
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
