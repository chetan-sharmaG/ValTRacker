

const select = document.querySelector(".select");
const options_list = document.querySelector(".options-list");
const options = document.querySelectorAll(".option");
const modes = document.querySelectorAll(".mode-holder .mode")

modes.forEach((mode) => {
    mode.addEventListener('click', () => {
        modes.forEach(m => {
            m.classList.remove('active')
        })
        console.error(matchesDetails)
        mode.classList.add('active')
        getData(matchesDetails, currentSeason, mode.getAttribute('mode'))
        updateRankInUI(region, uuid, currentSeason)
    })
})


//show & hide options list
select.addEventListener("click", () => {
    options_list.classList.toggle("active");
    select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
});

//select option
options.forEach((option) => {
    option.addEventListener("click", () => {
        options.forEach((option) => { option.classList.remove('selected') });
        const select = document.querySelector('.select');
        const optionsList = document.querySelector('.options-list');
        select.querySelector("span").innerHTML = option.innerHTML;
        // console.info(option.getAttribute('season'));
        const seasonText = option.innerText; // Retrieve season text
        const seasonValue = option.getAttribute('season'); // Retrieve season value
        const activeMode = document.getElementsByClassName('active')[0]
        getData(matchesDetails, option.getAttribute('season'), activeMode.getAttribute('mode'))
        updateRankInUI(region, uuid, option.getAttribute('season'))
        option.classList.add("selected");
        optionsList.classList.toggle("active");
        select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
    });
});
let matchesDetails = {}
let loadingCounter = 0
let currentSeason = 'e10a6';
let region


