var matches = document.querySelectorAll('.matchesGrid')
let matchData
matches.forEach(match => {
    match.addEventListener('click', () => {
        var matchId = match.getAttribute('data-match')
        loadMatchData(matchId)
    })
})
loadMatchData('0056293a-99a9-40c0-be29-f77aacb8c09e')
async function loadMatchData(matchId) {

    let matchCall = fetch('https://api.henrikdev.xyz/valorant/v2/match/' + matchId)
        .then(response => response.json())
        .then(response => {

            updateHeader(response)
            // updateStats(response)

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
}
async function PlayersAverageTier(Tiers) {
    var sum = 0
    Tiers.forEach(tier => {
        sum += tier.currenttier
    })

    var AverageTierName = ''
    var AverageTierImg = ''
    var avgTier = Math.floor(sum / 10)
    let competitiveTiers =  fetch('https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04')
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