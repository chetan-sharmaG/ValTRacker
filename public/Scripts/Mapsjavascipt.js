let slideindex=1;
showSlides(slideindex);
function plusSlides(n){
    showSlides(slideindex+=n);
}
function showSlides(n){
    let i;
    let slides=document.getElementsByClassName('mySlides');
    var currentSlide = document.getElementById('currentIndex');
    var totalIndex = document.getElementById('totalIndex');
    if(n>slides.length) { slideindex=1}
    if(n<1){slideindex=slides.length}
    for(i=0;i<slides.length;i++){
        slides[i].style.display="none";
    }
    slides[slideindex-1].style.display="block";
    currentSlide.innerText='';
    currentSlide.textContent=slideindex;
    totalIndex.textContent=slides.length;


}

function imagesPopup(mapName){
    var imageContainer = document.getElementById('imagePlayer');
    var nav = document.getElementsByTagName('header')[0];
    if(window.innerWidth<850){
    // imageContainer.style.display="inherit";
    setTimeout(function() {
        console.error('time');
        imageContainer.classList.add('active');
        nav.style.visibility="hidden";
    }, 3000); //
    }else{
        imageContainer.style.display="inherit";
        imageContainer.style.opacity="1";
        console.error('adn');
    }
}

function closeImagePLayer(){
    var imageContainer = document.getElementById('imagePlayer');
    var nav = document.getElementsByTagName('header')[0];
    // imageContainer.style.display="none";
    if(window.innerWidth<850){
        // imageContainer.style.display="inherit";
        imageContainer.classList.remove('active');
        nav.style.visibility="visible";
        }else{
            imageContainer.style.display="none";
            imageContainer.style.opacity="0";
            console.error('adn');
        }
    
}
function makeHidden(element) {

    var ele = document.getElementById(element);
    ele.style.visibility = 'hidden';
}
function makeVisible(element) {
    var ele = document.getElementById(element);
    ele.style.visibility = 'visible';
}
document.getElementById('lotus').addEventListener('mouseenter', function () {
    
    let a= fetch('/post-data').then(data=>data.json()).then(data=>{
        console.error(data)
    })
    zoomToPath('lotus');
    makeHidden('INDIA');
    var dta = document.querySelector('.lc');
    dta.style.visibility = 'visible';
    document.querySelectorAll('.indiaLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
      
    });
    
    document.getElementById('indiaCircle').style.visibility = 'visible';

});
document.getElementById('lotus').addEventListener('mouseleave', function () {
    
    zoomOut();
    makeVisible('INDIA');
    var dta = document.querySelector('.lc');
    dta.style.visibility = 'hidden';
    document.querySelectorAll('.indiaLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    }); 
    document.getElementById('indiaCircle').style.visibility = 'hidden';
});
document.getElementById('bind').addEventListener('mouseenter', function () {
    zoomToPath('bind');
    makeHidden('Morocco');
    var dta = document.querySelector('.bic');
    dta.style.visibility = 'visible';
    document.querySelectorAll('.bindLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
       
    });
    document.getElementById('bindCircle').style.visibility = 'visible';

});
document.getElementById('bind').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('Morocco');
    var dta = document.querySelector('.bic');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.bindLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('bindCircle').style.visibility = 'hidden';
});
document.getElementById('ascent').addEventListener('mouseenter', function () {
    zoomToPath('ascent');
    makeHidden('Italy');
    var dta = document.querySelector('.ac');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.ascentLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('ascentCircle').style.visibility = 'visible';
});
document.getElementById('ascent').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('Italy');
    var dta = document.querySelector('.ac');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.ascentLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('ascentCircle').style.visibility = 'hidden';
});
document.getElementById('haven').addEventListener('mouseenter', function () {
    zoomToPath('haven');
    makeHidden('BHUTAN');
    var dta = document.querySelector('.hc');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.havenLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('havenCircle').style.visibility = 'visible';
});
document.getElementById('haven').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('BHUTAN');
    var dta = document.querySelector('.hc');
    dta.style.visibility = 'hidden';
    document.querySelectorAll('.havenLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
       
    });
    document.getElementById('havenCircle').style.visibility = 'hidden';
});
document.getElementById('breeze').addEventListener('mouseenter', function () {
    zoomToPath('breeze');
    makeHidden('barmuda');
    var dta = document.querySelector('.bc');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.breezeLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('breezeCircle').style.visibility = 'visible';
});
document.getElementById('breeze').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('barmuda');
    var dta = document.querySelector('.bc');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.breezeLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('breezeCircle').style.visibility = 'hidden';
});
document.getElementById('pearl').addEventListener('mouseenter', function () {
    zoomToPath('pearl');
    makeHidden('Portugal');
    var dta = document.querySelector('.pc');
    dta.style.visibility = 'visible';
    document.querySelectorAll('.pearlLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
       
    });
    document.getElementById('pearlCircle').style.visibility = 'visible';
});
document.getElementById('pearl').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('Portugal');
    var dta = document.querySelector('.pc');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.pearlLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('pearlCircle').style.visibility = 'hidden';
});
document.getElementById('icebox').addEventListener('mouseenter', function () {
    zoomToPath('icebox')
    makeHidden('Russia');
    var dta = document.querySelector('.ic');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.iceboxLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('iceboxCircle').style.visibility = 'visible';
});
document.getElementById('icebox').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('Russia');
    var dta = document.querySelector('.ic');
    dta.style.visibility = 'hidden';
    document.querySelectorAll('.iceboxLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
      
    });
    document.getElementById('iceboxCircle').style.visibility = 'hidden';
});
document.getElementById('split').addEventListener('mouseenter', function () {
    zoomToPath('split')
    makeHidden('Tokyo');
    var dta = document.querySelector('.sc');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.splitLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('splitCircle').style.visibility = 'visible';
});
document.getElementById('split').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('Tokyo')
    var dta = document.querySelector('.sc');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.splitLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('splitCircle').style.visibility = 'hidden';
});
document.getElementById('sunset').addEventListener('mouseenter', function () {
    zoomToPath('sunset');
    makeHidden('UsaSunset');
    var dta = document.querySelector('.suc');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.sunsetLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in');
        
    });
    document.getElementById('sunsetCircle').style.visibility = 'visible';
});
document.getElementById('sunset').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('UsaSunset');
    var dta = document.querySelector('.suc');
    dta.style.visibility = 'hidden';
    document.querySelectorAll('.sunsetLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('sunsetCircle').style.visibility = 'hidden';
});
document.getElementById('fracture').addEventListener('mouseenter', function () {
    zoomToPath('fracture');
    makeHidden('UsaFracture');
    var dta = document.querySelector('.fc');
        dta.style.visibility = 'visible';
    document.querySelectorAll('.fractureLine').forEach(function (line) {
        line.style.visibility = 'visible';
        line.classList.add('animate-in'); 
        
    });
    document.getElementById('fractureCircle').style.visibility = 'visible';
});
document.getElementById('fracture').addEventListener('mouseleave', function () {
    zoomOut();
    makeVisible('UsaFracture');
    var dta = document.querySelector('.fc');
        dta.style.visibility = 'hidden';
    document.querySelectorAll('.fractureLine').forEach(function (line) {
        line.style.visibility = 'hidden';
        line.classList.remove('animate-in');
        
    });
    document.getElementById('fractureCircle').style.visibility = 'hidden';
});