document.addEventListener('DOMContentLoaded', async function () {

    // Fetching random facts from DB
    let facts = await fetch('/facts')
        .then(response => {
            return response.text(); // Parse response body as JSON
        })
        .then(data => {
            const fact = document.getElementById('funfact')
            fact.innerText = data
            console.log(data); // Process the parsed JSON data
        })
        .catch(error => {
            const fact = document.getElementById('funfact')
            fact.innerText = 'Running with a gold gun is faster than running with a tactical knife.'
        });

    //Getting the url paths for Puuid and region
    const path = window.location.pathname;
    uuid = path.split('/')[3];
    region = path.split('/')[4];
    console.error(region)
    updateTagsInUI(uuid)
    // getWeapon()
    //Fetching Current Season Data from DB
    let response = await fetch('/currentSeason')
    let season = await response.text()
    currentSeason = season

    //Fetching users lifetime Matches stored in henrik server
    // let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/' + region + '/' + uuid + '?page=1&size=500')
    let a = await fetch(`/${region}/${uuid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // updateTagName
            console.log(data)
            matchesDetails = data
            var currentSeason = 'e10a6'
            getData(data, currentSeason)
            updateRankInUI(region, uuid, currentSeason)
            // updateMatchesBox(data)
        }).catch(error => {
            console.error('error')
            const main = document.getElementsByTagName('main')[0]
            main.innerHTML = ''

        }
        )

    function onDataLoaded() {
        clearInterval(inttime)
        var showData = document.getElementsByClassName('visiblity')
        var loading = document.getElementsByClassName('loadContainer')[0]
        showData[0].style.display = "flex"
        showData[1].style.display = "flex"
        showData[2].style.display = "flex"
        loading.style.display = 'none'
        const butn = document.querySelector('.mode-holder button')
        butn.focus()

    }
    const inttime = setInterval(() => {
        checkDataIsReady(onDataLoaded);
    }, 1000);


    // Assuming the path is like "/users/:userId"
    // getAgentsData()
});


//Updating the Rank Container with the c
async function updateRankInUI(region, uuid, season = currentSeason) {

    let request = fetch(`/rank/${region}/${uuid}`)
        .then(response => response.json())
        .then(response => {
            var bySeason = response.data.by_season
            Object.keys(bySeason).forEach(getseason => {
                if (getseason === season) {
                    var rankImage = document.getElementById('rankImage')
                    var rankName = document.getElementById('rankName')

                    rankImage.src = 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/' + bySeason[getseason].final_rank + '/largeicon.png'
                    rankName.innerText = bySeason[getseason].final_rank_patched
                }
            })
        })
}

//Updating the USerName ,level and tag
async function updateTagsInUI(uuid) {

    let tags = await fetch('/profile/user/updateTags/' + uuid)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            const name = response.data.name
            const tag = response.data.tag
            const lvl = response.data.account_level
            const bannerSrc = response.data.card.small
            const tagElement = document.getElementsByClassName('tagName')[0]
            const levelElement = document.getElementsByClassName('levelDetail')[0]
            const playerCard = document.getElementsByClassName('card-img')[0]
            tagElement.innerHTML = name + '#' + tag
            levelElement.innerHTML = 'Lvl:' + lvl
            playerCard.src = bannerSrc
        }).catch(error => {
            console.error(error)
        })
}
function checkDataIsReady(onDataLoaded) {
    if (loadingCounter != 3) {
        console.error('waiting for data')
    }
    else {
        onDataLoaded()
    }
}
function getMatch(matchid) {
    console.error(matchid)
}
async function updateMatchesBox(data) {
    var root = document.querySelector('.matchesFlex')
    root.innerHTML = ''
    var filteredData = data.map(match1 => {
        var matchData = {
            matchId: match1.meta.id,
            matchMapName: match1.meta.map.name,
            matchStartTime: match1.meta.started_at,
            matchAgentName: match1.stats.character.name,
            matchAgentId: match1.stats.character.id,
            matchKill: match1.stats.kills,
            matchDeath: match1.stats.deaths,
            matchTeam: match1.stats.team,
            matchdidWin: false,
            matchAssist: match1.stats.assists,
            matchteir: match1.stats.tier,
            matchRedScore: match1.teams.red,
            matchBlueScore: match1.teams.blue
        }
        matchData.matchAgentId = matchData.matchAgentId === "ded3520f-4264-bfed-162d-b080e2abccf9" ? '320b2a48-4d9b-a075-30f1-1f93a9b638fa' : matchData.matchAgentId
        var teamwon = matchData.matchRedScore > matchData.matchBlueScore ? 'Red' : 'Blue'
        if (teamwon === matchData.matchTeam)
            matchData.matchdidWin = true

        return matchData
    })

    var groupedMatches = groupMatchesByStartTime(filteredData);
    // Output the grouped matches
    console.warn(groupedMatches)
    Object.keys(groupedMatches).forEach(matchDate => {
        var root = document.querySelector('.matchesFlex')

        const currentDate = new Date();
        const matchDateObj = new Date(matchDate);

        // Check if the date is today
        const isToday = matchDateObj.getDate() === currentDate.getDate() &&
            matchDateObj.getMonth() === currentDate.getMonth() &&
            matchDateObj.getFullYear() === currentDate.getFullYear();

        // Check if the date is yesterday
        const isYesterday = matchDateObj.getDate() === currentDate.getDate() - 1 &&
            matchDateObj.getMonth() === currentDate.getMonth() &&
            matchDateObj.getFullYear() === currentDate.getFullYear();

        let formattedDate;
        if (isToday) {
            formattedDate = 'Today';
        } else if (isYesterday) {
            formattedDate = 'Yesterday';
        } else {
            formattedDate = matchDate;
        }

        const date = document.createElement('div')
        date.classList.add('date');
        date.innerText = formattedDate;
        root.appendChild(date)
        // appendToMobileCOnatiner(date)


        groupedMatches[matchDate].forEach(match => {
            const containerBox = document.createElement('div')
            containerBox.classList.add('containerBox')
            // var lala;
            // let response = await fetch('/encrypt', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(match.matchId)
            // });
            // var lala = await response.json();
            var lala = encryptStudentId(match.matchId)
            // onclick='scrollToNaveen()
            var Bg = match.matchdidWin ? '' : 'lostBg'
            var BarBg = match.matchdidWin ? '' : 'matchLostBar'

            containerBox.innerHTML = `<div class="matchesGrid ${Bg}" data-match=${lala} >
                                    <img class="agent_ffs" src="https://media.valorant-api.com/agents/${match.matchAgentId}/displayicon.png" width="40">
                                    <div class="mapContainer box">
                                        <div class="mapName">${match.matchMapName}</div>
                                        <div class="matchScore"><span>${match.matchRedScore}</span><span>:</span><span>${match.matchBlueScore}</span></div>
                                    </div>
                                    <div class="killsData box">
                                        <div class="kda">K / D / A</div>
                                        <div class="kdaData">${match.matchKill} / ${match.matchDeath} / ${match.matchAssist} </div>
                                    </div>
                                    <img class="teir" src="https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${match.matchteir}/smallicon.png">
                                </div>
                                <div class="veriticalBar ${BarBg}"></div>`;

            root.appendChild(containerBox);
            // appendToMobileCOnatiner(containerBox)
        });
    });
    loadingCounter += 1
}

function appendToMobileCOnatiner(html) {
    var da = document.getElementsByClassName('matchesFlex')[1]
    da.appendChild(html)
}
function encryptStudentId(matchId) {
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
function groupMatchesByStartTime(matches) {
    // Sort the matches based on matchStartTime in descending order
    matches.sort((a, b) => new Date(b.matchStartTime) - new Date(a.matchStartTime));

    // Create an object to hold the grouped matches
    var groupedMatches = {};

    // Loop through each match
    matches.forEach(function (match) {
        // Extract the match start time
        var matchStartTime = new Date(match.matchStartTime).toDateString();

        // If the group for this start time doesn't exist yet, create it
        if (!groupedMatches[matchStartTime]) {
            groupedMatches[matchStartTime] = [];
        }

        // Add the match to the corresponding group
        groupedMatches[matchStartTime].push(match);
    });

    return groupedMatches;
}



async function getData(data, desiredSeason, desiredMode = 'Competitive') {
    let ad = {};
    if (data.length === 0) {
        data = matchesDetails
    }
    let highestKill = 0;
    // console.log(data)
    let filteredData = data.data.filter(item => item.meta.season.short === desiredSeason && item.meta.mode === desiredMode);
    console.info(filteredData)
    updateMatchesBox(filteredData)
    let noOfWins = filteredData.reduce((totalWins, item) => {
        const winningTeam = (item.teams.red > item.teams.blue) ? "Red" : "Blue";
        const presentTeam = item.stats.team;
        const agentSelected = item.stats.character.name;
        const mapName = item.meta.map.name;
        const totalRound = item.teams.red + item.teams.blue
        if (!(agentSelected in ad)) {
            ad[agentSelected] = { 'AgentName': '', 'maps': {}, 'agentId': null, 'headshots': 0, 'bodyshots': 0, 'legshots': 0, 'highKill': 0, 'assists': 0, 'avgDmg': 0, 'win': 0, 'loss': 0, 'matchesPlayed': 0, 'hoursPlayed': 0, 'winPercentage': 0, 'kills': 0, 'TotalDmg': 0, 'deaths': 0, 'kd': 0 };
        }
        if (!(mapName in ad[agentSelected].maps)) {
            ad[agentSelected].maps[mapName] = { 'won': 0 }; // Initialize map if not present
        }
        if (presentTeam === winningTeam) {
            ad[agentSelected].maps[mapName].won += 1; // Increment won count for the map
            ad[agentSelected].win += 1;
        } else {
            ad[agentSelected].loss += 1;
        }
        ad[agentSelected].AgentName = item.stats.character.name
        ad[agentSelected].matchesPlayed += 1;
        ad[agentSelected].hoursPlayed += (totalRound > 15 ? totalRound * 1.8 : totalRound * 1.5)
        ad[agentSelected].winPercentage = ad[agentSelected].win / ad[agentSelected].matchesPlayed * 100
        ad[agentSelected].kills += item.stats.kills
        ad[agentSelected].assists += item.stats.assists
        ad[agentSelected].deaths += item.stats.deaths
        ad[agentSelected].TotalDmg = ad[agentSelected].TotalDmg + (item.stats.damage.made / totalRound)
        ad[agentSelected].avgDmg = ad[agentSelected].TotalDmg / ad[agentSelected].matchesPlayed
        ad[agentSelected].kd = ad[agentSelected].kills / ad[agentSelected].deaths
        highestKill = item.stats.kills > highestKill ? item.stats.kills : highestKill;
        ad[agentSelected].headshots += item.stats.shots.head
        ad[agentSelected].bodyshots += item.stats.shots.body
        ad[agentSelected].legshots += item.stats.shots.leg
        ad[agentSelected].agentId = (item.stats.character.id === 'ded3520f-4264-bfed-162d-b080e2abccf9') ? '320b2a48-4d9b-a075-30f1-1f93a9b638fa' : item.stats.character.id
        // if(item.stats.character.id === 'ded3520f-4264-bfed-162d-b080e2abccf9')
        //     ad[agentSelected].agentId = '320b2a48-4d9b-a075-30f1-1f93a9b638fa'
        // else{
        //     ad[agentSelected].agentId = '320b2a48-4d9b-a075-30f1-1f93a9b638fa'
        // }
        return presentTeam === winningTeam ? totalWins + 1 : totalWins;
    }, 0);
    // let numberOfMatches = filteredData.length;
    getBestMap(ad)
    getStatsData(ad, highestKill)
    let adToArr = Object.keys(ad).map(key => {
        return { agent: key, ...ad[key] }
    })
    adToArr.sort((a, b) => b.kills - a.kills)
    updateTopAgents(adToArr)

}

// let adToArr
async function updateTopAgents(adToArr) {

    if (adToArr.length === 0) {
        alert("No Data Available for the Selected Episode/Season");
    }
    else {


        // Fetch data about the top agent
        let imageHolder = document.getElementsByClassName('bannerImg')[0]
        if (imageHolder) {
            const agent = adToArr[0].AgentName.toLowerCase();
            var src
            // Create a new image element

            if (agent === 'kay/o') {
                src = `https://imgsvc.trackercdn.com/url/max-width(2880),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Fimages%2Fheroes%2Fhero-kayo.jpg%3Fv%3D1/image.jpg`;

            }
            else {
                src = `https://imgsvc.trackercdn.com/url/max-width(2880),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Fimages%2Fheroes%2Fhero-${agent}.jpg%3Fv%3D1/image.jpg`;

            }
            // Set the source of the image

            // Wait for the image to load


            // Set the background image after the image is loaded
            imageHolder.src = src
        } else {
            console.error("No element with class 'img-holder' found.");
        }
        let topAgent = document.getElementsByClassName('nameTime')

        try {
            const agentImgTag = document.getElementById('first_top_img')
            agentImgTag.src = 'https://media.valorant-api.com/agents/' + adToArr[0].agentId + '/fullportrait.png'
            const secondAgent = document.getElementById('second_top_img')
            secondAgent.src = 'https://media.valorant-api.com/agents/' + adToArr[1].agentId + '/fullportrait.png'
            const thirdAgent = document.getElementById('third_top_img')
            thirdAgent.src = 'https://media.valorant-api.com/agents/' + adToArr[2].agentId + '/fullportrait.png'

        }
        catch (error) {
            console.error(error)
            if (adToArr.length < 2) {
                const agentImgTag = document.getElementById('first_top_img')
                agentImgTag.src = 'https://media.valorant-api.com/agents/' + adToArr[0].agentId + '/fullportrait.png'
                const secondAgent = document.getElementById('second_top_img')
                secondAgent.src = 'https://media.valorant-api.com/agents/' + adToArr[1].agentId + '/fullportrait.png'
                const thirdAgent = document.getElementById('third_top_img')
            }
        }


        topAgent.innerHTML = ''
        // const housPlayedAgent0 = convertToHoursMinutes(adToArr[0].hoursPlayed)
        // const housPlayedAgent1 = convertToHoursMinutes(adToArr[1].hoursPlayed)
        // const housPlayedAgent2 = convertToHoursMinutes(adToArr[2].hoursPlayed)

        for (var i = 0; i < 3; i++) {
            const updatedData = `<span>${adToArr[i].agent}</span><span>PLAYED ${convertToHoursMinutes(adToArr[i].hoursPlayed)}</span>`
            topAgent[i].innerHTML = updatedData
        }
        // topAgent[0].innerHTML = updatedData
        // topAgent[1].innerHTML = updatedData
        // topAgent[2].innerHTML = updatedData

        // Update the names of the second and third top agents on the webpage
        let AgentName = document.getElementsByClassName('agent_name')
        let NameTime = document.getElementsByClassName('nameTime')
        AgentName.innerHTML = ''
        const SecondAgent = `<span id="second_top">${adToArr[1].agent}</span>`
        const ThirdAgent = `<span id="third_top">${adToArr[2].agent}</span>`
        AgentName[0].innerHTML = SecondAgent
        AgentName[1].innerHTML = ThirdAgent

        // Update the win percentage of the second and third top agents on the webpage
        let agentWin = document.getElementsByClassName('AgentWin')
        agentWin.innerText = ''
        const SecondAgentWin = adToArr[1].winPercentage.toFixed(1) + '%'
        const ThirdAgentWin = adToArr[2].winPercentage.toFixed(1) + '%'
        agentWin[0].innerText = SecondAgentWin
        agentWin[1].innerText = ThirdAgentWin

        //update the win percentage of the top agent
        const dmg = document.getElementsByClassName('dmgData')
        dmg.innerText = ''
        const kd = document.getElementsByClassName('KdRatio_data')
        kd.innerText = ''
        const winpercent = document.getElementsByClassName('Win_Ratio_data')
        winpercent.innerText = ''
        const tkills = document.getElementsByClassName('abilityCountContainer')
        tkills.innerHTML = ''
        for (var i = 0; i < 3; i++) {
            const headshotspercent = ((adToArr[i].headshots / (adToArr[i].headshots + adToArr[i].bodyshots + adToArr[i].legshots)) * 100).toFixed(1)
            winpercent[i].innerText = adToArr[i].winPercentage.toFixed(1) + '%'
            kd[i].innerText = adToArr[i].kd.toFixed(2)
            dmg[i].innerText = adToArr[i].avgDmg.toFixed(2)
            tkills[i].innerHTML = `<span>${adToArr[i].kills}</span><span>${adToArr[i].assists}</span><span>${headshotspercent}%</span>`

        }
        // winpercent.innerText = adToArr[0].winPercentage.toFixed(1) + '%'

        //update the kd of first 
        // const kd = document.getElementsByClassName('KdRatio_data')
        // kd.innerText = ''


        //update the dmg of firstAgent
        // const dmg = document.getElementsByClassName('dmgData')
        // dmg.innerText = ''

        // dmg.innerText = adToArr[0].avgDmg.toFixed(2)

        //total kills of topAgent
        // const headshotspercent = ((adToArr[0].headshots / (adToArr[0].headshots + adToArr[0].bodyshots + adToArr[0].legshots)) * 100).toFixed(1)
        // const tkills = document.getElementsByClassName('abilityCountContainer')[0]
        // tkills.innerHTML = `<span>${adToArr[0].kills}</span><span>${adToArr[0].assists}</span><span>${headshotspercent}%</span>`

    } loadingCounter += 1
}

