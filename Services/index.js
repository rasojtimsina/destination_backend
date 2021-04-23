const { default: axios } = require("axios");

if (!process.env.PORT) {
  require("../Secrets");
}
function getUID() {
  //generate seven random number

  let uid = "";
  for (let i = 0; i < 7; i++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }

  return uid;
}

async function getPhotoFromUnsplash(name) {
  const URL = `https://api.unsplash.com/search/photos?client_id=${process.env.UNPLASH_API_KEY}&query=${name}`;

  const res = await axios.get(URL);
  const photos = res.data.results;

  const fallbackPhto =
    "https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg";

  if (photos.length === 0) return fallbackPhto;

  return photos[0].urls.small;
}

module.exports = {
  getUID,
  getPhoto: getPhotoFromUnsplash,
};
