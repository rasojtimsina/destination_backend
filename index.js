//require express
//call express to create our server
const express = require("express");
const axios = require("axios");
const cors = require("cors");
//make our server listen ton a port
const server = express();
server.use(cors());

//express to grab the body from the client request and
// create a body property on the request object  req.body

server.use(express.json());

// expect to get some payload data directly from a client as a json object
// when you do, put them on req.body

server.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

//database
const { db } = require("./Database");
const { getUID } = require("./Services");
const { getPhoto } = require("./Services");
// const { urlencoded } = require("express");

//routes
/*
CRUD
C => Create => POST
R => Read => GET
U => Update => PUT
D => Delete => DELETE
*/

//GET (CRUD) obj to get information from the server
//GET  => db: READ Operation

server.get("/", (req, res) => {
  res.send(db);
});

//POST/
// expects {name, location, description?}
server.post("/", async (req, res) => {
  const { name, location, description } = req.body;
  if (!name || !location)
    return res.status(400).json({ error: "name and location required" });
  const uid = getUID();

  const photo = await getPhoto(name);

  db.push({
    uid,
    photo,
    location,
    description: description || "",
  });

  res.send({ uid });
});

// before we creare a destination in our db, we will get photo of that destination from Usplash

//PUT /? UID : UPDATA operation
//expect {name, location, description?}

//DELETE /?UID
