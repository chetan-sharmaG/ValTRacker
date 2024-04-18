
// let euServer = []
// let apServer = []
// let naServer = []
// let KrServer = []
// let BrServer = []
// let topPlayers = []
// let allPlayer = []
// document.addEventListener('DOMContentLoaded', async function () {

//     fetchEuServerData()
//     fetchApServerData()
//     fetchNaServerData()
//     updateTopPlayers()
//     fetchKrServerData()
//     fetchBrServerData()
//     updateLeaderboard(euServer)

// })


// async function getTopPLayers(list) {
//     topPlayers.push(list)


// }
// async function fetchEuServerData() {
//     let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/eu')
//         .then(response => response.json())
//         .then(data => {
//             data.players[0]['server'] = 'EU';
//             getTopPLayers(data.players[0]);
//             for (var i = 0; i < 10; i++) {
//                 data.players[i]['server'] = 'eu';
//                 if (euServer.length < 6 && data.players[i].IsAnonymized === false) {
//                     euServer.push(data.players[i])
//                 }
//             }
//             var arr = data.players.map(obj => {
//                 return {
//                     ...obj,
//                     server: "eu"
//                 }
//             });
//             allPlayer.push(arr)
//             // euServer.push(data.players[0], data.players[1], data.players[2], data.players[3], data.players[4], data.players[5]);


//             // Passing the modified player object to getTopPLayers

//         }).catch(error => {
//             console.error(error)
//         })
// }
// async function fetchApServerData() {
//     let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/ap')
//         .then(response => response.json())
//         .then(data => {
//             data.players[0]['server'] = 'AP';
//             getTopPLayers(data.players[0]);
//             for (var i = 0; i < 10; i++) {
//                 data.players[i]['server'] = 'ap';
//                 if (apServer.length < 6 && data.players[i].IsAnonymized === false) {
//                     apServer.push(data.players[i])
//                 }
//             }
//             var arr = data.players.map(obj => {
//                 return {
//                     ...obj,
//                     server: "ap"
//                 }
//             });
//             allPlayer.push(arr)



//         }).catch(error => {
//             console.error(error)
//         })
// }

// async function fetchNaServerData() {
//     let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/na')
//         .then(response => response.json())
//         .then(data => {
//             data.players[0]['server'] = 'NA';
//             getTopPLayers(data.players[0]);
//             for (var i = 0; i < 10; i++) {
//                 data.players[i]['server'] = 'na';
//                 if (naServer.length < 6 && data.players[i].IsAnonymized === false) {
//                     naServer.push(data.players[i])
//                 }
//             }


//             var arr = data.players.map(obj => {
//                 return {
//                     ...obj,
//                     server: "na"
//                 }
//             });
//             allPlayer.push(arr)


//         }).catch(error => {
//             console.error(error)
//         })
// }
// async function fetchKrServerData() {
//     let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/kr')
//         .then(response => response.json())
//         .then(data => {
//             for (var i = 0; i < 10; i++) {
//                 data.players[i]['server'] = 'kr';
//                 if (KrServer.length < 6 && data.players[i].IsAnonymized === false) {
//                     KrServer.push(data.players[i])
//                 }
//             }
//             var arr = data.players.map(obj => {
//                 return {
//                     ...obj,
//                     server: "kr"
//                 }
//             });
//             allPlayer.push(arr)
//         }).catch(error => {
//             console.error(error)
//         })
// }
// async function fetchBrServerData() {
//     let a = await fetch('https://api.henrikdev.xyz/valorant/v2/leaderboard/br')
//         .then(response => response.json())
//         .then(data => {
//             for (var i = 0; i < 10; i++) {
//                 data.players[i]['server'] = 'br';
//                 if (BrServer.length < 6 && data.players[i].IsAnonymized === false) {
//                     BrServer.push(data.players[i])
//                 }
//             } var arr = data.players.map(obj => {
//                 return {
//                     ...obj,
//                     server: "br"
//                 }
//             });
//             allPlayer.push(arr)


//         }).catch(error => {
//             console.error(error)
//         })
// }


// function checkForData(server, onDataFoundCallback, spinner) {
//     if (!server || server.length === 0) {
//         // console.log("Server list is empty");
//     } else {
//         // console.log("Server list has items");
//         onDataFoundCallback();
//     }
// }

