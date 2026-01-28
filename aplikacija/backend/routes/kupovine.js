//API za upravljanje kupovinama
const express = require("express");
const router = express.Router();
const db = require("../db");

//Kupovina igre
router.post("/", async (req, res) => {

  const { korisnikId, igricaId, radnjaId } = req.body;

  try {

    // Provera stanja u izabranoj radnji - ovi upiti nam sluze da bi smo izvrsili kupovinu tako sto prvo proveravamo da li je 
                                        // ta igra dostupna, pa ako jeste onda pravimo novi insert u kolekciju kupio i kada to 
                                        // uradimo na kraju oduzmemo kolicinu te igre iz radnje iz koje smo je kupili
    const stanjeCursor = await db.query(`
      FOR e IN dostupno_u
      FILTER e._from == CONCAT("igrice/", @igricaId)
      AND e._to == CONCAT("radnje/", @radnjaId)
      RETURN e.kolicina
    `, { igricaId, radnjaId });

    const kolicina = await stanjeCursor.next();

    if (!kolicina || kolicina <= 0) {
      return res.status(400).json({
        message: "Nema na stanju u toj radnji"
      });
    }

    // Upis kupovine
    await db.query(`
      INSERT {
        _from: CONCAT("korisnici/", @korisnikId),
        _to: CONCAT("igrice/", @igricaId),
        datum_kupovine: DATE_FORMAT(DATE_NOW(), "%yyyy-%mm-%dd"),
        radnja: CONCAT("radnje/", @radnjaId)
      } INTO kupio
    `, { korisnikId, igricaId, radnjaId });

    // Skidanje količine
    await db.query(`
      FOR e IN dostupno_u
      FILTER e._from == CONCAT("igrice/", @igricaId)
      AND e._to == CONCAT("radnje/", @radnjaId)

      UPDATE e WITH {
        kolicina: e.kolicina - 1
      } IN dostupno_u
    `, { igricaId, radnjaId });

    res.json({ message: "Kupovina uspešna" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Sve igre koje je korisnik kupio, ovo nam sluzi da bi smo prikazali sve igrice koje je jedan korisnik kupio 
//i njihovo sortiranje po datumu
router.get("/kupljene/:korisnikId", async (req, res) => {
  const { korisnikId } = req.params;

  try {
    const cursor = await db.query(`
      FOR k IN kupio
        FILTER k._from == CONCAT("korisnici/", @korisnikId)
        /* Spajamo sa kolekcijom igrice da dobijemo detalje o igri */
        LET igrica = DOCUMENT(k._to)
        /* Spajamo sa kolekcijom radnje da dobijemo gde je kupljeno */
        LET radnjaInfo = DOCUMENT(k.radnja)
        SORT k.datum_kupovine DESC
        RETURN {
          datum: k.datum_kupovine,
          igrica: igrica,
          radnja: radnjaInfo,
        }
    `, { korisnikId });

    const rezultati = await cursor.all();
    res.json(rezultati);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;