
const fs = require('fs'); // Importiert das eingebaute File-System-Modul 

const express = require('express');

const app = express(); // diese zeile ist funktionaufruf ,diese funktion erstellt eine neue Express-App(webserver)

app.use(express.json());// verstehe und lese sie automatisch.(wenn daten von client geschickt werden)

const Users=[]; //Array um Data zu speichern

// GET-Route erstellen

app.get('/Users',(req,res)=>{res.json(Users)}); // die gespeicherte Daten an den User schicken

//POST-Route erstellen

app.post('/signup',(req,res)=>{
  const{ name,SurName, DateOfBirth, phone } = req.body; // da werden die User Daten gespeichert

  // prüfen, ob req.body vollständig ist
  if (!name || !SurName || !DateOfBirth || !phone) {
    return res.status(400).send("Bitte alle Felder ausfüllen.");
  }
  Users.push(req.body);
  res.send(`Willkommen ${name}, deine Nummer ist ${phone}`);
});

// server starten 
app.listen(3000,()=>{
 console.log('server leuft')
});

