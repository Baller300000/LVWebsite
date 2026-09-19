(function (w, d) {
    w._siData = w._siData || [];
    w.statInside = function () { w._siData.push(arguments); };

    function loadAnalytics() {
        var script = d.createElement('script');
        script.async = true;
        script.setAttribute('data-statinside-id', 37);
        script.src = 'https://statinside.com/counter.js';
        d.head.appendChild(script);
    }

    if ('requestIdleCallback' in w) {
        w.requestIdleCallback(loadAnalytics, { timeout: 3000 });
    } else {
        w.setTimeout(loadAnalytics, 2000);
    }
})(window, document);