function convertToHoursMinutes(num) {
    const hours = Math.floor(num / 60);
    const minutes = Math.round(num % 60); // Round to the nearest minute

    if (hours === 0) {
        return `${minutes}M`;
    } else if (minutes === 0) {
        return `${hours}H`;
    } else {
        return `${hours}H ${minutes}M`;
    }
}
async function getStatsData(ad, highestKill) {

    const statsData = {
        highestKill: highestKill,
        head: 0, body: 0, leg: 0,
        TotalDmg: 0,
        assists: 0,
        totalKills: 0,
        totalDeaths: 0,
        won: 0,
        lost: 0,
        avgDamage: 0,
        totalshots: 0,
        highestKills: 0,
        headpercentage: 0,
        bodypercentage: 0,
        legpercentage: 0,
        higheshTimePlayed: 0,
        agentId: '',
        winPercentage: 0,
        overallkd: 0
        // highestKillsAgent: null
    };

    Object.values(ad).forEach(agentData => {
        statsData.totalKills += agentData.kills;
        statsData.TotalDmg += agentData.TotalDmg;
        statsData.assists += agentData.assists;
        statsData.totalDeaths += agentData.deaths;
        statsData.won += agentData.win;
        statsData.head += agentData.headshots;
        statsData.body += agentData.bodyshots;
        statsData.leg += agentData.legshots;
        statsData.avgDamage += agentData.avgDmg;
        statsData.lost += agentData.loss;
        if (agentData.hoursPlayed > statsData.higheshTimePlayed) {
            statsData.higheshTimePlayed = agentData.hoursPlayed
            statsData.agentId = agentData.agentId
        }
        if (agentData.kills > statsData.highestKills) {
            statsData.highestKills = agentData.kills;
            // statsData.highestKillsAgent = agentData;
        }
    });
    statsData.overallkd = (statsData.totalKills / statsData.totalDeaths).toFixed(1)
    statsData.winPercentage = ((statsData.won / (statsData.won + statsData.lost)) * 100).toFixed(2);
    statsData.avgDamage = (statsData.TotalDmg / (statsData.won + statsData.lost)).toFixed(2);
    statsData.totalshots = statsData.head + statsData.body + statsData.leg;
    statsData.headpercentage = ((statsData.head / statsData.totalshots) * 100).toFixed(2)
    statsData.bodypercentage = (statsData.body / statsData.totalshots) * 100
    statsData.legpercentage = (statsData.leg / statsData.totalshots) * 100
    // Object.values(ad).forEach(agentData=>{
    //     Object.values(agentData).forEach(maps=>{
    //         if(maps.)
    //     })
    // })
    updateStatsUI(statsData)
}
function updateStatsUI(statsData) {

    //updating the UI elements with the correct data from game 
    var pieElement = document.querySelector('.pie');
    const winPercentage = document.getElementById('winPercent')
    const winNumber = document.getElementById('winNumber')
    const lostNumber = document.getElementById('lostNumber')
    const totalkills = document.getElementById('totalkills')
    const totalHead = document.getElementById('totalHead')
    const totalDeath = document.getElementById('totalDeath')
    const overallKd = document.getElementById('overallKd')
    const highestKill = document.getElementById('highestKill')
    const overallDmg = document.getElementById('overallDmg')
    var winperc = statsData.winPercentage
    pieElement.style.setProperty('--p', winperc);
    winPercentage.innerText = winperc + '%'
    winNumber.innerText = statsData.won + ' Wins'
    lostNumber.innerText = statsData.lost + ' Lose'
    totalkills.innerText = statsData.totalKills
    totalHead.innerText = statsData.headpercentage + '%'
    totalDeath.innerText = statsData.totalDeaths
    overallKd.innerText = statsData.overallkd
    highestKill.innerText = statsData.highestKill
    overallDmg.innerText = statsData.avgDamage
    loadingCounter += 1

}
async function getBestMap(ad) {
    let mapWins = {};
    for (const agentName in ad) {
        const agentData = ad[agentName];
        for (const mapName in agentData.maps) {
            const wins = agentData.maps[mapName].won;
            if (!(mapName in mapWins)) {
                mapWins[mapName] = 0;
            }
            mapWins[mapName] += wins;
        }
    }
    let mapWinsArr = Object.keys(mapWins).map(key => {
        return { name: key, win: mapWins[key] }
    })
    mapWinsArr.sort((a, b) => b.win - a.win);
    // console.error(mapWinsArr)


    // console.log(`The map with the highest number of wins is ${mostWinsMap} with ${mostWins} wins.`);

}