// function checkDataIsReady(onDataLoaded) {
//     if (topPlayers.length != 3) {
//         // console.error('waiting for data')
//     }
//     else {
//         onDataLoaded()
//     }
// }
// async function updateTopPlayers() {
//     const playersCard = document.getElementsByClassName('topPlayerCards')[0]
//     function onDataLoaded() {
//         clearInterval(inttime)
//         topPlayers.forEach((players, index) => {
//             let row
//             const server = (players.server).toLowerCase()
//             row = document.createElement('div')
//             row.className = 'players'
//             row.innerHTML = `<a class='playerRedirect' href='/profile/riot/${players.puuid}/${server}'><div><img class="playerIcon"
//             src="https://media.valorant-api.com/playercards/${players.PlayerCardID}/smallart.png" width="80px"><div class="rank"></div></div><span id="playerName">${players.gameName}</span><span id="Server"> Top ${players.server} Rating</span><span id="playerRating">${players.rankedRating}</span></a>`
//             playersCard.appendChild(row);


//         })
//     }
//     const inttime = setInterval(() => {
//         checkDataIsReady(onDataLoaded);
//     }, 2000);
// }
// function updateLeaderboard(server) {
//     var spinner = document.getElementById('load');
//     spinner.style.display = 'flex';
//     function onDataFound() {
//         clearInterval(intervalId); // Stop checking
//         spinner.style.display = 'none';
//         var defaultButton = document.getElementById('EU');
//         if (server == euServer) {
//             defaultButton.style.backgroundColor = 'red'
//         } else {
//             defaultButton.style.backgroundColor = 'white'
//         }


//         const tbody = document.querySelector('.ll table tbody');
//         server.forEach((player, index) => {
//             let row;

//             const server1 = player.server
//             const existingRows = tbody.querySelectorAll('tr');
//             if (index < existingRows.length) {
//                 // Update existing row
//                 row = existingRows[index];

//                 row.querySelector('.playersName').innerHTML = `<a class='playerRedirect' href='/profile/riot/${player.puuid}/${server1}'><img src="https://media.valorant-api.com/playercards/${player.PlayerCardID}/smallart.png" alt="bannerPic" width="50"><span>${player.gameName}</span><span class="tooltip-text" id="right">Number of Wins -><span> ${player.numberOfWins}</span></span></a>`;
//                 row.querySelectorAll('td')[2].textContent = player.rankedRating + 'RR';
//             } else {

//                 // Create and append a new row for additional players
//                 row = document.createElement('tr');
//                 row.innerHTML = `<td><img src="/assets/images/Ranks_Medals/${index + 1}.png" width="70" alt="${index + 1}.png"></td><td class="playersName"><a class='playerRedirect' href='/profile/riot/${player.puuid}/${server1}'><img src="https://media.valorant-api.com/playercards/${player.PlayerCardID}/smallart.png" alt="bannerPic" width="50"><span>${player.gameName}</span><span class="tooltip-text" id="right">Number of Wins -><span> ${player.numberOfWins}</span></span></a></td><td>${player.rankedRating} RR</td>`;
//                 tbody.appendChild(row);
//             }
//         });



//     }

//     // Start checking for data
//     const intervalId = setInterval(() => {
//         checkForData(server, onDataFound, spinner);
//     }, 1000);
// }

// document.getElementById('AP').addEventListener('click', () => updateLeaderboard(apServer));
// document.getElementById('EU').addEventListener('click', () => updateLeaderboard(euServer));
// document.getElementById('BR').addEventListener('click', () => updateLeaderboard(BrServer));
// document.getElementById('KR').addEventListener('click', () => updateLeaderboard(KrServer));
// document.getElementById('NA').addEventListener('click', () => updateLeaderboard(naServer));
// // Call this function whenever you need to update the leaderboard
let reString = localStorage.getItem('recentPlayer')
let recentPlayer = []

if (reString) {
    // var updatedString = reString.replace('"','')
    recentPlayer = JSON.parse(reString)
    // recentPlayer = recentPlayer.map(function(item) {
    //     return JSON.parse(item);
    //   })
    console.error(recentPlayer)
}

