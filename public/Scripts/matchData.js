
import { getpuuid,getserver  } from "./playerstats.js";
// import { getserver } from "./playerstats.js";
let loadingCounter = 0
document.querySelector('.matchesFlex').addEventListener('click', (event) => {
    // Check if the clicked element has the .matchesGrid class
    if (event.target.closest('.matchesGrid')) {
        var body = document.getElementsByTagName('body')[0]
        var section = document.getElementsByClassName('visiblity')[2]
        var header = document.getElementsByClassName('headerContainer')[0]
        var mainbody = document.getElementsByClassName('mainContainer')[0]
        var loadAnimation = document.getElementsByClassName('lds-circle')[0]
        var loadMessage = document.getElementsByClassName('loaderMessage')[0]
        header.style.display = 'none'
        mainbody.style.display = 'none'
        loadAnimation.style.display = 'inline-block'
        loadMessage.style.display = 'block'
        body.classList.add('removeOverFlow')
        section.classList.add('removeOverFlow')
        const naveenElement = document.getElementsByClassName('matchHighlights')[0];
        const stats = document.getElementsByClassName('season_stats_container')[0]
        const gun = document.getElementsByClassName('top_gun_container')[0]
        const matches = document.getElementsByClassName('matches_container')[0]
        const grid = document.getElementsByClassName('grid-container')[0]
        stats.classList.add('removeStats')
        gun.classList.add('removeGuns')
        matches.classList.add('matches_container_remove')
        grid.classList.add('removeGridRow')
        grid.classList.add('removeOverFlow')
        naveenElement.classList.add('matchHighRemove')
        naveenElement.style.zIndex = '1'
        naveenElement.scrollIntoView({ behavior: 'smooth', 'block': 'center', inline: "nearest" });

        var matchId = event.target.closest('.matchesGrid').getAttribute('data-match');
        var id = decryptMatchId(matchId);

        loadMatchData(id);
    }
});


function decryptMatchId(encryptedId) {
    const shift = 3; // Shift value used for encryption
    let decryptedId = "";
    for (let i = 0; i < encryptedId.length; i++) {
        let charCode = encryptedId.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            decryptedId += String.fromCharCode((charCode - 65 - shift + 26) % 26 + 65);
        } else if (charCode >= 97 && charCode <= 122) {
            decryptedId += String.fromCharCode((charCode - 97 - shift + 26) % 26 + 97);
        } else {
            decryptedId += encryptedId.charAt(i);
        }
    }

    return decryptedId;
} let globalResponse
let totalRounds = 0
let firstBloods = [];
// loadMatchData('0056293a-99a9-40c0-be29-f77aacb8c09e')
async function loadMatchData(matchId) {

    let matchCall =await  fetch('/riot/profile/user/match/' + matchId)
        .then(response => response.json())
        .then(response => {
            globalResponse = response
            let roundsInfo = globalResponse.data.rounds;
            for (const round of roundsInfo) {
                let firstBlood = null;
                round.player_stats.forEach((player) => {
                    if (!player.kill_events) return;
                    player.kill_events.forEach((kill) => {
                        if (
                            !firstBlood ||
                            kill.kill_time_in_round < firstBlood?.kill_time_in_round
                        )
                            firstBlood = kill;
                    });
                });
                firstBloods.push(firstBlood);
            }
            updateHeader(response)
            totalRounds = (response.data.teams.red.rounds_won + response.data.teams.blue.rounds_won)
             updateRoundCount(response)
            updateStatsTeamARed(response)
            updateStatsTeamBlue(response)
            function onDataLoaded() {
                clearInterval(inttime)
                var header = document.getElementsByClassName('headerContainer')[0]
                var mainbody = document.getElementsByClassName('mainContainer')[0]
                var loadAnimation = document.getElementsByClassName('lds-circle')[0]
                var loadMessage = document.getElementsByClassName('loaderMessage')[0]
                header.style.display = 'flex'
                mainbody.style.display = 'flex'
                loadAnimation.style.display = 'none'
                loadMessage.style.display = 'none'
                loadingCounter = 0
                const butn = document.querySelector('.mode-holder button')
                butn.focus()
                // const naveenElement = document.getElementsByClassName('matchHighlights')[0];
                // naveenElement.scrollIntoView({ behavior: 'smooth' });
            }
            const inttime = setInterval(() => {
                checkDataIsReady(onDataLoaded);
            }, 1000);
        })
}
async function updateHeader(response) {
    //Getting Data From API

    const mapName = response.data.metadata.map
    const teamA = response.data.teams.red.rounds_won
    const teamB = response.data.teams.blue.rounds_won
    const gameTimestamp = response.data.metadata.game_start_patched
    const gameLength = response.data.metadata.game_length
    const allPlayersTierArr = response.data.players.all_players
    //Getting the tags to update values



    const mapNameTag = document.getElementById('mapid')
    const TeamAScoreTag = document.getElementById('teamAScore')
    const TeamBScoreTag = document.getElementById('teamBScore')
    const gameDateTag = document.getElementsByClassName('timestamp')[0]
    const gameLengthTag = document.getElementsByClassName('gameLength')[0]
    const averageRankTag = document.getElementsByClassName('avgRank')[0]
    const averageRankImg = document.getElementsByClassName('avgrankImg')[0]

    mapNameTag.innerText = mapName
    TeamAScoreTag.innerText = teamA
    TeamBScoreTag.innerText = teamB
    gameDateTag.innerText = timestampConversion(gameTimestamp)
    gameLengthTag.innerText = secondsToMinutes(gameLength)
    var TierData = await PlayersAverageTier(allPlayersTierArr)

    averageRankTag.innerText = TierData.tierName
    averageRankImg.src = TierData.tierImg
    loadingCounter += 1
}

