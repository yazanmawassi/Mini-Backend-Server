const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const DATA_FILE = 'users.json';

// Hilfsfunktion: Datei lesen oder leeres Array zurückgeben
function loadUsers() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

// Hilfsfunktion: Benutzer in Datei schreiben
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// 📥 POST: Benutzer registrieren
app.post('/signup', (req, res) => {
  const { name, SurName, DateOfBirth, phone } = req.body;

  // Überprüfen, ob alle Felder da sind
  if (!name || !SurName || !DateOfBirth || !phone) {
    return res.status(400).send("❌ Bitte alle Felder ausfüllen.");
  }

  // Bestehende Benutzer laden
  const users = loadUsers();

  // Neuen Benutzer hinzufügen
  users.push(req.body);

  // Datei speichern
  saveUsers(users);

  res.send(`✅ Willkommen ${name}, deine Nummer ist ${phone}`);
});

// 📤 GET: Alle Benutzer anzeigen
app.get('/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// 🚀 Server starten
app.listen(3000, () => {
  console.log('✅ Server läuft auf http://localhost:3000');
});
