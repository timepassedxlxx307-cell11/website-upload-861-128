const players = new Map();

async function prepare(video, src) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    return null;
  }
  const module = await import('./hls-vendor.js');
  const Hls = module.H || module.default;
  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    return hls;
  }
  video.src = src;
  return null;
}

export function setupPlayer(videoId, src) {
  const video = document.getElementById(videoId);
  if (!video || !src) {
    return;
  }
  const shell = video.closest('.player-shell');
  const cover = shell ? shell.querySelector('.player-cover') : null;
  const ready = prepare(video, src).then(function (hls) {
    if (hls) {
      players.set(videoId, hls);
    }
  }).catch(function () {
    video.src = src;
  });
  async function start() {
    await ready;
    if (shell) {
      shell.classList.add('is-playing');
    }
    video.controls = true;
    const action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {});
    }
  }
  if (cover) {
    cover.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (!shell || !shell.classList.contains('is-playing')) {
      start();
    }
  });
}

window.addEventListener('beforeunload', function () {
  players.forEach(function (hls) {
    hls.destroy();
  });
  players.clear();
});
