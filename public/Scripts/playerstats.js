const select = document.querySelector(".select");
const options_list = document.querySelector(".options-list");
const options = document.querySelectorAll(".option");

//show & hide options list
select.addEventListener("click", () => {
    options_list.classList.toggle("active");
    select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
});

//select option
options.forEach((option) => {
    option.addEventListener("click", () => {
        options.forEach((option) => { option.classList.remove('selected') });
        select.querySelector("span").innerHTML = option.innerHTML;
        option.classList.add("selected");
        options_list.classList.toggle("active");
        select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
    });
});
let agentData
document.addEventListener('DOMContentLoaded', (event) => {
    getData()
    getAgentsData()
});

async function getData() {
    let a = await fetch('https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/ap/4881eeb9-ca4f-539d-a586-cab3c279a829?page=1&size=500&mode=competitive')
        .then(data => data.json())
        .then(data => {
            let ad = {};
            let highestKill = 0;
            let filteredData = data.data.filter(item => item.meta.season.short === "e8a2" && item.meta.mode === 'Competitive');
            let noOfWins = filteredData.reduce((totalWins, item) => {
                const winningTeam = (item.teams.red > item.teams.blue) ? "Red" : "Blue";
                const presentTeam = item.stats.team;
                const agentSelected = item.stats.character.name;
                const mapName = item.meta.map.name;
                const totalRound = item.teams.red + item.teams.blue
                if (!(agentSelected in ad)) {
                    ad[agentSelected] = { 'maps': {}, 'agentId': null, 'headshots': 0, 'bodyshots': 0, 'legshots': 0, 'highKill': 0, 'assists': 0, 'avgDmg': 0, 'win': 0, 'loss': 0, 'matchesPlayed': 0, 'hoursPlayed': 0, 'winPercentage': 0, 'kills': 0, 'TotalDmg': 0, 'deaths': 0, 'kd': 0 };
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
                ad[agentSelected].agentId = item.stats.character.id
                return presentTeam === winningTeam ? totalWins + 1 : totalWins;
            }, 0);
            // let numberOfMatches = filteredData.length;
            getBestMap(ad)
            updateStatsData(ad, highestKill)
            // console.warn(ad)
            let adToArr = Object.keys(ad).map(key => {
                return { agent: key, ...ad[key] }
            })
            adToArr.sort((a, b) => b.kills - a.kills)
            console.warn(adToArr)
            updateTopAgents(adToArr)
        }).catch(e => {
            console.error(e)
        });

}

async function getAgentsData() {

    let a = fetch('https://valorant-api.com/v1/agents')
        .then(data => data.json())
        .then(data => {
            agentData = data
        }).catch(error => {
            console.error(error)
        })
}
async function updateTopAgents(adToArr) {
    // Fetch data about the top agent

    const iterate = agentData.data.map(agent => {
        if (agent.uuid === adToArr[0].agentId) {
            const agentImgTag = document.getElementById('first_top_img')
            agentImgTag.src = agent.bustPortrait
        }
        if (agent.uuid === adToArr[1].agentId) {
            const secondAgent = document.getElementById('second_top_img')
            secondAgent.src = agent.bustPortrait
        }
        if (agent.uuid === adToArr[2].agentId) {
            const thirdAgent = document.getElementById('third_top_img')
            thirdAgent.src = agent.bustPortrait
        }
    })
    // Extract the image URL
    // const imgUrl = data.data.bustPortrait 
    // // Update the image of the top agent on the webpage
    // const agentImgTag = document.getElementsByClassName('top_agent_img')[0]
    // agentImgTag.src = imgUrl


    // Update the name and hours played of the top agent on the webpage
    let topAgent = document.getElementsByClassName('nameTime')[0]
    topAgent.innerHTML = ''
    const housPlayed = convertToHoursMinutes(adToArr[0].hoursPlayed)
    let updatedData = `<span>${adToArr[0].agent}</span><span>PLAYED ${housPlayed}</span>`
    topAgent.innerHTML = updatedData

    // Update the names of the second and third top agents on the webpage
    let AgentName = document.getElementsByClassName('agent_name')
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
    const winpercent = document.getElementsByClassName('Win_Ratio_data')[0]
    winpercent.innerText = ''
    winpercent.innerText = adToArr[0].winPercentage.toFixed(1)

    //update the kd of first 
    const kd = document.getElementsByClassName('KdRatio_data')[0]
    kd.innerText = ''
    kd.innerText = adToArr[0].kd.toFixed(2)

    //update the dmg of firstAgent

    const dmg = document.getElementsByClassName('dmgData')[0]
    dmg.innerText = ''
    dmg.innerText = adToArr[0].avgDmg.toFixed(2)

    //total kills of topAgent
    const headshotspercent = ((adToArr[0].headshots/(adToArr[0].headshots+adToArr[0].bodyshots+adToArr[0].legshots))*100).toFixed(1)
    const tkills = document.getElementsByClassName('abilityCountContainer')[0]
    tkills.innerHTML = `<span>${adToArr[0].kills}</span><span>${adToArr[0].assists}</span><span>${headshotspercent}%</span>`
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
async function updateStatsData(ad, highestKill) {

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
        agentId: ''
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
    statsData.winPercentage = (statsData.won / (statsData.won + statsData.lost)) * 100;
    statsData.avgDamage = statsData.TotalDmg / (statsData.won + statsData.lost);
    statsData.totalshots = statsData.head + statsData.body + statsData.leg;
    statsData.headpercentage = (statsData.head / statsData.totalshots) * 100
    statsData.bodypercentage = (statsData.body / statsData.totalshots) * 100
    statsData.legpercentage = (statsData.leg / statsData.totalshots) * 100
    // Object.values(ad).forEach(agentData=>{
    //     Object.values(agentData).forEach(maps=>{
    //         if(maps.)
    //     })
    // })

    console.error(statsData);
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

// async function getWeapon() {

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
//     const ab = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/d3a5b563-f19b-5587-987a-36e49effeef5?size=10')
//         .then(data => data.json())
//         .then(data => {
//             const results = data.data.map(match => {
//                 const kills = match.kills;
//                 // console.error(kills)
//                 const result = kills.reduce((acc, cur) => {
//                     let userpuuid = cur.killer_puuid;
//                     let damagegun = cur.damage_weapon_name;

//                     if (userpuuid === 'd3a5b563-f19b-5587-987a-36e49effeef5') {
//                         if (acc[userpuuid]) {
//                             if (damagegun in acc[userpuuid]) {
//                                 acc[userpuuid][damagegun] += 1;
//                                 // console.error(acc[userpuuid])
//                             } else {
//                                 acc[userpuuid][damagegun] = 1;
//                                 // console.error(acc[userpuuid])
//                             }
//                         } else {
//                             acc[userpuuid] = {};
//                             acc[userpuuid][damagegun] = 1;

//                         }
//                     }

//                     return acc;
//                 }, {});
//                 return result;
//             });
//             const totalWeaponCounts = {};
//             results.forEach(obj => {
//                 // Iterate over the keys (user IDs) in each object
//                 for (let userId in obj) {
//                     // Iterate over the weapons and their counts in each user's object
//                     for (let weapon in obj[userId]) {
//                         // Add the count of each weapon to the totalWeaponCounts object
//                         if (totalWeaponCounts[weapon]) {
//                             totalWeaponCounts[weapon] += obj[userId][weapon];
//                         } else {
//                             totalWeaponCounts[weapon] = obj[userId][weapon];
//                         }
//                     }
//                 }
//             });

//             console.log(totalWeaponCounts);
//         });

// }

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

    console.log(matchIds);
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