var blink_speed = 500; // every 500 == 0.5 second, adjust to suit
var t = setInterval(function () {
    var ele = document.getElementById('aich');
    ele.style.visibility = (ele.style.visibility == 'hidden' ? '' : 'hidden');
}, blink_speed);