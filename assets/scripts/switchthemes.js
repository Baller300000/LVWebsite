const btn = document.getElementById('toggle');
let night = false;
btn.onclick = () => {
    night = !night;
    if (night) {
        document.body.style.background = "url('assets/images/night-sky.avif') repeat center center fixed";
        document.body.style.backgroundRepeat = "repeat";
        document.body.style.backgroundSize = "auto";
        btn.textContent = "Switch Theme";
    } else {
        document.body.style.background = "url('assets/images/sky.avif') repeat center center fixed";
        document.body.style.backgroundRepeat = "repeat";
        document.body.style.backgroundSize = "auto";
        btn.textContent = "Switch Theme";
    }
};