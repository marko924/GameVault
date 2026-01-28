//Fajl za pokretanje backenda (povezivanje ruta, startovanje servera)
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const igriceRoutes = require("./routes/igrice");
const kupovineRoutes = require("./routes/kupovine");
const preporukeRoutes = require("./routes/preporuke");

// Use routes
app.use("/auth", authRoutes);
app.use("/igrice", igriceRoutes);    // /igrice, /igrice/dostupne
app.use("/kupovine", kupovineRoutes);// /kupovine/:korisnikId
app.use("/preporuke", preporukeRoutes);// /preporuke/:korisnikId

// Test route
app.get("/", (req, res) => {
  res.send("ArangoDB Game Store API radi.");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server pokrenut na http://localhost:" + PORT);
});