document.getElementById('searchbar').addEventListener('focusin', () => {
    const reString = localStorage.getItem('recentPlayer')
    const retArray = JSON.parse(reString)

    searchboxContainer.style.visibility = 'visible'
})
// document.getElementById('searchbar').addEventListener('focusout',()=>{
//     const searchboxContainer = document.getElementsByClassName('searchboxContainer')[0]
//     searchboxContainer.style.visibility = 'hidden'
// })
// document.addEventListener('DOMContentLoaded', async function () {


    
// })

// const searchboxContainer = document.getElementsByClassName('searchboxContainer')[0]
// const clearButton = document.getElementsByClassName('clearButton')[0]
// const searchText = document.getElementById('searchbar')
// const SearchedPlayerDiv = document.getElementsByClassName('searchedPlayer')[0]
// const playersWrapper = document.getElementsByClassName('playersWrapper')[0]
// const seachedPlayerSideBar = document.getElementsByClassName('SearchedResult')[0]
// const DbPlayersBox = document.getElementsByClassName('MatchingPlayersBox')[0]
// const recentSearchSpan = document.getElementsByClassName('RecentSearch')[0]
// const errorDivTag = document.getElementsByClassName('errorSearch')[0]
// const cc = document.getElementsByClassName('cc')

let searchboxContainer = document.getElementsByClassName('searchboxContainer')[0];
let clearButton = document.getElementsByClassName('clearButton')[0];
let searchText = document.getElementById('searchbar');
let SearchedPlayerDiv = document.getElementsByClassName('searchedPlayer')[0];
let playersWrapper = document.getElementsByClassName('playersWrapper')[0];
let seachedPlayerSideBar = document.getElementsByClassName('SearchedResult')[0];
let DbPlayersBox = document.getElementsByClassName('MatchingPlayersBox')[0];
let recentSearchSpan = document.getElementsByClassName('RecentSearch')[0];
let errorDivTag = document.getElementsByClassName('errorSearch')[0];
let cc = document.getElementsByClassName('cc');
let recentPlayerColumn = document.getElementsByClassName('recentPlayerColumn')[0]
let ErrorColumn = document.getElementsByClassName('ErrorColumn')[0]
let searchedPlayerColumn = document.getElementsByClassName('searchedPlayerColumn')[0]

clearButton.addEventListener('click', () => {
    searchText.value = ''
    // var errorDivTag=document.getElementsByClassName('errorSearch')[0];
    // errorDivTag.innerHTML=''
    // errorDivTag.textContent='11'
    // if (searchText.value.length === 0) {
    //     searchText.value = ''
    //     // displayText.innerHTML = ''
    //     // playersWrapper.innerHTML = ''
    // }
})
searchText.addEventListener('input', function (event) {
    
    // SearchedPlayerDiv.classList.add('displayFlex')
    // DbPlayersBox.classList.remove('displayNone')
    // recent.classList.add('displayNone')
    // if (errorDivTag){
    //     errorDivTag.remove()
    // }
    searchedPlayerColumn.style.display='flex';
    ErrorColumn.style.display='none';
    recentPlayerColumn.style.display='none';
    var errorDivTag=document.getElementsByClassName('errorSearch')[0];
    errorDivTag.innerHTML=''
    seachedPlayerSideBar.classList.add('addLeftBorder')
    recentSearchSpan.classList.remove('addLeftBorder')
    var text = event.target.value;
    var splitCode = text.split('#')


    if (text.length > 1) {
        console.error('test')
        seachedPlayerSideBar.style.display = 'flex'
        cc[0].classList.add('addRowHeight')
        cc[1].classList.add('addRowHeight')
        searchboxContainer.classList.add('searchContainerHeight')
        clearButton.style.visibility = 'visible'
        SearchedPlayerDiv.style.backgroundColor = '#323d48'
        if (splitCode[1]) {
            SearchedPlayerDiv.innerHTML = `<img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${splitCode[0]}</span><span class='tagLine'>#${splitCode[1]}</span>`
        }
        else {
            SearchedPlayerDiv.innerHTML = `<img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${text}</span>`
        }

        // const arrayOfArrays = allPlayer

        // const partialMatch = text; // Partial match to find

        // // Function to check if any string property in an object contains the given substring
        // function objectContainsSubstring(obj, substring) {
        //     return typeof obj.gameName === 'string' && obj.gameName.includes(substring);
        // }

        // const Players = [];

        // // Iterate over each inner array
        // for (const innerArray of arrayOfArrays) {
        //     // Iterate over each object within the inner array
        //     for (const obj of innerArray) {
        //         // Check if any string property in the object contains the partial match
        //         if (objectContainsSubstring(obj, partialMatch)) {
        //             Players.push(obj)// Stop searching if a match is found
        //         }
        //     }

        // }
        // var startswithName = []
        // if (Players.length > 0) {

        //     startswithName = Players.map(player => {
        //         if (player.gameName.startsWith(partialMatch) && player.IsAnonymized === false) {

        //             return { name: player.gameName, tag: player.tagLine, server: player.server, puuid: player.puuid }
        //         }
        //     })
        //     startswithName = startswithName.filter(obj => obj !== undefined);
        //     // console.warn(startswithName)

        //     DbPlayersBox.innerHTML = ''
        //     startswithName.forEach(individual => {
        //         const MatchingPlayers = document.createElement('div')
        //         MatchingPlayers.classList.add('MatchingPlayers')
        //         MatchingPlayers.innerHTML = `<a href='/profile/riot/${individual.puuid}/${individual.server}' onclick="addPlayer('${individual.name}','${individual.tag}','${individual.server}','${individual.puuid}');" ><img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${individual.name}</span><span class=tagLine>#${individual.tag}</span></a>`
        //         DbPlayersBox.appendChild(MatchingPlayers)
        //     })
        // }
        // else {
        //     console.log('No partial matches found.');
        // }

    }
})