async function getWeapon() {

    //     // let a = await fetch('https://api.henrikdev.xyz/valorant/v2/match/b8b2740d-6095-4936-b3aa-cd3775602187')
    //     // let a = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/4838165f-102b-5cc7-a261-616ea821bfcc')
    //     // .then(data=>data.json())
    //     // .then(data=>{

    //     //     // const kills = data.data.kills
    //     //     const kill = data.data
    //     //     console.error(kill)

    //     //     // const result = kills.reduce((acc,cur)=>{

    //     //     //     let userpuuid = cur.killer_puuid
    //     //     //     let damagegun;

    //     //     //     if(userpuuid==='b8b2740d-6095-4936-b3aa-cd3775602187')
    //     //     //     {
    //     //     //         damagegun=cur.damage_weapon_name
    //     //     //         if(userpuuid in acc){
    //     //     //             acc[userpuuid].damagegun+=1;

    //     //     //         }
    //     //     //         else{
    //     //     //             acc[userpuuid][damagegun]=1
    //     //     //         }
    //     //     //     }

    //     //     //     return acc;

    //     //     // },{});
    //     //     const result = kill.reduce((acc, cur) => {

    //     //         let userpuuid = cur.killer_puuid;
    //     //         let damagegun = cur.damage_weapon_name;

    //     //         if (userpuuid === '4838165f-102b-5cc7-a261-616ea821bfcc') {
    //     //             if (acc[userpuuid]) {
    //     //                 if (damagegun in acc[userpuuid]) {
    //     //                     acc[userpuuid][damagegun] += 1;
    //     //                 } else {
    //     //                     acc[userpuuid][damagegun] = 1;
    //     //                 }
    //     //             } else {
    //     //                 acc[userpuuid] = {};
    //     //                 acc[userpuuid][damagegun] = 1;
    //     //             }
    //     //         }

    //     //         return acc;
    //     //     }, {});
    //     //     const b = kill.kills.reduce((acc1,cur1)=>{

    //     //     },{});


    //     //     console.log(b)

    //     // })
    const ab = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/d3a5b563-f19b-5587-987a-36e49effeef5?size=10')
        .then(data => data.json())
        .then(data => {
            const results = data.data.map(match => {
                const kills = match.kills;
                const result = kills.reduce((acc, cur) => {
                    let userpuuid = cur.killer_puuid;
                    let damagegun = cur.damage_weapon_name;
                    // let display_icon= cur.damage_weapon_assets.display_icon
                    console.log(display_icon)
                    if (userpuuid === 'd3a5b563-f19b-5587-987a-36e49effeef5') {
                        if (acc[damagegun]) {
                            acc[damagegun].kills += 1;
                        } else {
                            acc[damagegun] = { kills: 1, display_icon: display_icon };
                        }
                    }

                    return acc;
                }, {});
                return result;
            });

            let totalWeaponCounts = {};
            let maxKills = 0;
            let maxKillsWeapon = '';

            results.forEach(obj => {
                for (let weapon in obj) {
                    if (totalWeaponCounts[weapon]) {
                        totalWeaponCounts[weapon] += obj[weapon].kills;
                    } else {
                        totalWeaponCounts[weapon] = obj[weapon].kills;
                    }

                    if (obj[weapon].kills > maxKills) {
                        maxKills = obj[weapon].kills;
                        maxKillsWeapon = weapon;
                    }
                }
            });

            console.log("Total Kills by each gun:", totalWeaponCounts);
            console.log("Gun with the highest kills:", maxKillsWeapon);
            // console.log("Display Icon URL of the gun with the highest kills:", results[maxKillsWeapon].display_icon);
        });


}

