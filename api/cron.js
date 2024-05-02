async function cron(){
    let a = await fetch('/pushData')
    console.log(Date.now())
}

module.exports = cron;