// function zoomOut() {
//     // var svg = document.getElementById('map');
//     // svg.setAttribute('viewBox', '-221.46 -221.46 1822.433 911.283');
//     var svg = document.getElementById('map');
//     var currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
//     var defaultViewBox = [-221.46, -221.46, 1822.433, 911.283];

//     // Duration of the animation in milliseconds
//     var duration = 1000;
//     var startTime = null;

//     function animateZoom(timestamp) {
//         if (!startTime) startTime = timestamp;
//         var elapsedTime = timestamp - startTime;
//         var progress = Math.min(elapsedTime / duration, 1);

//         // Apply an ease-in-out function to the progress
//         progress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

//         // Interpolate between the current and default viewBox values
//         var intermediateViewBox = currentViewBox.map(function (start, index) {
//             return start + (defaultViewBox[index] - start) * progress;
//         });

//         svg.setAttribute('viewBox', intermediateViewBox.join(' '));

//         if (progress < 1) {
//             requestAnimationFrame(animateZoom);
//         }
//     }

//     requestAnimationFrame(animateZoom);
// }

// function zoomToPath(location) {
//     var svg = document.getElementById('map');
//     const locations = {
//         lotus: "710.1619873046875 99.5 450 400",
//         haven: "897.1689999999999 80.018 400 400",
//         split: "1107.4270000000001 2.3119999999999976 400 400",
//         icebox: "900.778 -229.626 500 500",
//         bind: "135.18599999999992 -18.741 600 600",
//         pearl: "225.18599999999992 -58.741 500 500",
//         ascent: "421.216 -69.15100000000001 400 400",
//         breeze: "77.405 70.76499999999999 400 400",
//         fracture: "-121.595 -29.235000000000014 500 500",
//         sunset: "-121.595 -29.235000000000014 500 500",
//     };