seachedPlayerSideBar.addEventListener('click', () => {

    // SearchedPlayerDiv.classList.add('displayFlex')
    // DbPlayersBox.classList.remove('displayNone')
    // recent.classList.add('displayNone')
    ErrorColumn.style.display='none';
     searchedPlayerColumn.style.display='flex';
    recentPlayerColumn.style.display='none';
    seachedPlayerSideBar.classList.add('addLeftBorder')
    recentSearchSpan.classList.remove('addLeftBorder')
    // if (errorDivTag)
    //     {
    //         console.error('yo1')
    //     errorDivTag.remove()
    //     }
    var errorDivTag=document.getElementsByClassName('errorSearch')[0];
    errorDivTag.innerHTML=''
    var text = searchText.value
    var splitCode = text.split('#')


    if (text.length > 1) {
        seachedPlayerSideBar.style.display = 'flex'
        searchboxContainer.classList.add('searchContainerHeight')
        clearButton.style.visibility = 'visible'
        SearchedPlayerDiv.style.backgroundColor = '#323d48'
        if (splitCode[1]) {
            SearchedPlayerDiv.innerHTML = `<img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${splitCode[0]}</span><span class='tagLine'>#${splitCode[1]}</span>`
        }
        else {
            SearchedPlayerDiv.innerHTML = `<img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${text}</span>`
        }

        // const arrayOfArrays = allPlayer

        // const partialMatch = text; // Partial match to find

        // // Function to check if any string property in an object contains the given substring
        // function objectContainsSubstring(obj, substring) {
        //     return typeof obj.gameName === 'string' && obj.gameName.includes(substring);
        // }

        // const Players = [];

        // // Iterate over each inner array
        // for (const innerArray of arrayOfArrays) {
        //     // Iterate over each object within the inner array
        //     for (const obj of innerArray) {
        //         // Check if any string property in the object contains the partial match
        //         if (objectContainsSubstring(obj, partialMatch)) {
        //             Players.push(obj)// Stop searching if a match is found
        //         }
        //     }

        // }
        // var startswithName = []
        // if (Players.length > 0) {

        //     startswithName = Players.map(player => {
        //         if (player.gameName.startsWith(partialMatch) && player.IsAnonymized === false) {

        //             return { name: player.gameName, tag: player.tagLine, server: player.server, puuid: player.puuid }
        //         }
        //     })
        //     startswithName = startswithName.filter(obj => obj !== undefined);
        //     // console.warn(startswithName)

        //     DbPlayersBox.innerHTML = ''
        //     startswithName.forEach(individual => {
        //         const MatchingPlayers = document.createElement('div')
        //         MatchingPlayers.classList.add('MatchingPlayers')
        //         MatchingPlayers.innerHTML = `<a href='/profile/riot/${individual.puuid}/${individual.server}' onclick="addPlayer('${individual.name}','${individual.tag}','${individual.server}','${individual.puuid}');" ><img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${individual.name}</span><span class=tagLine>#${individual.tag}</span></a>`
        //         DbPlayersBox.appendChild(MatchingPlayers)
        //     })
        // }
        // else {
        //     console.log('No partial matches found.');
        // }
    }
})


