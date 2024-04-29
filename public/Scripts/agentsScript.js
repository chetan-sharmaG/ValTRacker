let lastScroll = 0;
window.addEventListener('scroll', function() {
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

let prom1 = new Promise((resolve,reject)=>{

    resolve("resolved")
})


prom1.then((a)=>{
    console.log(a);
})


const agents = document.querySelectorAll('.names-container button')

agents.forEach(agent=>{
    agent.addEventListener('click',async()=>{
        if(!agent.classList.contains('active')){
            agents.forEach(a=>{
                a.classList.remove('active')
            })
            agent.classList.add('active')
            // agent.classList.add('activeButton')
            let getAgent = await fetch('/agent/'+agent.getAttribute('agent_name'))
            let response = await getAgent.json()
            console.log(response)
            const agentImage = document.getElementById('agentImage')
            const bio_details = document.getElementsByClassName('bio_details')[0]
            const origin = document.getElementsByClassName('origin')[0]
            agentImage.src = response.fullPortraitV2
            bio_details.innerText = response.description
            origin.innerHTML =`<span>Origin:</span> <img src=${response.nationFlag} width=40><span> ${response.nation}</span>` 
        }
       

    })
})