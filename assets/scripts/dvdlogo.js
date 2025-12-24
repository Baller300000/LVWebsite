const canvas = document.getElementById('dvdCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();


const logo = {
    vx: 3 + Math.random() * 2,
    vy: 3 + Math.random() * 2,
    w: 150,
    h: 0,
    x: 0,
    y: 0
};

const logoImg = new Image();

const today = new Date();
const month = today.getMonth(); //11=Dec
const date = today.getDate();

if (month === 11 && date >= 1 && date <= 30) {
    // Christmas Logic (Dec 20 - 30)
    logoImg.src = 'assets/seasonal/ch.gif';
} else if (month === 9 && date >= 25 && date <= 31) {
    // Halloween Logic (Oct 25 - 31)
    logoImg.src = 'assets/seasonal/spiderweb.avif';
} else if (month === 1 && date === 14) {
    // Valentine's Day (Feb 14)
    logoImg.src = 'assets/images/val.avif';
} else {
    // Default Logic
    logoImg.src = 'assets/images/dvd.avif';
}

logoImg.onload = () => {
    const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
    logo.h = logo.w * aspectRatio;
    centerLogo();
};

function centerLogo() {
    logo.x = (canvas.width - logo.w) / 2;
    logo.y = (canvas.height - logo.h) / 2;
}
window.addEventListener('resize', centerLogo);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (logoImg.complete && logo.h > 0) {
        ctx.drawImage(logoImg, logo.x, logo.y, logo.w, logo.h);
    }

    logo.x += logo.vx;
    logo.y += logo.vy;

    if (logo.x <= 0 || logo.x + logo.w >= canvas.width) logo.vx *= -1;
    if (logo.y <= 0 || logo.y + logo.h >= canvas.height) logo.vy *= -1;

    requestAnimationFrame(draw);
}
draw();
