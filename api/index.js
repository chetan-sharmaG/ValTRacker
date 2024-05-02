const express = require('express')
const path = require('path')
const app = express()
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { cron } = require('./cron.js');
const http = require("http").createServer(app);
var favicon = require('serve-favicon');
const port = process.env.PORT || 4000;
dotenv.config();

// const mongoURI = 'mongodb://localhost:27017';
const mongoURI = process.env.MONGODB
console.log(process.env.mongoDb)


// const client = new MongoClient(mongoURI);
const client = new MongoClient(mongoURI
  , {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function connectToDb() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
let allAgentsData = null;

async function getAllAgentsData() {
  if (!allAgentsData) {
    try {
      const database = client.db('valo');
      const collection = database.collection('agents');
      allAgentsData = await collection.find({}).toArray();
    } catch (error) {
      console.error("Error fetching all agents data:", error);
      throw error; // Re-throwing error to be handled by caller
    }
  }
  return allAgentsData;
}

async function performDatabaseOperations(agentName) {
  try {
    if (!allAgentsData) {
      await getAllAgentsData();
    }
    
    const agentData = allAgentsData.find(agent => agent.displayName === agentName);
    if (!agentData) {
      console.error(`Agent with name ${agentName} not found.`);
      return null; // Or handle the case of agent not found as needed
    }
    
    console.log(agentData);
    return agentData;
  } catch (error) {
    console.error("Error performing database operations:", error);
    throw error; // Re-throwing error to be handled by caller
  }
}
// async function performDatabaseOperations(agentName) {
//   try {
//     const database = client.db('valo');
//     const collection = database.collection('agents');


//     const result = await collection.findOne({ displayName: agentName });
//     console.log(result)
//     return result
//   } catch (error) {
//     return error
//   }
// }
async function getRandomFact() {
  // const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
  // const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('valo'); // Replace 'your_database_name' with your actual database name
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

app.use('/cron', (req,res)=>{
  cron()
});
// app.use(express.static(path.join(__dirname, '../VALO TRACKER/public')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public/assets/images/extras/favicon.ico')))
app.get('/facts', (req, res) => {

  getRandomFact().then((fact) => {
    console.log(fact)
    res.send(fact)
  })

})
connectToDb()
app.use('/', (req, res, next) => {

  next()
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Html/index.html'));
  // res.sendFile('/public/Html/index.html');
})


app.get('/agentData/:agent', async (req, res) => {
  const agentName = req.params.agent
  console.log(agentName)
  const response = await performDatabaseOperations(agentName)
  res.send(response)

})


app.use('*.css', function (req, res, next) {
  res.header('Content-Type', 'text/css');
  next();
});

app.get('/home/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/privacy.html'));
})
app.get('/home/tos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tac.html'));
})

app.get('/agents', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/agents.html'));
})

app.get('/maps', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/maps.html'));
})

app.get('/post-data', (req, res) => {
  // console.log("inside main.js")
  res.send({ "name": "chetan" })
})

app.get('/profile/riot/:puuid/:region', (req, res) => {

  res.sendFile(path.join(__dirname, '../views/playerstats.html'));
})

app.get('/currentSeason', (req, res) => {

  var season = 'e8a3'
  res.send(season)

});

app.get('/encrypt', (req, res) => {

  var matchid = encryptMatchID(req.body)
  res.send(matchid)
});

app.get('/:region/:puuid', async (req, res) => {
  try {
    const region = req.params.region
    const uuid = req.params.puuid
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/' + region + '/' + uuid + '?page=1&size=500')
    let response = await a.json();
    res.json(response);
  } catch (error) {
    res.json(response);
  }

})

app.get('/rank/:region/:puuid', async (req, res) => {

  try {
    const region = req.params.region
    const uuid = req.params.puuid
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/' + region + '/' + uuid)
    let response = await a.json();
    res.json(response);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
})
app.get('/account/:puuid', async (req, res) => {

  try {
    const uuid = req.params.puuid
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/account/' + uuid)
    let response = await a.json();
    res.json(response);
  } catch (error) {
    res.json(response);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


module.exports = app;
// http.listen(port);