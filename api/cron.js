function cron(){
    const now = new Date();

    const options = {
        timeZone: 'Asia/Kolkata', // Set timezone to IST
        hour12: false, // Use 24-hour format
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      
      // Format the date according to IST
      const istDateString = now.toLocaleString('en-IN', options);
      
      console.error(istDateString);
    
}

module.exports = cron;