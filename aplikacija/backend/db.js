//Služi za povezivanje sa ArangoDB bazom
const { Database } = require("arangojs");

const db = new Database({
  url: "http://localhost:8529",
  databaseName: "video_igre",
  auth: {
    username: "root",
    password: ""
  }
});

module.exports = db;