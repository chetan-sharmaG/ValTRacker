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


async function getWeapon(){

    // let a = await fetch('https://api.henrikdev.xyz/valorant/v2/match/b8b2740d-6095-4936-b3aa-cd3775602187')
    // let a = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/4838165f-102b-5cc7-a261-616ea821bfcc')
    // .then(data=>data.json())
    // .then(data=>{

    //     // const kills = data.data.kills
    //     const kill = data.data
    //     console.error(kill)

    //     // const result = kills.reduce((acc,cur)=>{

    //     //     let userpuuid = cur.killer_puuid
    //     //     let damagegun;
            
    //     //     if(userpuuid==='b8b2740d-6095-4936-b3aa-cd3775602187')
    //     //     {
    //     //         damagegun=cur.damage_weapon_name
    //     //         if(userpuuid in acc){
    //     //             acc[userpuuid].damagegun+=1;

    //     //         }
    //     //         else{
    //     //             acc[userpuuid][damagegun]=1
    //     //         }
    //     //     }
        
    //     //     return acc;

    //     // },{});
    //     const result = kill.reduce((acc, cur) => {

    //         let userpuuid = cur.killer_puuid;
    //         let damagegun = cur.damage_weapon_name;
        
    //         if (userpuuid === '4838165f-102b-5cc7-a261-616ea821bfcc') {
    //             if (acc[userpuuid]) {
    //                 if (damagegun in acc[userpuuid]) {
    //                     acc[userpuuid][damagegun] += 1;
    //                 } else {
    //                     acc[userpuuid][damagegun] = 1;
    //                 }
    //             } else {
    //                 acc[userpuuid] = {};
    //                 acc[userpuuid][damagegun] = 1;
    //             }
    //         }
        
    //         return acc;
    //     }, {});
    //     const b = kill.kills.reduce((acc1,cur1)=>{
           
    //     },{});
        

    //     console.log(b)

    // })
    const a = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/d3a5b563-f19b-5587-987a-36e49effeef5?size=10')
    .then(data => data.json())
    .then(data => {
        const results = data.data.map(match => {
            const kills = match.kills;
            // console.error(kills)
            const result = kills.reduce((acc, cur) => {
                let userpuuid = cur.killer_puuid;
                let damagegun = cur.damage_weapon_name;
                
                if (userpuuid === 'd3a5b563-f19b-5587-987a-36e49effeef5') {
                    if (acc[userpuuid]) {
                        if (damagegun in acc[userpuuid]) {
                            acc[userpuuid][damagegun] += 1;
                            // console.error(acc[userpuuid])
                        } else {
                            acc[userpuuid][damagegun] = 1;
                            // console.error(acc[userpuuid])
                        }
                    } else {
                        acc[userpuuid] = {};
                        acc[userpuuid][damagegun] = 1;
                        
                    }
                }
                
                return acc;
            }, {});
            return result;
        });
        const totalWeaponCounts = {};
        results.forEach(obj => {
            // Iterate over the keys (user IDs) in each object
            for (let userId in obj) {
                // Iterate over the weapons and their counts in each user's object
                for (let weapon in obj[userId]) {
                    // Add the count of each weapon to the totalWeaponCounts object
                    if (totalWeaponCounts[weapon]) {
                        totalWeaponCounts[weapon] += obj[userId][weapon];
                    } else {
                        totalWeaponCounts[weapon] = obj[userId][weapon];
                    }
                }
            }
        });
        
        console.log(totalWeaponCounts);
    });

}

getWeapon()