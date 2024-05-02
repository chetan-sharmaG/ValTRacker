function cron(){
    console.error('Fetch Method');
    setTimeout(async () => {
        try {
            let response = await fetch('/pushData');
            if (response.ok) {
                console.log('Data pushed successfully');
            } else {
                console.error('Failed to push data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, 0); // Delay the execution to make it asynchronous
}

module.exports = cron;