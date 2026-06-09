import { H as Hls } from "./hls.js";

export function initPlayer(src) {
    var video = document.getElementById("main-player");
    var cover = document.querySelector(".player-cover");
    var attached = false;
    var hls = null;

    if (!video || !src) {
        return;
    }

    function attach() {
        if (attached) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }

        attached = true;
    }

    function startPlayback() {
        attach();
        video.controls = true;

        if (cover) {
            cover.classList.add("is-hidden");
        }

        var playback = video.play();
        if (playback && typeof playback.catch === "function") {
            playback.catch(function () {
                video.controls = true;
                if (cover) {
                    cover.classList.remove("is-hidden");
                }
            });
        }
    }

    if (cover) {
        cover.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
        }
    });
}
