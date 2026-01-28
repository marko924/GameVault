//API za generisanje preporuka za korisnika
const express = require("express");
const router = express.Router();
const db = require("../db");

//Preporuka igara
//Prvo prolazimo kroz sve igre koje je korisnik kupio
//Ako korisnik nema kupljene igre njemu se nece prikazati preporuke
//Drugo prolazim kroz listu svih kupljenih igara
//Pomocu atributa stepen_slicnosti za svaku kupljenu igru prolazi kroz sve podatke iz kolekcije slicna_sa 
//i prikazuje samo one igre ciji stepen slicnosti sa kupljenom igrom je veci od 7 (sto znaci da su dosta slicne)
//Na kraju gleda da ono sto bi mozda preporucio da to korisnik vec nije kupio da mu ne bi preporucio istu igru
router.get("/:korisnikId", async (req, res) => {

  const korisnikId = `korisnici/${req.params.korisnikId}`;
  
  const cursor = await db.query(`
    LET kupljene = (
      FOR i IN OUTBOUND @korisnikId kupio
      RETURN i._id
    )

    FILTER LENGTH(kupljene) > 0

    FOR kupljena IN kupljene
      FOR preporuka, rel IN OUTBOUND kupljena slicna_sa
        FILTER rel.stepen_slicnosti > 7
        FILTER preporuka._id NOT IN kupljene

    SORT rel.stepen_slicnosti DESC
    LIMIT 8

    RETURN DISTINCT MERGE(preporuka, {
      stepen_slicnosti: rel.stepen_slicnosti,
      bazna_igrica: kupljena
    })
  `, { korisnikId });

  res.json(await cursor.all());
});

module.exports = router;