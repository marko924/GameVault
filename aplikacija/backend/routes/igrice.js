//API za podatke o igrama
const express = require("express");
const router = express.Router();
const db = require("../db");

//Sve igre - ovaj upit se koristi da bi mogao da ucitam sve igrice u glavnu listu za prikaz
router.get("/", async (req, res) => {
  const cursor = await db.query(`FOR i IN igrice RETURN i`);
  res.json(await cursor.all());
});

//Samo dostupne - ovo nam sluzi kada hocemo da prikazemo (filtriramo) samo dostupne igrice (kolicina > 0)
router.get("/dostupne", async (req, res) => {
  const cursor = await db.query(`
    FOR e IN dostupno_u
    FILTER e.kolicina > 0
    COLLECT igricaId = e._from
    LET igrica = DOCUMENT(igricaId)
    RETURN MERGE(igrica, { dostupna: true })
  `);

  res.json(await cursor.all());
});

//Prikaz samo jedne igre - ovo nam sluzi da bi smo mogli da ucitamo izabranu igru iz liste igara sa pocetne stranice
router.get("/:id", async (req, res) => {
  const cursor = await db.query(
    `
    FOR i IN igrice
    FILTER i._key == @igricaKey
    RETURN i
    `,
    { igricaKey: req.params.id }
  );

  res.json(await cursor.all());
});

//Dostupnost jedne igre po radnjama - ovo nam sluzi da bi smo mogli da ucitamo sve radnje u kojima je izabrana igra dostupna
router.get("/:id/dostupnost", async (req, res) => {
  const cursor = await db.query(`
    FOR e IN dostupno_u
    FILTER e._from == CONCAT("igrice/", @igricaId)

    LET igrica = DOCUMENT(e._from)

    FOR r IN radnje
        FILTER r._id == e._to

        RETURN {
            _key: r._key,
            radnja: r.naziv,
            adresa: r.adresa,
            kolicina: e.kolicina,
            cena: igrica.cena
        }
  `, { igricaId: req.params.id });

  res.json(await cursor.all());
});

module.exports = router;