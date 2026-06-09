(function () {
    function setupMoviePlayer(config) {
        const video = document.getElementById(config.videoId);
        const button = document.getElementById(config.buttonId);
        const source = config.source;
        let initialized = false;

        if (!video || !button || !source) {
            return;
        }

        function attachSource() {
            if (initialized) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                initialized = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls();
                hls.loadSource(source);
                hls.attachMedia(video);
                video.hlsInstance = hls;
                initialized = true;
                return;
            }

            video.src = source;
            initialized = true;
        }

        function startPlayback() {
            attachSource();
            button.hidden = true;
            const playRequest = video.play();

            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(function () {
                    button.hidden = false;
                });
            }
        }

        button.addEventListener('click', startPlayback);
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            button.hidden = true;
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.hidden = false;
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
