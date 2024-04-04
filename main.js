const express = require('express')
const path = require('path')
const app = express()
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, '../VALO TRACKER/public')));
app.use(express.static('public'));
// 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/Html/index.html'));
})
// app.use('*.css', function (req, res, next) {
//   res.header('Content-Type', 'text/css');
//   next();
// });
app.get('/agents', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/agents.html'));
})

app.get('/maps', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/maps.html'));
})

app.get('/post-data', (req, res) => {
  // console.log("inside main.js")
  res.send({"name":"chetan"})
})

app.get('/profile', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'views/playerstats.html'));
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// http.listen(port);