// getWeapon()
let currentSeasonStartDate = '2024-03-25'
let matchIds;
let totalNumberOfMatches = 0;

async function getAllMatches(mode, url) {
    const data = {
        "type": "matchhistory",
        "value": "d3a5b563-f19b-5587-987a-36e49effeef5",
        "region": "ap",
        "queries": "?startIndex=0&endIndex=20&queue=" + mode
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    totalNumberOfMatches = responseData.Total;

    let matches = responseData.History.map(matchid => {

        return checkForSeason(matchid, currentSeasonStartDate)

    });
    let a = roundUpToNextInteger(totalNumberOfMatches);
    matchIds = matches;

    let promises = [];
    for (var i = 1; i < a; i++) {
        const payload = {
            "type": "matchhistory",
            "value": "d3a5b563-f19b-5587-987a-36e49effeef5",
            "region": "ap",
            "queries": "?startIndex=" + (i * 20) + "&endIndex=" + ((i * 20) + 20) + "&queue=competitive"
        };
        promises.push(getNextIndexMatches(url, payload));
    }

    const result = await Promise.all(promises);
    result.forEach(matches => matchIds = matchIds.concat(matches));

    fetchData(matchIds)
}

async function getNextIndexMatches(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    return responseData.History.map(matchid => {
        return checkForSeason(matchid, currentSeasonStartDate)
    });
}

// getAllMatches('competitive', "https://api.henrikdev.xyz/valorant/v1/raw");

function roundUpToNextInteger(value) {
    return Math.ceil(value / 20);
}

function checkForSeason(matchid, timestamp) {
    const timestamp1 = matchid.GameStartTime;
    const date = new Date(timestamp1);
    const ISTDateString = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const targetDate = new Date(currentSeasonStartDate);
    if (date > targetDate) {
        return matchid.MatchID
    } else {
        console.log("The date from the timestamp is on or before March 5, 2024");
    }
}
async function fetchData(arrids) {
    try {
        // Array to store promises for fetching data
        const promises = arrids.map(arrid => fetch(`https://api.henrikdev.xyz/valorant/v2/match/${arrid}`));

        // Wait for all promises to resolve
        const responses = await Promise.all(promises);

        // Extract JSON data from each response
        const responseData = await Promise.all(responses.map(response => response.json()));

        // Process responseData as needed
        console.error(responseData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//  scrollToNaveen()

function closeMatchWindow() {
    const naveenElement = document.getElementsByClassName('matchHighlights')[0];
    const stats = document.getElementsByClassName('season_stats_container')[0]
    const gun = document.getElementsByClassName('top_gun_container')[0]
    const grid = document.getElementsByClassName('grid-container')[0]
    const matches = document.getElementsByClassName('matches_container')[0]
    var body = document.getElementsByTagName('body')[0]
    var section = document.getElementsByClassName('visiblity')[2]
    stats.classList.remove('removeStats')
    gun.classList.remove('removeGuns')
    grid.classList.remove('removeGridRow')
    grid.classList.remove('removeOverFlow')
    body.classList.remove('removeOverFlow')
    section.classList.remove('removeOverFlow')
    matches.classList.remove('matches_container_remove')
    naveenElement.classList.remove('matchHighRemove')
    naveenElement.style.zIndex = '-1'
    const root = document.getElementById('style-4')
    root.innerHTML = ''
    const roundDetailsWrapper = document.createElement('div')
    roundDetailsWrapper.classList.add('roundDetailsWrapper')
    const roundBox = document.createElement('div')
    roundBox.classList.add('roundBox')
}
document.getElementById('closeConatiner').addEventListener('click', () => {

    closeMatchWindow()

})
document.body.addEventListener('keydown', function (e) {

    if (e.key == "Escape") {

        closeMatchWindow()
    }
});
// Attach the event listener to the parent of all .matchesGrid elements


export function getpuuid() {
    return uuid
}

export function getserver() {
    return region
}

