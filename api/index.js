const express = require('express')
const path = require('path')
const app = express()
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cron = require('./cron.js');
const http = require("http").createServer(app);
var favicon = require('serve-favicon');
const { error } = require('console');



const port = process.env.PORT || 4000;
dotenv.config();


const nodemailer = require('nodemailer');
// const mongoURI = 'mongodb://localhost:27017';
const mongoURI = process.env.MONGODB
console.log(process.env.MONGODB)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:465,
  secure:true,
  logger:true,
  debug:true,
  secureConnection:false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD
  },
  tls:{
    rejectUnauthorized:true
  }
});

const mailOptions = {
  from: process.env.EMAIL_ID,
  to: process.env.EMAIL_RECEIVER,
  subject: 'Sending Email using Node.js for cron job time ='+Date.now(),
  text: 'Cron job executed!'
};

// const client = new MongoClient(mongoURI);
let client = new MongoClient(mongoURI
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
let allMapsData = null
async function getAllAgentsData() {
  if (!allAgentsData) {
    try {
      const database = client.db('valo');
      const collection = database.collection('agents');
      allAgentsData = await collection.find({}).toArray();
      await client.close()
    } catch (error) {
      console.error("Error fetching all agents data:", error);
      throw error; // Re-throwing error to be handled by caller
    }
  }
  return allAgentsData;
}
async function getAllMapssData() {
  if (!allMapsData) {
    try {
      const database = client.db('valo');
      const collection = database.collection('maps');
      allMapsData = await collection.find({}).toArray();
      console.log(allAgentsData)
      await client.close()
    } catch (error) {
      console.error("Error fetching all maps data:", error);
      throw error; // Re-throwing error to be handled by caller
    }
  }
  return allMapsData;
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
async function performDatabaseOperationsOnMap(mapname) {
  try {
    if (!allMapsData) {
      await getAllMapssData();
    }

    const mapdd = allMapsData.find(map => map.mapName === mapname);
    if (!mapdd) {
      console.error(`Map with name ${mapname} not found.`);
      return null; // Or handle the case of agent not found as needed
    }

    console.log(mapdd);
    return mapdd;
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

app.get('/cron', async (req, res) => {
  console.error(' 1 - Cron job executing');
  cron(); // Call the cron job function
  console.warn(' 2 -Inside PushData')
  await connectToDb()
  try {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    const db = client.db('valo');
    await Promise.all([
      UploadDataEU(db, 'EUDATA', 'eu'),
      UploadDataNA(db, 'NADATA', 'na'),
      UploadDataAP(db, 'APDATA', 'ap'),
      UploadDataKR(db, 'KRDATA', 'kr'),
      UploadDataBR(db, 'BRDATA', 'br')
    ]);
  } catch (error) {
    console.log(`Error occured during method calss ${error}`);
    // res.send('Error');
  }
  console.error('Cron job executed');

});
let mapData
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
// app.use('/', (req, res, next) => {

//   next()
// })
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
app.get('/mapData/:map', async (req, res) => {
  const MapName = req.params.map
  console.log(MapName)
  const response = await performDatabaseOperationsOnMap(MapName)
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

app.get('/maps', async(req, res) => {
  connectToDb()
  await connectToDb()
  const db = client.db('valo');
  const collection = db.collection('maps')
  mapData = await collection.find({}).toArray()
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

  var season = 'e10a6'
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
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/' + region + '/' + uuid + '?page=1&size=500',{
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }})
    let response = await a.json();
    res.json(response);
  } catch (error) {
    res.json(response);
  }

})

app.get('/:name/getPlayer/:tag',async(req,res)=>{
  try{
    let username = req.params.name
    let tagline = req.params.tag
    let getUser = await fetch('https://api.henrikdev.xyz/valorant/v1/account/' + username + '/' + tagline,{
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }
  })
  let response = await getUser.json();
  console.log(response)
  res.json(response);
  }catch(error){
    console.log(error)
    res.json(error)
  }
})
app.get('/riot/profile/user/match/:matchid',async (req,res)=>{

  try{

    let matchId =req.params.matchid
    let matchCall =await fetch('https://api.henrikdev.xyz/valorant/v2/match/' + matchId,{
        method: "GET",
        headers: {
            "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
        }
    })
    let response = await matchCall.json();
    res.json(response);
  }catch(error){
    console.log(error)
    res.json(error);
  }


})

app.get('/profile/user/updateTags/:puuid',async(req,res)=>{

   try{
    const uuid = req.params.puuid
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/account/' + uuid,{
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }})
    let response = await a.json();
    res.json(response);
   }catch(error){
    console.log(error)
    res.json(error);
   }
})

