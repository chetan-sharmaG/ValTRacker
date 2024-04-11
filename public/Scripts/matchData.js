
import { getpuuid } from "./playerstats.js";
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
        naveenElement.scrollIntoView({ behavior: 'smooth' });

        var matchId = event.target.closest('.matchesGrid').getAttribute('data-match');
        var id = decryptMatchId(matchId);
        console.log('insdie');
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
    console.log('h2')
    return decryptedId;
}
let totalRounds = 0
// loadMatchData('0056293a-99a9-40c0-be29-f77aacb8c09e')
async function loadMatchData(matchId) {

    let matchCall = fetch('https://api.henrikdev.xyz/valorant/v2/match/' + matchId)
        .then(response => response.json())
        .then(response => {

            updateHeader(response)
            totalRounds = (response.data.teams.red.rounds_won + response.data.teams.blue.rounds_won)
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
    console.log(newFormat)
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
    var avgTier = Math.floor(sum / 10)
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
    console.error(redSortedData)
    console.error(response.data.players.red)

    const root = document.getElementById('style-4')
    root.innerHTML = ''
    var grid = document.createElement('div')
    grid.classList.add('mc-grid')
    var grid2 = document.createElement('div')
    grid2.classList.add('mc-grid')
    var header1 = ` <div class="Firstheader"></div>
        <div class="secondRow"></div>
        <div class="forthRow"></div>
        <!-- headings names -->
        <div class="name-Column headerColor"><span>Team
            A</span><span>&#128900;</span><span>Avg.Rank:</span><span class="TeamAvgRank"><img class="TeamAvgRankImg"
                src="https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/20/largeicon.png"
                width="20">Platinum</span></div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="acs-Column headerColor ">ACS <div class="tooltip">I am a tooltip!</div>
        </div>
        <div class="kill-Column headerColor">K </div>
        <div class="death-Column headerColor">D </div>
        <div class="assist-Column headerColor">A </div>
        <div class="killdif-Column headerColor">+/- </div>
        <div class="kd-Column headerColor">K/D </div>
        <div class="dda-Column headerColor">DD&Delta;</div>
        <div class="adr-Column headerColor">ADR</div>
        <div class="Headshot-Column headerColor">HS%</div>
        <div class="firstkill-Column headerColor">FK</div>
        <div class="firstdeath-Column headerColor">FD</div>
        <div class="multikill-Column headerColor">MK</div>`

    redSortedData.forEach((player, index) => {
        const isSame = player.puuid === getpuuid()
        console.log(getpuuid())
        const backgroundHighlight = isSame ? "backgroundHighlight" : ''
        var playerData = `<div class="playerBox${index + 1} ${backgroundHighlight}">
            <div class="partyIndicator"></div>
            <img src=${player.assets.agent.small}
                width="40">
            <div class="nameLevelWrapper">
                <div class="NameAndTag">
                    ${player.name} <span class="tag"> #${player.tag}</span>
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
        <div class="p${index + 1}acs white border">
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
        <div class="p${index + 1}kiffdif yellow border">
            <div class="flexWrapper">${player.stats.killdifference}</div>
        </div>
        <div class="p${index + 1}kd yellow border">
            <div class="flexWrapper">${player.stats.kd}</div>
        </div>
        <div class="p${index + 1}dda yellow border">
            <div class="flexWrapper">${player.stats.dda}</div>
        </div>
        <div class="p${index + 1}adr white border">
            <div class="flexWrapper">${player.stats.adr}</div>
        </div>
        <div class="p${index + 1}headshot white border">
            <div class="flexWrapper">${player.stats.headshot}</div>
        </div>
        <div class="p${index + 1}fk white border">
            <div class="flexWrapper">NA</div>
        </div>
        <div class="p${index + 1}fd white border">
            <div class="flexWrapper">NA</div>
        </div>
        <div class="p${index + 1}mk white border">
            <div class="flexWrapper">NA</div>
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
    const root = document.getElementById('style-4')
    var grid2 = document.createElement('div')
    grid2.classList.add('mc-grid')
    var header2 = ` <div class="Firstheader teamB"></div>
        <div class="secondRow"></div>
        <div class="forthRow"></div>
       
        <div class="name-Column headerColor"><span>Team
            B</span><span>&#128900;</span><span>Avg.Rank:</span><span class="TeamAvgRank"><img class="TeamAvgRankImg"
                src="https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/20/largeicon.png"
                width="20">Platinum</span></div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="matchRank-Column headerColor">Match Rank</div>
        <div class="acs-Column headerColor ">ACS <div class="tooltip">I am a tooltip!</div>
        </div>
        <div class="kill-Column headerColor">K </div>
        <div class="death-Column headerColor">D </div>
        <div class="assist-Column headerColor">A </div>
        <div class="killdif-Column headerColor">+/- </div>
        <div class="kd-Column headerColor">K/D </div>
        <div class="dda-Column headerColor">DD&Delta;</div>
        <div class="adr-Column headerColor">ADR</div>
        <div class="Headshot-Column headerColor">HS%</div>
        <div class="firstkill-Column headerColor">FK</div>
        <div class="firstdeath-Column headerColor">FD</div>
        <div class="multikill-Column headerColor">MK</div>`
    blueSortedData.forEach((player, index) => {
        const isSame = player.puuid === getpuuid()
        console.log(getpuuid())
        const backgroundHighlight = isSame ? "backgroundHighlight" : ''
        var playerData = `<div class="playerBox${index + 1} ${backgroundHighlight}">
                <div class="partyIndicator"></div>
                <img src=${player.assets.agent.small}
                    width="40">
                <div class="nameLevelWrapper">
                    <div class="NameAndTag">
                        ${player.name} <span class="tag"> #${player.tag}</span>
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
            <div class="p${index + 1}acs white border">
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
        <div class="p${index + 1}kiffdif yellow border">
            <div class="flexWrapper">${player.stats.killdifference}</div>
        </div>
        <div class="p${index + 1}kd yellow border">
            <div class="flexWrapper">${player.stats.kd}</div>
        </div>
        <div class="p${index + 1}dda yellow border">
            <div class="flexWrapper">${player.stats.dda}</div>
        </div>
        <div class="p${index + 1}adr white border">
            <div class="flexWrapper">${player.stats.adr}</div>
        </div>
        <div class="p${index + 1}headshot white border">
            <div class="flexWrapper">${player.stats.headshot}</div>
        </div>
        <div class="p${index + 1}fk white border">
            <div class="flexWrapper">NA</div>
        </div>
        <div class="p${index + 1}fd white border">
            <div class="flexWrapper">NA</div>
        </div>
        <div class="p${index + 1}mk white border">
            <div class="flexWrapper">NA</div>
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
    console.error(calcutatedPlayerData)
    return calcutatedPlayerData
}   
