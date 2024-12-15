const fs = require('fs');
const path = require('path');

// Pfad zur Datei users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

// Benutzer registrieren
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich.' });
  }

  // Benutzer laden
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  // Prüfen, ob der Benutzer existiert
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Benutzername existiert bereits.' });
  }

  // Neuen Benutzer hinzufügen
  const newUser = { username, password };
  users.push(newUser);

  // Datei aktualisieren
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: 'Benutzer erfolgreich registriert.', user: newUser });
};

// Benutzer einloggen
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich.' });
  }

  // Benutzer laden
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  // Benutzer suchen
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    return res.status(200).json({ message: 'Login erfolgreich.', user });
  } else {
    return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort.' });
  }
};