function timestampConversion(dateString) {
    var date = new Date(dateString);
    var newFormat = date.toLocaleString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });

    return newFormat

}

function secondsToMinutes(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var formattedTime = minutes + 'm ' + remainingSeconds + 's'
    return formattedTime
}
async function PlayersAverageTier(Tiers) {
    var sum = 0
    Tiers.forEach(tier => {
        sum += tier.currenttier
    })

    var AverageTierName = ''
    var AverageTierImg = ''
    var avgTier = Math.floor(sum / Tiers.length)
    
    let competitiveTiers = fetch('https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04')
        .then(response => response.json())
        .then(tierResponse => {
            tierResponse.data.tiers.forEach(tier => {
                if (tier.tier === avgTier) {
                    AverageTierName = tier.tierName
                    AverageTierImg = tier.largeIcon
                }
            })
            var tierData = { tierName: AverageTierName, tierImg: AverageTierImg }
            return tierData
        })

    return competitiveTiers

}

async function updateStatsTeamARed(response) {

    var redSortedData = getTeamData(response.data.players.red)
    var party = allPlayerParty(response.data.players.red, 'red')
    var TierData = await PlayersAverageTier(response.data.players.red)

    const root = document.getElementById('style-4')
    // root.innerHTML = ''
    var grid = document.createElement('div')
    grid.classList.add('mc-grid')
    var header1 = ` <div class="Firstheader"></div>
        <div class="secondRow"></div>
        <div class="forthRow"></div>
        <!-- headings names -->
        <div class="name-Column headerColor"><span>Team
            A</span><span>&#125900;</span><span>Avg.Rank:</span><span class="TeamAvgRank"><img class="TeamAvgRankImg"
                src=${TierData.tierImg}
                width="20">${TierData.tierName}</span></div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="acs-Column headerColor ">ACS <div class="tooltip">Average Combat Score</div>
        </div>
        <div class="kill-Column headerColor">K <div class="tooltip">Kills</div></div>
        <div class="death-Column headerColor">D <div class="tooltip">Deaths</div></div>
        <div class="assist-Column headerColor">A <div class="tooltip">Assists</div></div>
        <div class="killdif-Column headerColor">+/- <div class="tooltip">Kill Difference</div></div>
        <div class="kd-Column headerColor">K/D <div class="tooltip">Kill/Death Ratio</div></div>
        <div class="dda-Column headerColor">DD&Delta;<div class="tooltip">Average Damanage Delta per Round</div></div>
        <div class="adr-Column headerColor">ADR<div class="tooltip">Average Damage per Round</div></div>
        <div class="Headshot-Column headerColor">HS%<div class="tooltip">Headshot Percentage</div></div>
        <div class="firstkill-Column headerColor">FK<div class="tooltip">First Kills</div></div>
        <div class="firstdeath-Column headerColor">FD<div class="tooltip">First Deaths</div></div>
        <div class="multikill-Column headerColor">MK<div class="tooltip">Multi Kills</div></div>`

    redSortedData.forEach((player, index) => {

        var partyName = ''
       
       
        Object.entries(party).forEach(([key, array]) => {
            if (array.includes(player.puuid)) {
                
                partyName = key
            }
        });

        const fk = countFirstBloodsByName(player.puuid)
        const fd = countFirstDeathBloodsByName(player.puuid)
        const ace = didAce(player.puuid)
        const isSame = player.puuid === getpuuid()
        const redFont = player.stats.killdifference < 0 ? 'fontRed' : ''
        const fontchange = player.stats.kd < 1 ? 'fontRed' : ''
        const ddachange = player.stats.dda < 0 ? 'fontRed' : ''
        const region = getserver()
        const backgroundHighlight = isSame ? "backgroundHighlight" : ''
        var playerData = `<div class="playerBox${index + 1} ${backgroundHighlight}">
            <div class="partyIndicator ${partyName}"></div>
            <img src=${player.assets.agent.small}
                width="40">
            <div class="nameLevelWrapper">
                <div class="NameAndTag">
                   <a href="/profile/riot/${player.puuid}/${region}"> ${player.name} <span class="tag"> #${player.tag}</a></span>
                </div>
                <div class="PLayerlvl">
                    Level:${player.level}
                </div>
            </div>
        </div>
        <div class="p${index + 1}rank border">
            <div class="flexWrapper">
                <img src="https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${player.currenttier}/largeicon.png"
                    width="35">
            </div>

        </div>
        <div class="p${index + 1}acs white border acsbg${index + 1}">
            <div class="flexWrapper">${player.stats.avgCombatScore}</div>
        </div>
        <div class="p${index + 1}kills white border">
            <div class="flexWrapper">${player.stats.kills}</div>
        </div>
        <div class="p${index + 1}deaths white border">
            <div class="flexWrapper">${player.stats.deaths}</div>
        </div>
        <div class="p${index + 1}assists white border">
            <div class="flexWrapper">${player.stats.assists}</div>
        </div>
        <div class="p${index + 1}kiffdif yellow border ">
            <div class="flexWrapper ${redFont}">${player.stats.killdifference}</div>
        </div>
        <div class="p${index + 1}kd yellow border " >
            <div class="flexWrapper ${fontchange}">${player.stats.kd}</div>
        </div>
        <div class="p${index + 1}dda yellow border ">
            <div class="flexWrapper ${ddachange}">${player.stats.dda}</div>
        </div>
        <div class="p${index + 1}adr white border">
            <div class="flexWrapper">${player.stats.adr}</div>
        </div>
        <div class="p${index + 1}headshot white border">
            <div class="flexWrapper">${player.stats.headshot}%</div>
        </div>
        <div class="p${index + 1}fk white border">
            <div class="flexWrapper">${fk}</div>
        </div>
        <div class="p${index + 1}fd white border">
            <div class="flexWrapper">${fd}</div>
        </div>
        <div class="p${index + 1}mk white border">
            <div class="flexWrapper">${ace}</div>
        </div>`
        header1 += playerData
    })

    grid.innerHTML = header1


    root.appendChild(grid);
    loadingCounter += 1
    // root.appendChild(grid2);
    // const teamARankImg = document.getElementsByClassName('TeamAvgRank')[0]
    // const teamBRankImg = document.getElementsByClassName('TeamAvgRank')[1]
    // const teamAAverageTier =await  PlayersAverageTier(response.data.players.red)
    // const teamBAverageTier =await PlayersAverageTier(response.data.players.blue)
    // teamARankImg.innerText=teamAAverageTier.tierName
    // teamBRankImg.innerText=teamBAverageTier.tierName

}
async function updateStatsTeamBlue(response) {
    var blueSortedData = getTeamData(response.data.players.blue)
    var party = allPlayerParty(response.data.players.blue, 'blue')
    const root = document.getElementById('style-4')
    var grid2 = document.createElement('div')
    var TierData = await PlayersAverageTier(response.data.players.blue)
    
    grid2.classList.add('mc-grid')
    var header2 = ` <div class="Firstheader teamB"></div>
        <div class="secondRow"></div>
        <div class="forthRow"></div>
       
        <div class="name-Column headerColor"><span>Team
            B</span><span>&#125900;</span><span>Avg.Rank:</span><span class="TeamAvgRank"><img class="TeamAvgRankImg"
                src=${TierData.tierImg}
                width="20">${TierData.tierName}</span></div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="acs-Column headerColor ">ACS <div class="tooltip">Average Combat Score</div>
        </div>
        <div class="kill-Column headerColor">K <div class="tooltip">Kills</div></div>
        <div class="death-Column headerColor">D <div class="tooltip">Deaths</div></div>
        <div class="assist-Column headerColor">A <div class="tooltip">Assists</div></div>
        <div class="killdif-Column headerColor">+/- <div class="tooltip">Kill Difference</div></div>
        <div class="kd-Column headerColor">K/D <div class="tooltip">Kill/Death Ratio</div></div>
        <div class="dda-Column headerColor">DD&Delta;<div class="tooltip">Average Damanage Delta per Round</div></div>
        <div class="adr-Column headerColor">ADR<div class="tooltip">Average Damage per Round</div></div>
        <div class="Headshot-Column headerColor">HS%<div class="tooltip">Headshot Percentage</div></div>
        <div class="firstkill-Column headerColor">FK<div class="tooltip">First Kills</div></div>
        <div class="firstdeath-Column headerColor">FD<div class="tooltip">First Deaths</div></div>
        <div class="multikill-Column headerColor">MK<div class="tooltip">Multi Kills</div></div>`
    blueSortedData.forEach((player, index) => {
        var partyName = ''

        Object.entries(party).forEach(([key, array]) => {
            if (array.includes(player.puuid)) {
                partyName = key
            }
        });
        const fk = countFirstBloodsByName(player.puuid)
        const fd = countFirstDeathBloodsByName(player.puuid)
        const ace = didAce(player.puuid)
        const region = getserver()
        const isSame = player.puuid === getpuuid()
        const backgroundHighlight = isSame ? "backgroundHighlight" : ''
        const redFont = player.stats.killdifference < 0 ? 'fontRed' : ''
        const fontchange = player.stats.kd < 1 ? 'fontRed' : ''
        const ddachange = player.stats.dda < 0 ? 'fontRed' : ''
        var playerData = `<div class="playerBox${index + 1} ${backgroundHighlight}">
                <div class="partyIndicator ${partyName}"></div>
                <img src=${player.assets.agent.small}
                    width="40">
                <div class="nameLevelWrapper">
                    <div class="NameAndTag">
                    <a href="/profile/riot/${player.puuid}/${region}"> ${player.name} <span class="tag"> #${player.tag}</a></span>
                    </div>
                    <div class="PLayerlvl">
                        Level:${player.level}
                    </div>
                </div>
            </div>
            <div class="p${index + 1}rank border">
                <div class="flexWrapper">
                    <img src="https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${player.currenttier}/largeicon.png"
                        width="35">
                </div>
    
            </div>
            <div class="p${index + 1}acs white border acsbg${index + 1}">
            <div class="flexWrapper">${player.stats.avgCombatScore}</div>
        </div>
        <div class="p${index + 1}kills white border">
            <div class="flexWrapper">${player.stats.kills}</div>
        </div>
        <div class="p${index + 1}deaths white border">
            <div class="flexWrapper">${player.stats.deaths}</div>
        </div>
        <div class="p${index + 1}assists white border">
            <div class="flexWrapper">${player.stats.assists}</div>
        </div>
        <div class="p${index + 1}kiffdif yellow border ">
            <div class="flexWrapper ${redFont}">${player.stats.killdifference}</div>
        </div>
        <div class="p${index + 1}kd yellow border ">
            <div class="flexWrapper ${fontchange}">${player.stats.kd}</div>
        </div>
        <div class="p${index + 1}dda yellow border ">
            <div class="flexWrapper ${ddachange}">${player.stats.dda}</div>
        </div>
        <div class="p${index + 1}adr white border">
            <div class="flexWrapper">${player.stats.adr}</div>
        </div>
        <div class="p${index + 1}headshot white border">
            <div class="flexWrapper">${player.stats.headshot}%</div>
        </div>
        <div class="p${index + 1}fk white border">
            <div class="flexWrapper">${fk}</div>
        </div>
        <div class="p${index + 1}fd white border">
            <div class="flexWrapper">${fd}</div>
        </div>
        <div class="p${index + 1}mk white border">
            <div class="flexWrapper">${ace}</div>
        </div>`
        header2 += playerData
    })

    grid2.innerHTML = header2
    root.appendChild(grid2);
    loadingCounter += 1

}
function checkDataIsReady(onDataLoaded) {
    if (loadingCounter != 3) {
        console.error('waiting for data')
    }
    else {
        onDataLoaded()
    }
}
function getTeamData(response) {

    var Team = response
    // var teamSortedData = {}


    var calcutatedPlayerData = Team.map(player => {
        var teamSortedData = {
            puuid: null,
            name: null,
            tag: null,
            team: null,
            level: null,
            character: null,
            currenttier: null,
            party_id: null,
            inParty: null,
            assets: {
                card: {
                    small: null
                },
                agent: {
                    small: null
                }
            },
            stats: {
                avgCombatScore: null,
                kills: null,
                deaths: null,
                assists: null,
                headshot: null,
                killdifference: null,
                kd: null,
                dda: null,
                adr: null,
                firstKill: null,
                firstDeath: null,
                Ace: null
            }
        }
        teamSortedData.puuid = player.puuid
        teamSortedData.name = player.name
        teamSortedData.tag = player.tag
        teamSortedData.team = player.team
        teamSortedData.level = player.level
        teamSortedData.character = player.character
        teamSortedData.currenttier = player.currenttier
        teamSortedData.party_id = player.party_id
        teamSortedData.assets.card.small = player.assets.card.small
        teamSortedData.assets.agent.small = player.assets.agent.small
        teamSortedData.stats.avgCombatScore = Math.round(player.stats.score / totalRounds)
        teamSortedData.stats.kills = player.stats.kills
        teamSortedData.stats.deaths = player.stats.deaths
        teamSortedData.stats.assists = player.stats.assists
        var killdiff = player.stats.kills - player.stats.deaths
        if (killdiff >= 0)
            killdiff = '+' + killdiff
        teamSortedData.stats.killdifference = killdiff
        teamSortedData.stats.headshot = Math.round(((player.stats.headshots / (player.stats.headshots + player.stats.bodyshots + player.stats.legshots)) * 100))
        teamSortedData.stats.kd = (teamSortedData.stats.kills / teamSortedData.stats.deaths).toFixed(1)
        var dda = Math.round((player.damage_made - player.damage_received) / totalRounds)
        if (dda >= 0)
            dda = '+' + dda
        teamSortedData.stats.dda = dda
        teamSortedData.stats.adr = (player.damage_made / totalRounds).toFixed(1)

        return teamSortedData
    })
    calcutatedPlayerData.sort((a, b) => b.stats.avgCombatScore - a.stats.avgCombatScore)
    return calcutatedPlayerData
}



