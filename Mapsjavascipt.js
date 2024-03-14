document.getElementById('lotus').addEventListener('mouseenter', function () {
    zoomToPath('lotus');
    document.getElementById('indiaCircle').style.visibility = 'visible';

});
document.getElementById('lotus').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('indiaCircle').style.visibility = 'hidden';
});
document.getElementById('bind').addEventListener('mouseenter', function () {
    zoomToPath('bind');
    document.getElementById('bindCircle').style.visibility = 'visible';

});
document.getElementById('bind').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('bindCircle').style.visibility = 'hidden';
});
document.getElementById('ascent').addEventListener('mouseenter', function () {
    zoomToPath('ascent');
    document.getElementById('ascentCircle').style.visibility = 'visible';
});
document.getElementById('ascent').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('ascentCircle').style.visibility = 'hidden';
});
document.getElementById('haven').addEventListener('mouseenter', function () {
    zoomToPath('haven');
    document.getElementById('havenCircle').style.visibility = 'visible';
});
document.getElementById('haven').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('havenCircle').style.visibility = 'hidden';
});
document.getElementById('breeze').addEventListener('mouseenter', function () {
    zoomToPath('breeze');
    document.getElementById('breezeCircle').style.visibility = 'visible';
});
document.getElementById('breeze').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('breezeCircle').style.visibility = 'hidden';
});
document.getElementById('pearl').addEventListener('mouseenter', function () {
    zoomToPath('pearl');
    document.getElementById('pearlCircle').style.visibility = 'visible';
});
document.getElementById('pearl').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('pearlCircle').style.visibility = 'hidden';
});
document.getElementById('icebox').addEventListener('mouseenter', function () {
    zoomToPath('icebox')
    document.getElementById('iceboxCircle').style.visibility = 'visible';
});
document.getElementById('icebox').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('iceboxCircle').style.visibility = 'hidden';
});
document.getElementById('split').addEventListener('mouseenter', function () {
    zoomToPath('split')
    document.getElementById('splitCircle').style.visibility = 'visible';
});
document.getElementById('split').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('splitCircle').style.visibility = 'hidden';
});
document.getElementById('sunset').addEventListener('mouseenter', function () {
    zoomToPath('sunset')
    document.getElementById('sunsetCircle').style.visibility = 'visible';
});
document.getElementById('sunset').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('sunsetCircle').style.visibility = 'hidden';
});
document.getElementById('fracture').addEventListener('mouseenter', function () {
    zoomToPath('fracture')
    document.getElementById('fractureCircle').style.visibility = 'visible';
});
document.getElementById('fracture').addEventListener('mouseleave', function () {
    zoomOut();
    document.getElementById('fractureCircle').style.visibility = 'hidden';
});

function zoomOut() {
    // var svg = document.getElementById('map');
    // svg.setAttribute('viewBox', '-221.46 -221.46 1822.433 911.283');
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
        progress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

        // Interpolate between the current and default viewBox values
        var intermediateViewBox = currentViewBox.map(function(start, index) {
            return start + (defaultViewBox[index] - start) * progress;
        });

        svg.setAttribute('viewBox', intermediateViewBox.join(' '));

        if (progress < 1) {
            requestAnimationFrame(animateZoom);
        }
    }

    requestAnimationFrame(animateZoom);
}

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


    //var viewBoxValue = locations[location] || '';
    // svg.setAttribute('viewBox', viewBoxValue);
    // console.error(viewBoxValue);
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
        progress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

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