//     //var viewBoxValue = locations[location] || '';
//     // svg.setAttribute('viewBox', viewBoxValue);
//     // console.error(viewBoxValue);
//     var newViewBoxValue = locations[location] || '';
//     let currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
//     let newViewBox = newViewBoxValue.split(' ').map(Number);

//     // Duration of the animation in milliseconds
//     let duration = 1000;
//     let startTime = null;

//     function animateZoom(timestamp) {
//         if (!startTime) startTime = timestamp;
//         let elapsedTime = timestamp - startTime;

//         // Calculate the progress
//         let progress = Math.min(elapsedTime / duration, 1);

//         // Apply an ease-in-out function to the progress
//         progress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

//         // Interpolate between the current and new viewBox values
//         let intermediateViewBox = currentViewBox.map((start, index) => {
//             return start + (newViewBox[index] - start) * progress;
//         });

//         svg.setAttribute('viewBox', intermediateViewBox.join(' '));

//         if (progress < 1) {
//             requestAnimationFrame(animateZoom);
//         }
//     }

//     requestAnimationFrame(animateZoom);
// }
window.addEventListener('resize', function() {
    var svg = document.querySelector('svg');
    if (window.innerWidth <= 600) {
      svg.setAttribute('viewBox', '710.1619873046875 99.5 40 40');
      console.error(this.window.innerWidth);
    } 
  });
function zoomToPath(location) {
    var svg = document.getElementById('map');
    const locations = {
        lotus: "710.1619873046875 99.5 450 400",
        haven: "897.1689999999999 80.018 400 400",
        split: "1107.4270000000001 2.3119999999999976 400 400",
        icebox: "900.778 -229.626 500 500",
        bind: "135.18599999999992 -18.741 600 600",
        pearl: "225.18599999999992 -58.741 500 500",
        ascent: "421.216 -69.15100000000001 400 400",
        breeze: "77.405 70.76499999999999 400 400",
        fracture: "-121.595 -29.235000000000014 500 500",
        sunset: "-121.595 -29.235000000000014 500 500",
    };

    var newViewBoxValue = locations[location] || '';
    let currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    let newViewBox = newViewBoxValue.split(' ').map(Number);

    // Duration of the animation in milliseconds
    let duration = 1000;
    let startTime = null;

    function animateZoom(timestamp) {
        if (!startTime) startTime = timestamp;
        let elapsedTime = timestamp - startTime;

        // Calculate the progress
        let progress = Math.min(elapsedTime / duration, 1);

        // Apply an ease-in-out function to the progress
        progress = easeInOutQuad(progress);

        // Interpolate between the current and new viewBox values
        let intermediateViewBox = currentViewBox.map((start, index) => {
            return start + (newViewBox[index] - start) * progress;
        });

        svg.setAttribute('viewBox', intermediateViewBox.join(' '));

        if (progress < 1) {
            requestAnimationFrame(animateZoom);
        }
    }

    requestAnimationFrame(animateZoom);
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function zoomOut() {
    var svg = document.getElementById('map');
    var currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    var defaultViewBox = [-221.46, -221.46, 1822.433, 911.283];

    // Duration of the animation in milliseconds
    var duration = 1000;
    var startTime = null;

    function animateZoom(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsedTime = timestamp - startTime;
        var progress = Math.min(elapsedTime / duration, 1);

        // Apply an ease-in-out function to the progress
        progress = easeInOutQuad(progress);

        // Interpolate between the current and default viewBox values
        var intermediateViewBox = currentViewBox.map(function (start, index) {
            return start + (defaultViewBox[index] - start) * progress;
        });

        svg.setAttribute('viewBox', intermediateViewBox.join(' '));

        if (progress < 1) {
            requestAnimationFrame(animateZoom);
        }
    }

    requestAnimationFrame(animateZoom);
}
window.addEventListener('resize', function() {
    
    if (window.innerWidth <= 850) {
      
    } 
  });