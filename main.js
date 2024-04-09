const express = require('express')
const path = require('path')
const app = express()
const MongoClient = require('mongodb').MongoClient
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;

async function getRandomFact() {
  const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('testing'); // Replace 'your_database_name' with your actual database name
    const collection = database.collection('funFacts');

    const count = await collection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);

    const randomFact = await collection.findOne({}, { skip: randomIndex });

    return randomFact.fact;
  } finally {
    await client.close();
  }
}
function encryptMatchID(matchId) {
  // Example Caesar cipher encryption
  const shift = 3; // Shift value
  let encryptedId = "";
  for (let i = 0; i < matchId.length; i++) {
    let charCode = matchId.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      encryptedId += String.fromCharCode((charCode - 65 + shift) % 26 + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      encryptedId += String.fromCharCode((charCode - 97 + shift) % 26 + 97);
    } else {
      encryptedId += matchId.charAt(i);
    }
  }

  return encryptedId;
}
// app.use(express.static(path.join(__dirname, '../VALO TRACKER/public')));
app.use(express.static('public'));
app.get('/facts', (req, res) => {

  getRandomFact().then((fact) => {
    console.log(fact)
    res.send(fact)
  })

})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/Html/index.html'));
})
app.use('*.css', function (req, res, next) {
  res.header('Content-Type', 'text/css');
  next();
});
app.get('/agents', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/agents.html'));
})

app.get('/maps', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/maps.html'));
})

app.get('/post-data', (req, res) => {
  // console.log("inside main.js")
  res.send({ "name": "chetan" })
})

app.get('/profile/riot/:puuid/:region', (req, res) => {

  res.sendFile(path.join(__dirname, 'views/playerstats.html'));
})

app.get('/currentSeason', (req, res) => {

  var season = 'e8a2'
  res.send(season)

});

app.get('/encrypt', (req, res) => {

  var matchid = encryptMatchID(req.body)
  res.send(matchid)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



// http.listen(port);