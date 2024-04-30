let lastScroll = 0;
window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;
    var buttons = document.querySelectorAll('.agent-about');
    if (currentScroll > lastScroll) {
        // Scrolling down
        buttons.forEach(button => {
            button.classList.remove('move-down');
            button.classList.add('move-up');
        });
    } else {
        // Scrolling up
        buttons.forEach(button => {
            button.classList.remove('move-up');
            button.classList.add('move-down');
        });
    }

    // Update lastScroll position
    lastScroll = currentScroll;
});

let prom1 = new Promise((resolve, reject) => {

    resolve("resolved")
})


prom1.then((a) => {
    console.log(a);
})

document.addEventListener('DOMContentLoaded', async function () {
    const path = window.location.pathname;
    var brim = document.getElementsByClassName('agent')[0]
    
    brim.classList.add('active')
    updateAgent('Brimstone')
  
})
async function updateAgent(agentName){
    let getAgent = await fetch('/agentData/' + agentName)
    let response = await getAgent.json()
    console.log(response)
    const agentImage = document.getElementById('agentImage')
    const bio_details = document.getElementsByClassName('bio_details')[0]
    const origin = document.getElementsByClassName('origin')[0]
    const imgagent = document.getElementsByClassName('img-agent')[0]
    const role = document.getElementsByClassName('role')[0]
    const agentNumber = document.getElementsByClassName('agent-number')[0]
    const AgentNameTag = document.getElementsByClassName('AgentName')[0]
    const abilityIcons = document.querySelectorAll('.wrapper-icons img')
    agentImage.src = response.fullPortraitV2
    bio_details.innerText = response.description
    imgagent.src = response.displayIcon
    AgentNameTag.innerText=response.displayName.toUpperCase()
    origin.innerHTML = `<span>Origin:</span> <img src=${response.nationFlag} width=40><span> ${response.nation}</span>`
    agentNumber.innerText = `Agent Number: ${response.agentNumber}`
    role.innerHTML = `<img class="roleIcon"
    src=${response.role.displayIcon}
    width="15"> ${response.role.displayName}`
    

    abilityQ = response.abilities.find(ability => ability.slot === 'Ability1')
    abilityE = response.abilities.find(ability => ability.slot === 'Ability2')
    abilityC = response.abilities.find(ability => ability.slot === 'Grenade')
    abilityX = response.abilities.find(ability => ability.slot === 'Ultimate')
    // console.log(abilityE)
    abilityIcons[0].src = response.abilities.find(ability => ability.slot === 'Ability1').displayIcon;
    abilityIcons[1].src = response.abilities.find(ability => ability.slot === 'Ability2').displayIcon;
    abilityIcons[2].src = response.abilities.find(ability => ability.slot === 'Grenade').displayIcon;
    abilityIcons[3].src = response.abilities.find(ability => ability.slot === 'Ultimate').displayIcon;


    abilityName = document.querySelector('.abilities-description-wrapper h1')
    abilityQVideo = document.getElementById('abiltyVideo').getElementsByTagName('source')[0];
    abilityQVideo.src = abilityQ.abilityDemo;
    videoPlayer = document.getElementById('abiltyVideo');
    videoPlayer.load();
    videoPlayer.play();
    abilityName.innerText = `Q - ${abilityQ.displayName}`

    abilityDesc = document.getElementsByClassName('abilityDesc')[0]
    abilityDesc.innerText = abilityQ.description
}
const agents = document.querySelectorAll('.names-container button')
let abilityQ
let abilityE
let abilityC
let abilityX
let abilityName
let abilityQVideo
let videoPlayer
let abilityDesc
agents.forEach(agent => {
    agent.addEventListener('click', async () => {
        if (!agent.classList.contains('active')) {
            agents.forEach(a => {
                a.classList.remove('active')
            })
            agent.classList.add('active')
            // agent.classList.add('activeButton')
            updateAgent(agent.getAttribute('agent_name'))
           
        }


    })
})

const abilitiesButton = document.querySelectorAll('.wrapper-icons')

abilitiesButton.forEach((abi) => {
    abi.addEventListener('click', () => {
        abilitiesButton.forEach(a => {
            a.classList.remove('active1')
        })
        abi.classList.add('active1')
        var abilityKey = abi.getAttribute('key')

        // var abilty = 'ability' + abilityKey
        // abilityQVideo.src = abilty.abilityDemo;
        // abilityName.innerText = `${abilityKey} - ${abilty.displayName}`
        // abilityDesc.innerText = abilty.description
        // abilityName = document.querySelector('.abilities-description-wrapper h1')
        // abilityQVideo = document.getElementById('abiltyVideo').getElementsByTagName('source')[0];
        if(abilityKey==='Q'){
            abilityQVideo.src = abilityQ.abilityDemo;
            abilityName.innerText = `Q - ${abilityQ.displayName}`

            // abilityDesc = document.getElementsByClassName('abilityDesc')[0]
            abilityDesc.innerText = abilityQ.description

        }else if(abilityKey==='E'){
            abilityQVideo.src = abilityE.abilityDemo;
            abilityName.innerText = `E - ${abilityE.displayName}`

            // abilityDesc = document.getElementsByClassName('abilityDesc')[0]
            abilityDesc.innerText = abilityE.description
        }else if(abilityKey==='C'){
            abilityQVideo.src = abilityC.abilityDemo;
            abilityName.innerText = `C - ${abilityC.displayName}`

            // abilityDesc = document.getElementsByClassName('abilityDesc')[0]
            abilityDesc.innerText = abilityC.description
        }else if(abilityKey==='X'){
            abilityQVideo.src = abilityX.abilityDemo;
            abilityName.innerText = `X - ${abilityQ.displayName}`

            // abilityDesc = document.getElementsByClassName('abilityDesc')[0]
            abilityDesc.innerText = abilityX.description
        }


        // videoPlayer = document.getElementById('abiltyVideo');
        videoPlayer.load();
        videoPlayer.play();
        // abilityName.innerText = `Q - ${abilityQ.displayName}`

        // // abilityDesc = document.getElementsByClassName('abilityDesc')[0]
        // abilityDesc.innerText = abilityQ.description

    })
})