function addPlayer(name, tag, server, puuid) {
    recentPlayer.push({
        "name": name,
        "tag": tag,
        "server": server,
        "puuid": puuid
    });
    localStorage.setItem('recentPlayer', JSON.stringify(recentPlayer))
}
searchText.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {

        // The Enter key was pressed, check if the input box is empty.
        if (searchText.value.trim() === '' || !searchText.value.includes('#')) {
            // The input box is empty, show an error.
            playersWrapper.innerHTML = ''
            playersWrapper.innerHTML = `<div class='searchedPlayer'></div><div class='errorSearch'> Please Provide a valid username followed with correct Tag, like Pizza#454</div><div class='MatchingPlayersBox '></div><div class="recentClass "></div>`
            // console.error('Please enter Valid username provided with #');
            // Optionally, prevent the event from doing its default action.
            event.preventDefault();
        }
        else {
            const enteredText = searchText.value.split('#')
            const username = enteredText[0]
            const tagline = enteredText[1]
            let getUser = fetch('https://api.henrikdev.xyz/valorant/v1/account/' + username + '/' + tagline)
                .then(data => data.json())
                .then(data => {
                    if (data.status === 404) {
                        const playersWrapper = document.getElementsByClassName('playersWrapper')[0]
                        playersWrapper.innerHTML = ''
                        playersWrapper.innerHTML = `<div class='searchedPlayer'></div><div class='errorSearch'> Player Not found with ${username}#${tagline}</div><div class='MatchingPlayersBox '></div><div class="recentClass"></div>`

                    }
                    else {
                        recentPlayer.push({ name: username, tag: tagline, server: data.data.region, puuid: data.data.puuid })
                        // var getPlayers = localStorage.getItem('recentPlayer')
                        // getPlayers.push(`{name: ${username},tag:${tagline},server:${data.data.region},puuid:${data.data.puuid}}`)
                        localStorage.setItem('recentPlayer', JSON.stringify(recentPlayer))
                        window.open(`/profile/riot/${data.data.puuid}/${data.data.region}`, '_self')
                    }
                })
                .catch(error => {
                    const playersWrapper = document.getElementsByClassName('playersWrapper')[0]
                    playersWrapper.innerHTML = ''
                    playersWrapper.innerHTML = `<div class='searchedPlayer'></div><div class='errorSearch'> The Riot Server is Down. Please Try Later </div><div class='MatchingPlayersBox'></div>`

                })
        }
    }
})
let recent = document.getElementsByClassName('recentClass')[0]

recentSearchSpan.addEventListener('click', () => {

    // var errorDivTag=document.getElementsByClassName('errorSearch')[0];
    // errorDivTag.innerHTML=''
    recentPlayerColumn.style.display='flex'
    ErrorColumn.style.display='none';
    searchedPlayerColumn.style.display='none';
    seachedPlayerSideBar.classList.remove('addLeftBorder')
    recentSearchSpan.classList.add('addLeftBorder')
    if (recentPlayer != null) {
        // SearchedPlayerDiv.classList.remove('displayFlex')

        // recent.classList.remove('displayNone')
        
        const uniqueRecentPlayer = Array.from(new Set(recentPlayer.map(JSON.stringify))).map(JSON.parse);
        if(uniqueRecentPlayer.length>1){
            searchboxContainer.classList.add('searchContainerHeight')
        }
        uniqueRecentPlayer.forEach(individual => {
            var MatchingPlayers = document.createElement('div')
            MatchingPlayers.classList.add('MatchingPlayers')
            MatchingPlayers.innerHTML = `<a href='/profile/riot/${individual.puuid}/${individual.server}' onclick="addPlayer('${individual.name}','${individual.tag}','${individual.server}','${individual.puuid}');" ><img src="../assets/images/extras/killbanner__1_-removebg-preview.png" width="40"><span class="textHolder">${individual.name}</span><span class=tagLine>#${individual.tag}</span></a>`
            recent.appendChild(MatchingPlayers)
            console.log(recent)
        })


    }

})