function countFirstBloodsByName(puuid) {
    return firstBloods.filter(
        (firstBlood) => firstBlood?.killer_puuid === puuid
    ).length;
}
function didAce(puuid) {
    var ace = 0
    const rounds = globalResponse.data.rounds
    for (const round of rounds)
        round.player_stats.forEach((player) => {
            if (player.player_puuid === puuid) {
                if (player.kills > 2) {
                    ace += 1
                }
            }
        })
    return ace
    // return firstBloods.filter((firstBlood) => firstBlood?.killer_puuid === puuid && firstBlood?.kills === 5).length

}
function allPlayerParty(response, team) {

    const allPlayers = response
    const partyInfo = {};
    allPlayers.forEach(player => {
        // Check if the player's party_id already exists in the partyInfo object
        if (partyInfo.hasOwnProperty(player.party_id)) {
            // If the party_id exists, push the player's puuid to the corresponding party array
            partyInfo[player.party_id].push(player.puuid);
        } else {
            // If the party_id doesn't exist, create a new entry with the party_id as key and an array containing the player's puuid as value
            partyInfo[player.party_id] = [player.puuid];
        }
    });

    var p = 1
    Object.keys(partyInfo).forEach((partyId, index) => {
        if (partyInfo[partyId].length === 1) {
            delete partyInfo[partyId];
        } else {
            partyInfo[`${team}party${p}`] = partyInfo[partyId];
            delete partyInfo[partyId];
            p += 1
        }

    });

    return partyInfo
}
function countFirstDeathBloodsByName(puuid) {
    return firstBloods.filter(
        (firstBlood) => firstBlood?.victim_puuid === puuid
    ).length;
}
async function updateRoundCount(response) {
    const root = document.getElementById('style-4');
    const roundDetailsWrapper = document.createElement('div');
    roundDetailsWrapper.classList.add('roundDetailsWrapper');
    const roundBox = document.createElement('div');
    roundBox.classList.add('roundBox');
    var roundData = `<div class="columnWrapper">
        <span class='inlineBox'>Team A <span class='TeamAScoreRounds'>${response.data.teams.red.rounds_won}</span></span>
        <span class='inlineBox'>Team B <span class='TeamBScoreRounds'>${response.data.teams.blue.rounds_won}</span></span>
    </div>`;
    response.data.rounds.forEach((round, index) => {
        var endtype;
        if (round.winning_team === 'Red') {
            if (round.end_type === 'Eliminated') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Feliminationwin1.png/image.png';
                roundData += `<div class="columnWrapper">
                            <div class="tooltip">Average Combat Score</div>
                            <img src=${endtype} width=25>
                            <span class='dot'>•</span><span class='roundCount'>${index + 1}</span></div>`;
            }
            else if (round.end_type === 'Bomb defused') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Fdiffusewin1.png/image.png';
                roundData += `<div class="columnWrapper">
                <div class="tooltip">Average Combat Score</div>
                    <img src=${endtype} width=25>
                    <span class='dot'>•</span><span class='roundCount'>${index + 1}</span></div>`;
            }
            else if (round.end_type === 'Round timer expired') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftimewin1.png/image.png';
                roundData += `<div class="columnWrapper">
                <div class="tooltip">Average Combat Score</div>
                    <img src=${endtype} width=25>
                    <span class='dot'>•</span><span class='roundCount'>${index + 1}</span></div>`;
            }
        }
        else {
            if (round.end_type === 'Eliminated') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Feliminationloss1.png/image.png';
                roundData += `<div class="columnWrapper">
                            <span class='dot'>•</span>
                            
                            <img src=${endtype} width=25><span class='roundCount'>${index + 1}</span></div>`;
            }
            else if (round.end_type === 'Bomb defused') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Fdiffuseloss1.png/image.png';
                roundData += `<div class="columnWrapper">
                    <span class='dot'>•</span>
                    <img src=${endtype} width=25><span class='roundCount'>${index + 1}</span></div>`;
            }
            else if (round.end_type === 'Round timer expired') {
                endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftimeloss1.png/image.png';
                roundData += `<div class="columnWrapper">
                <span class='dot' >•</span><img src=${endtype} width=25>
                    <span class='roundCount'>${index + 1}</span></div>`;
            }
        }
    });
    // console.log(roundData);
    roundBox.innerHTML = roundData;
    roundDetailsWrapper.appendChild(roundBox);
    root.appendChild(roundDetailsWrapper);
}

