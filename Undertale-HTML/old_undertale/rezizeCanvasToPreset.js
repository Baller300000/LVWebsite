function resizeCanvasToPreset() {
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('gm4html5_div_id');
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const resolutions = [
        { w: 1280, h: 720 }, { w: 1920, h: 1080 },
        { w: 2560, h: 1440 }, { w: 3840, h: 2160 }
    ];
    let chosen = resolutions[0];
    for (let r of resolutions) {
        if (screenW >= r.w && screenH >= r.h) chosen = r;
    }
    canvas.width = chosen.w;
    canvas.height = chosen.h;
    canvas.style.width = screenW + 'px';
    canvas.style.height = screenH + 'px';
    container.style.width = screenW + 'px';
    container.style.height = screenH + 'px';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.imageSmoothingEnabled = false;
}

window.addEventListener('load', resizeCanvasToPreset);
window.addEventListener('resize', resizeCanvasToPreset);
window.addEventListener('orientationchange', resizeCanvasToPreset);