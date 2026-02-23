function updateDateImage() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    let image = '/assets/images/happy.gif'; // Default image

    // Valentine's Day (February 14)
    if (month === 2 && date === 14) {
        image = '/assets/seasonal/val.avif';
    }
    // April Fools (April 1)
    else if (month === 4 && date === 1) {
        image = '/assets/seasonal/teapot.avif';
    }
    // Halloween (October 31)
    else if (month === 10 && date === 31) {
        image = '/assets/seasonal/spiderweb.avif';
    }
    // Christmas (December 1-30)
    else if (month === 12 && date >= 1 && date <= 30) {
        image = '/assets/seasonal/ch.gif';
    }
    // Birthday :3 (June 6)
    else if (month === 10 && date === 3) {
        image = '/assets/images/boi.jpg';
    }
    // im kinda a furry

    document.getElementById('dateImage').src = image;
}

function handleDateImageClick() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    // April Fools redirect
    if (month === 4 && date === 1) {
        window.location.href = '/main/seasonal/aprilfools.html';
    }
    // Christmas redirect (December 1-30)
    if (month === 12 && date >= 1 && date <= 30) {
        window.location.href = '/main/seasonal/christmas.html';
    }
    // Birthday redirect (June 6)
    if (month === 10 && date === 3) {
        window.location.href = '/main/seasonal/birthday.html';
    }
}

updateDateImage();
document.getElementById('dateImage').addEventListener('click', handleDateImageClick);