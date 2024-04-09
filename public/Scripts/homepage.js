let euServer = []
let apServer = []
let naServer = []
let KrServer = []
let BrServer = []
let topPlayers = []

document.addEventListener('DOMContentLoaded', async function () {

    fetchEuServerData()
     fetchApServerData()
    fetchNaServerData()
     fetchKrServerData()
     fetchBrServerData()
    updateLeaderboard(euServer)
    updateTopPlayers()
})


async function getTopPLayers(list) {
    topPlayers.push(list)
    console.error(list)

}
async function fetchEuServerData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/eu')
        .then(response => response.json())
        .then(data => {
            euServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);
            data.players[0]['server'] = 'EU';

        // Passing the modified player object to getTopPLayers
        getTopPLayers(data.players[0]);
        }).catch(error => {
            console.error(error)
        })
}
async function fetchApServerData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/ap')
        .then(response => response.json())
        .then(data => {
            apServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);
            data.players[0]['server'] = 'AP';

        // Passing the modified player object to getTopPLayers
        getTopPLayers(data.players[0]);
          
        }).catch(error => {
            console.error(error)
        })
}

async function fetchNaServerData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/na')
        .then(response => response.json())
        .then(data => {
            naServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);
            data.players[0]['server'] = 'NA';

            // Passing the modified player object to getTopPLayers
            getTopPLayers(data.players[0]);
        }).catch(error => {
            console.error(error)
        })
}
async function fetchKrServerData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/kr')
        .then(response => response.json())
        .then(data => {
            KrServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);

        }).catch(error => {
            console.error(error)
        })
}
async function fetchBrServerData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/br')
        .then(response => response.json())
        .then(data => {
            BrServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);

        }).catch(error => {
            console.error(error)
        })
}


function checkForData(server, onDataFoundCallback, spinner) {
    if (!server || server.length === 0) {
        console.log("Server list is empty");
    } else {
        console.log("Server list has items");
        onDataFoundCallback();
    }
}

function checkDataIsReady(onDataLoaded){
    if(topPlayers.length!=3){
        console.error('waiting for data')
    }
    else{
        onDataLoaded()
    }
}
function updateTopPlayers() {
    const playersCard = document.getElementsByClassName('topPlayerCards')[0]
    console.error(topPlayers)
    function onDataLoaded(){
        clearInterval(inttime)
        topPlayers.forEach((players, index) => {
            let row
            row = document.createElement('div')
            row.className = 'players'
            row.innerHTML = `<div><img class="playerIcon"
            src="https://media.valorant-api.com/playercards/${players.PlayerCardID}/smallart.png" width="80px"><div class="rank"></div></div><span id="playerName">${players.gameName}</span><span id="Server"> Top ${players.server} Rating</span><span id="playerRating">${players.rankedRating}</span>`
            playersCard.appendChild(row);
            console.error(row)
    
        })
    }
    const inttime = setInterval(() => {
        checkDataIsReady( onDataLoaded);
    }, 2000);
}
function updateLeaderboard(server) {
    var spinner = document.getElementById('load');
    spinner.style.display = 'flex';
    function onDataFound() {
        clearInterval(intervalId); // Stop checking
        spinner.style.display = 'none';
        var defaultButton = document.getElementById('EU');
        if (server == euServer) {
            defaultButton.style.backgroundColor = 'red'
        } else {
            defaultButton.style.backgroundColor = 'white'
        }
        

        const tbody = document.querySelector('.ll table tbody');
        server.forEach((player, index) => {
            let row;
            const existingRows = tbody.querySelectorAll('tr');
            if (index < existingRows.length) {
                // Update existing row
                row = existingRows[index];
            
                row.querySelector('.playersName').innerHTML = `<img src="https://media.valorant-api.com/playercards/${player.PlayerCardID}/smallart.png" alt="bannerPic" width="50"><span>${player.gameName}</span><span class="tooltip-text" id="right">Number of Wins -><span> ${player.numberOfWins}</span></span>`;
                row.querySelectorAll('td')[2].textContent = player.rankedRating + 'RR';
            } else {
                // Create and append a new row for additional players
                row = document.createElement('tr');
                row.innerHTML = `<td><img src="/assets/images/Ranks_Medals/${index + 1}.png" width="70" alt="${index + 1}.png"></td><td class="playersName"><img src="https://media.valorant-api.com/playercards/${player.PlayerCardID}/smallart.png" alt="bannerPic" width="50"><span>${player.gameName}</span><span class="tooltip-text" id="right">Number of Wins -><span> ${player.numberOfWins}</span></span></td><td>${player.rankedRating} RR</td>`;
                tbody.appendChild(row);
            }
        });
        
        //     tbody.innerHTML = '';
        //     const existingRows = tbody.querySelectorAll('tr');
        //     server.forEach((player, index) => {
        //         let row;
        //         // if (index < existingRows.length) {
        //         //     // Update existing row
        //         //     row = existingRows[index];
        //         //     row.querySelector('.playersName').textContent = player.gameName;
        //         //     row.querySelectorAll('td')[2].textContent = player.rankedRating;
        //         // } else 

        // Append new rows
        // server.forEach((player, index) => {
        //     let row = document.createElement('tr');
        //     row.innerHTML = `<td><img src="${index + 1}.png" width="70" alt="${index + 1}.png"></td><td class="playersName"><img src="https://media.valorant-api.com/playercards/${player.PlayerCardID}/smallart.png" alt=bannerPic width="50"><span>${player.gameName}</span></td><td>${player.rankedRating}</td>`;
        //     tbody.appendChild(row);
        // });
    }

    // Start checking for data
    const intervalId = setInterval(() => {
        checkForData(server, onDataFound, spinner);
    }, 1000);
}

document.getElementById('AP').addEventListener('click', () => updateLeaderboard(apServer));
document.getElementById('EU').addEventListener('click', () => updateLeaderboard(euServer));
document.getElementById('BR').addEventListener('click', () => updateLeaderboard(BrServer));
document.getElementById('KR').addEventListener('click', () => updateLeaderboard(KrServer));
document.getElementById('NA').addEventListener('click', () => updateLeaderboard(naServer));
// Call this function whenever you need to update the leaderboard

