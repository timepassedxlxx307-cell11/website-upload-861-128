(function () {
    function createPlayer(videoId, overlayId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var loaded = false;
        var hls = null;

        if (!video || !streamUrl) {
            return;
        }

        function load() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            load();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        video.addEventListener('emptied', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
                hls = null;
            }
            loaded = false;
        });
    }

    window.SitePlayers = {
        init: createPlayer
    };
})();
