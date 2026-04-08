var blink_speed = 500; // every 500 == 0.5 second
var t = setInterval(function () {
    var ele = document.getElementById('aich');
    ele.style.visibility = (ele.style.visibility == 'hidden' ? '' : 'hidden');
}, blink_speed);
var t = setInterval(function () {
    var ele2 = document.getElementById('aich2');
    ele2.style.visibility = (ele2.style.visibility == 'hidden' ? '' : 'hidden');
}, blink_speed);