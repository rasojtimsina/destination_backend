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

//GET /? location => destinations in that location
server.get("/search", (req, res) => {
  const { location } = req.query;

  if (!location) return res.status(400).json({ error: "location required" });
  const locations = db.filter(
    (dest) => dest.location.toLowerCase() === location
  );

  return res.send(locations);
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

server.put("/", async (req, res) => {
  // console.log(req.body.uid);
  const { uid } = req.query;
  console.log(`uid=${uid.length}`);
  if (!uid || uid.length !== 7)
    return res.status(400).json({ error: "uid is required 7 digit number" });

  const { name, location, description } = req.body;

  console.log(`description=${description}`);

  if (!name && !location && !description) {
    return res.status(400).json({ error: "add anything" });
  }

  for (let index = 0; index < db.length; index++) {
    const dest = db[index];

    if (dest.uid === uid) {
      // console.log("if its getting here");
      dest.description = description ? description : dest.description;
      dest.location = location ? location : dest.location;

      if (name) {
        const photo = await getPhoto(name);

        dest.name = name;
        dest.photo = photo;
      }
      break;
    }
  }
  res.send({ success: true });
  // if ("uid" in req.body) {
  //   let uid1 = req.body.uid;
  //   let indexWithUId = db.findIndex((uid) => (db.uid = uid1));
  //   db[indexWithUId].name = req.body.name;
  //   db[indexWithUId].description = req.body.description;
  // }
});

// before we creare a destination in our db, we will get photo of that destination from Usplash

//PUT /? UID : UPDATA operation
//expect {name, location, description?}

//DELETE /?UID
// server.delete("/", (req, res) => {
//   const { uid } = req.query;

//   if (!uid || uid.length !== 7)
//     return res.status(400).json({ error: "uid is required 7 digit number" });

//   const { name, description, location } = req.body;

//   if (!name && !location && !description) {
//     return res.status(400).json({ error: "cannot find anything to delete" });
//   }

//   const matchingIndex = (element) => element.uid === uid;
//   let matchingElement = db.findIndex(matchingIndex);
//   if (matchingElement !== -1) {
//     delete db[matchingElement];
//     return res.send(`Found and deleted successfully`);
//   }

//   for (let index = 0; index < db.length; index++) {
//     const dest = db[index];

//     if (dest.uid === uid) {
//       delete db[index];
//       // return res.send(db);
//       return res.send(`Found and deleted`);
//     }
//   }
// });

server.delete("/", (req, res) => {
  const { uid } = req.query;

  let found = false;
  for (let index = 0; index < db.length; index++) {
    const dest = db[index];

    if (dest.uid === uid) {
      found = true;
      db.splice(index, 1);
      break;
    }
  }
  if (found) return res.send(`Found and deleted`);

  return res.send(`not found`);
});
