(function () {
  function setupPlayer(container) {
    var video = container.querySelector('video');
    var overlay = container.querySelector('.player-overlay');
    var url = video ? video.getAttribute('data-hls') : '';
    var hls = null;
    var ready = false;

    if (!video || !overlay || !url) {
      return;
    }

    function attach() {
      if (ready) {
        return Promise.resolve();
      }
      ready = true;
      video.setAttribute('controls', 'controls');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        return new Promise(function (resolve) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          hls.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              ready = false;
              overlay.classList.remove('is-hidden');
            }
          });
        });
      }

      video.src = url;
      return Promise.resolve();
    }

    function play() {
      overlay.classList.add('is-hidden');
      attach().then(function () {
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            overlay.classList.remove('is-hidden');
          });
        }
      });
    }

    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
