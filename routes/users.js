const express = require('express');
const { registerUser, loginUser } = require('../controllers/usersController'); // Importiere die Controller-Funktionen

const router = express.Router();

// Route für die Benutzerregistrierung
router.post('/register', registerUser);

// Route für den Benutzerlogin
router.post('/login', loginUser);

module.exports = router;