app.get('/rank/:region/:puuid', async (req, res) => {

  try {
    const region = req.params.region
    const uuid = req.params.puuid
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/' + region + '/' + uuid,{
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }})
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
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/account/' + uuid,{
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }})
    let response = await a.json();
    res.json(response);
  } catch (error) {
    res.json(response);
  }
})

// app.get('/pushData',async(req,res)=>{
//   console.warn('Inside PushData')
//   connectToDb()
//   console.warn('Connected to DB')
//   try {
//     const db = client.db('valo');
//     await UploadData(db, 'EUDATA', 'eu');
//     await UploadData(db, 'NADATA', 'na');
//     await UploadData(db, 'APDATA', 'ap');
//     await UploadData(db, 'KRDATA', 'kr');
//     await UploadData(db, 'BRDATA', 'br');
// } catch (error) {
//     console.log(error);
//     res.send('Error');
// }

// })

async function UploadDataEU(db, collectionName, server) {
  console.warn(`--------------------------${collectionName}-----------------------`)
  console.warn(` 1 - inside ${collectionName}`)
  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await db.createCollection(collectionName, {});
      console.warn(" 2 - Creating colection:" + collectionName)
    } else {
      await collection.deleteMany({});
      console.warn(" 2 - Deleting colection data :" + collectionName)
    }
    console.warn(` 3 -fetching Data frpm https://api.henrikdev.xyz/valorant/v2/leaderboard/${server}`)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

    const response = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/' + server, {
      signal: controller.signal,
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }  
       
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${server}: ${response.statusText}`);

    }
    const data = await response.json();
    await collection.insertMany([data]);
    console.warn(` 4 - loaded the Data Data`)

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request aborted for ${server}`);
    } else {
      console.log(" 6 - Some Error came" + error);
    }
  }
}
async function UploadDataNA(db, collectionName, server) {
  console.warn(`--------------------------${collectionName}-----------------------`)
  console.warn(` 1 - inside ${collectionName}`)
  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await db.createCollection(collectionName, {});
      console.warn(" 2 - Creating colection:" + collectionName)
    } else {
      await collection.deleteMany({});
      console.warn(" 2 - Deleting colection data :" + collectionName)
    }
    console.warn(` 3 -fetching Data frpm https://api.henrikdev.xyz/valorant/v2/leaderboard/${server}`)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

    const response = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/' + server, {
      signal: controller.signal,
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }  
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${server}: ${response.statusText}`);

    }
    const data = await response.json();
    await collection.insertMany([data]);
    console.warn(` 4 - loaded the Data Data`)

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request aborted for ${server}`);
    } else {
      console.log(" 6 - Some Error came" + error);
    }
  }
}
async function UploadDataAP(db, collectionName, server) {
  console.warn(`--------------------------${collectionName}-----------------------`)
  console.warn(` 1 - inside ${collectionName}`)
  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await db.createCollection(collectionName, {});
      console.warn(" 2 - Creating colection:" + collectionName)
    } else {
      await collection.deleteMany({});
      console.warn(" 2 - Deleting colection data :" + collectionName)
    }
    console.warn(` 3 -fetching Data frpm https://api.henrikdev.xyz/valorant/v2/leaderboard/${server}`)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

    const response = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/' + server, {
      signal: controller.signal,
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }  
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${server}: ${response.statusText}`);

    }
    const data = await response.json();
    await collection.insertMany([data]);
    console.warn(` 4 - loaded the Data Data`)

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request aborted for ${server}`);
    } else {
      console.log(" 6 - Some Error came" + error);
    }
  }
}
async function UploadDataKR(db, collectionName, server) {
  console.warn(`--------------------------${collectionName}-----------------------`)
  console.warn(` 1 - inside ${collectionName}`)
  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await db.createCollection(collectionName, {});
      console.warn(" 2 - Creating colection:" + collectionName)
    } else {
      await collection.deleteMany({});
      console.warn(" 2 - Deleting colection data :" + collectionName)
    }
    console.warn(` 3 -fetching Data frpm https://api.henrikdev.xyz/valorant/v2/leaderboard/${server}`)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

    const response = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/' + server, {
      signal: controller.signal,
      method: "GET",
      headers: {
          "Authorization": "HDEV-2f4795d1-3f40-4cd3-bc23-cb3ab76655af",
      }  
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${server}: ${response.statusText}`);

    }
    const data = await response.json();
    await collection.insertMany([data]);
    console.warn(` 4 - loaded the Data Data`)

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request aborted for ${server}`);
    } else {
      console.log(" 6 - Some Error came" + error);
    }
  }
}
async function UploadDataBR(db, collectionName, server) {
  console.warn(`--------------------------${collectionName}-----------------------`)
  console.warn(` 1 - inside ${collectionName}`)
  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await db.createCollection(collectionName, {});
      console.warn(" 2 - Creating colection:" + collectionName)
    } else {
      await collection.deleteMany({});
      console.warn(" 2 - Deleting colection data :" + collectionName)
    }
    console.warn(` 3 -fetching Data frpm https://api.henrikdev.xyz/valorant/v2/leaderboard/${server}`)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

    const response = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/' + server, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${server}: ${response.statusText}`);

    }
    const data = await response.json();
    await collection.insertMany([data]);
    console.warn(` 4 - loaded the Data Data`)

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request aborted for ${server}`);
    } else {
      console.log(" 6 - Some Error came" + error);
    }
  }
}


app.get('/EuServer', async (req, res) => {
  try {
    await connectToDb()
    const db = client.db('valo');
    const collection = db.collection('EUDATA')
    const data = await collection.find({}).toArray()
    res.send(data[0])
  } catch (error) {
    console.error('Error at /EUServer ' + error)
  }
})
app.get('/NaServer', async (req, res) => {
  try {
    await connectToDb()
    const db = client.db('valo');
    const collection = db.collection('NADATA')
    const data = await collection.find({}).toArray()
    res.send(data[0])
  } catch (error) {
    console.error('Error at /NAServer ' + error)
  }
})
app.get('/ApServer', async (req, res) => {
  try {
    await connectToDb()
    const db = client.db('valo');
    const collection = db.collection('APDATA')
    const data = await collection.find({}).toArray()
    res.send(data[0])
  } catch (error) {
    console.error('Error at /EUServer ' + error)
  }
})
app.get('/KrServer', async (req, res) => {
  try {
    await connectToDb()
    const db = client.db('valo');
    const collection = db.collection('KRDATA')
    const data = await collection.find({}).toArray()
    res.send(data[0])
  } catch (error) {
    console.error('Error at /KRServer ' + error)
  }
})
app.get('/BrServer', async (req, res) => {
  try {
    await connectToDb()
    const db = client.db('valo');
    const collection = db.collection('BRDATA')
    const data = await collection.find({}).toArray()
    res.send(data[0])
  } catch (error) {
    console.error('Error at /BRServer ' + error)
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


module.exports = app;
// http.listen(port);