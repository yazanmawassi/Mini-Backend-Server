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

//  POST: Benutzer Login 
app.post('/login',(req, res) =>{
  const { phone } = req.body;  
  if (!phone) {
    return res.status(400).send("❌ Telefonnummer fehlt.");
  }
  let users = loadUsers();
  // Nutzer suchen
  const userIndex = users.findIndex(u => u.phone === phone);
  if (userIndex === -1) {
    return res.status(404).send("❌ Diese Telefonnummer ist nicht registriert.");
  }

  // Code generieren (6-stellig)
  const code = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 Minuten in ms
  // Code speichern (temporär)
  users[userIndex].loginCode = code;

  // code time speichern
  users[userIndex].expiresAt = expiresAt;    

  // In Datei speichern
  saveUsers(users);
  
  // Code zurückgeben (später: per SMS oder E-Mail!)
  res.send(`✅ Login-Code für ${phone} ist ${code}`);
});

// POST: log-in Verfieng
app.post('/verify', (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).send("❌ Telefonnummer und Code erforderlich.");
  }
  const users = loadUsers();
  const user = users.find(u => u.phone === phone);

  // Nutzer suchen
  if (!user) {
    return res.status(404).send("❌ Benutzer nicht gefunden.");
  }
  //vergleiche ywischen codes
  if (user.loginCode != code) {
    return res.status(401).send("❌ Ungültiger Code.");
  }
  // zusätzliche Absicherung(prueft ob ein code gibt)
  if (!user.loginCode || !user.expiresAt) {
    return res.status(400).send("❌ Kein aktiver Login-Code vorhanden.");
  }

  // Ablaufzeit prüfen
  if (Date.now() > user.expiresAt) {
   delete user.loginCode;
   delete user.expiresAt;
   saveUsers(users);
  return res.status(410).send("❌ Code ist abgelaufen. Bitte erneut einloggen.");
  }
  // ✅ Erfolgreich verifiziert → Code und Laufyeit löschen
  delete user.loginCode;
  delete user.expiresAt;
  saveUsers(users);
  res.send(`✅ Willkommen zurück, ${user.name}!`);

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
