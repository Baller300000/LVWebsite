var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;

function random(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
}

function Ball(size) {
    var $ = this;

    $.xVelocity = random(3, 7);
    $.yVelocity = random(3, 7);

    $.xRandom = Math.random();
    $.yRandom = Math.random();

    if ($.xRandom > 0.5) {
        $.xVelocity = $.xVelocity * -1;
    }
    if ($.yRandom > 0.5) {
        $.yVelocity = $.yVelocity * -1;
    }

    $.x = random(0 + size, canvas.width - size);
    $.y = random(0 + size, canvas.height - size);
    $.w = size;
    $.h = size;
    $.color = 'rgb(' + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
    $.draw = function () {
        $.x += $.xVelocity;
        $.y += $.yVelocity;
        ctx.fillStyle = $.color;
        ctx.strokeStyle = $.color;
        ctx.beginPath();
        ctx.arc($.x, $.y, size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    };

    $.colider = function () {

        if ($.x + $.w > canvas.width) {
            $.xVelocity = $.xVelocity * -1;
        }
        if ($.x < 0 + $.w) {
            $.xVelocity = $.xVelocity * -1;
        }
        if ($.y < 0 + $.h) {
            $.yVelocity = $.yVelocity * -1;
        }
        if ($.y + $.h > canvas.height) {
            $.yVelocity = $.yVelocity * -1;
        }

    }

}
var balls = [
];

var inputBallNumber = document.querySelector('.ballnumber');
var ballNumber = inputBallNumber.value;
var inputBallSize = document.querySelector('.ballsize');
var ballSize = inputBallSize.value;

fillBallsArray(ballNumber, ballSize);

inputBallNumber.addEventListener('change', function (e) {
    ballNumber = inputBallNumber.value;
    balls = [];
    fillBallsArray(ballNumber, ballSize);
});

inputBallSize.addEventListener('change', function (e) {
    ballSize = inputBallSize.value;
    balls = [];
    fillBallsArray(ballNumber, ballSize);
});

function fillBallsArray(ballnumber, ballsize) {
    for (var i = 0; i < ballnumber; i++) {
        balls.push(new Ball(parseInt(ballsize)));
    }
}

function drawBalls(ar) {
    for (var i = 0; i < ar.length; i++) {
        ar[i].colider();
        ar[i].draw();
    }
}
var clear = document.querySelector('.clear');
clear.addEventListener('change', function (e) {
    clearCanvas(clear);
});

function clearCanvas(elem) {
    if (elem.checked === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function game() {
    clearCanvas(clear);
    drawBalls(balls);
    requestAnimationFrame(game);
}
requestAnimationFrame(game);