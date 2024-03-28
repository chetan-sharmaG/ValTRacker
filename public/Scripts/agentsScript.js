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