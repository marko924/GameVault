//API za prijavu i registraciju
const express = require("express");
const router = express.Router();
const db = require("../db");

//Identifikacija korisnika (email ili username) radi personalizovane preporuke igara
router.post("/login", async (req, res) => {
  const { email, username } = req.body;

  try {
    const cursor = await db.query(`
      FOR k IN korisnici
      FILTER k.email == @email OR k.username == @username
      LIMIT 1
      RETURN k
    `, { email, username });

    const user = await cursor.next();

    if (!user) {
      return res.status(401).json({ message: "Pogrešan email ili username" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Registracija korisnika
router.post("/register", async (req, res) => {
  const { ime, prezime, username, email } = req.body;

  try {
    // Provera da li vec postoji korisnik
    const checkCursor = await db.query(`
      FOR k IN korisnici
      FILTER k.email == @email OR k.username == @username
      RETURN k
    `, { email, username });

    const existingUser = await checkCursor.next();

    if (existingUser) {
      return res.status(400).json({
        message: "Korisnik sa tim emailom ili username-om već postoji"
      });
    }

    // Upis novog korisnika
    const insertCursor = await db.query(`
      INSERT {
        ime: @ime,
        prezime: @prezime,
        username: @username,
        email: @email
      } INTO korisnici
      RETURN NEW
    `, {
      ime,
      prezime,
      username,
      email
    });

    const newUser = await insertCursor.next();

    res.status(201).json(newUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;