// async function updateRoundCount(response) {
//     const root = document.getElementById('style-4')
//     const roundDetailsWrapper = document.createElement('div')
//     roundDetailsWrapper.classList.add('roundDetailsWrapper')
//     const roundBox = document.createElement('div')
//    roundBox.classList.add('roundBox')
//     var roundData = `<div class="columnWrapper">
//         <span>Team A</span>
//         <span>Team B</span>
//     </div>`
//     response.data.rounds.forEach((round, index) => {
//         var endtype;
//         if (round.winning_team === 'Red') {
//             if (round.end_type === 'Eliminated') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Feliminationwin1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                             <img src=${endtype} width=15>
//                             <span>•</span><span>${index + 1}</span></div>`
//             }
//             else if (round.end_type == 'Bomb defused') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Fdiffusewin1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                     <img src=${endtype} width=15>
//                     <span>•</span><span>${index + 1}</span></div>`
//             }
//             else if (round.end_type == 'Round timer expired') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftimewin1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                     <img src=${endtype} width=15>
//                     <span>•</span><span>${index + 1}</span></div>`
//             }
//         }
//         else {
//             if (round.end_type === 'Eliminated') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Feliminationloss1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                             <span>•</span>
//                             <img src=${endtype} width=15><span>${index + 1}</span></div>`
//             }
//             else if (round.end_type == 'Bomb defused') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Fdiffuseloss1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                     <span>•</span>
//                     <img src=${endtype} width=15><span>${index + 1}</span></div>`
//             }
//             else if (round.end_type == 'Round timer expired') {
//                 endtype = 'https://imgsvc.trackercdn.com/url/max-width(36),quality(66)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftimeloss1.png/image.png'
//                 roundData += `<div class="columnWrapper">
//                 <span>•</span><img src=${endtype} width=15>
//                     <span>${index + 1}</span></div>`
//             }
//         }
//     })
//     console.log(roundData)
//     roundBox.innerHTML=roundData
//     roundDetailsWrapper.innerHTML = roundBox
//     root.appendChild(roundDetailsWrapper)
// }