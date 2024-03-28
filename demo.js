const { MongoClient } = require("mongodb");


const uri ='mongodb://localhost:27017'
const dbname = 'testing'
const client = new MongoClient(uri)

document.addEventListener('DOMContentLoaded', async function () {

    await client.connect()
    console.log("Connected to DB")
   
})

async function getData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/lifetime/matches/ap/LowEndPC/7778?page=1&size=100')
        .then(data => data.json())
        .then(data => {

            let filteredData = data.data.filter(item => item.meta.season.short === "e8a2" && item.meta.mode === 'Competitive');
            let noOfWins = filteredData.reduce((totalWins, item) => {
                const winningTeam = (item.teams.red > item.teams.blue) ? "Red" : "Blue";
                const presentTeam = item.stats.team;
                if (presentTeam === winningTeam) {
                    return totalWins + 1;
                }
                return totalWins;
            }, 0);
            let numberOfMatches = filteredData.length;
            console.log(noOfWins + "/" + numberOfMatches);
        })

}

getData()
