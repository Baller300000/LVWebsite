(function(){
    // Expose a promise that resolves when the custom loader is finished.
    // Other scripts can await window.loaderReadyPromise to delay game start.
    if (!window.loaderReadyPromise) {
        let resolveLoader;
        window.loaderReadyPromise = new Promise((resolve) => { resolveLoader = resolve; });
        window.__resolveLoaderReady = resolveLoader;
    }

    const video = document.getElementById('loaderVideo');
    if (video) {
        // Ensure it plays only once even if markup had loop attribute
        try { video.loop = false; } catch (e) {}
        video.playbackRate = 1;
    }

    // Try to play a short audio cue alongside the video. Use an available game asset.
    // We'll pick a small music file from undertale_genizy if present.
    const audioSrc = 'undertale_genizy/mus_menu0.ogg';
    let audio = null;
    try {
        audio = new Audio(audioSrc);
        audio.preload = 'auto';
        audio.volume = 1;
        // Attempt to play immediately; browsers may block until a user gesture.
        const tryPlay = () => {
            if (!audio) return Promise.resolve();
            return audio.play().catch((err) => {
                // If play was blocked, wait for first user interaction to resume audio/video
                const resumeHandler = function() {
                    document.removeEventListener('pointerdown', resumeHandler);
                    document.removeEventListener('keydown', resumeHandler);
                    if (audio) audio.play().catch(()=>{});
                    if (video) video.play().catch(()=>{});
                };
                document.addEventListener('pointerdown', resumeHandler, { once: true });
                document.addEventListener('keydown', resumeHandler, { once: true });
            });
        };
        tryPlay();
    } catch (e) {
        audio = null;
    }

    function hideCustomLoader() {
        const loader = document.getElementById('myCustomLoader');
        if (loader) {
            loader.style.transition = 'opacity 0.6s ease';
            loader.style.opacity = '0';
            setTimeout(() => { if (loader) loader.remove(); }, 600);
        }

        // stop audio if playing
        try { if (audio) { audio.pause(); audio.currentTime = 0; } } catch (e) {}

        // resolve the loader-ready promise so the game can start
        if (window.__resolveLoaderReady) {
            try { window.__resolveLoaderReady(); } catch (e) {}
            window.__resolveLoaderReady = null;
        }
    }

    // When video ends, hide loader and resolve
    if (video) {
        // If video has no audio or play is blocked, we still listen for 'ended'
        video.addEventListener('ended', function() {
            hideCustomLoader();
        }, { once: true });

        // If video starts playing and is not looped then also ensure fallback
        video.addEventListener('playing', function() {
            // As a fallback, hide after the video's duration + 500ms
            try {
                const dur = isFinite(video.duration) && video.duration > 0 ? (video.duration * 1000) + 500 : null;
                if (dur) {
                    setTimeout(() => { hideCustomLoader(); }, dur);
                }
            } catch (e) {}
        }, { once: true });
    }

    // Fallback timeout: ensure loader doesn't block forever (31s)
    setTimeout(() => {
        hideCustomLoader();
    }, 31000);
})();