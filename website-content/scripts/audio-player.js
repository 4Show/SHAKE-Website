document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("[data-shake-audio-player]")) {
        return;
    }

    const scriptUrl = document.currentScript?.src
        || new URL("../scripts/audio-player.js", document.baseURI).href;
    const tracks = [
        { title: "Break It to You", path: "../media/audio/break-it-to-you.wav" },
        { title: "Hollon Ceej & 10", path: "../media/audio/hollon-ceej-and-10.wav" }
    ];
    const audio = document.createElement("audio");
    audio.dataset.shakeAudioPlayer = "";
    audio.hidden = true;
    audio.preload = "none";
    audio.muted = true;
    audio.src = new URL(tracks[0].path, scriptUrl).href;
    audio.setAttribute("aria-label", "SHAKE music playlist");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "shake-audio-toggle";
    button.setAttribute("aria-label", "Unmute SHAKE music");
    button.setAttribute("aria-pressed", "false");

    const icon = document.createElement("span");
    icon.className = "shake-audio-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "♫";

    const label = document.createElement("span");
    label.className = "shake-audio-label";
    label.textContent = "Sound off";
    button.append(icon, label);
    document.body.append(audio, button);

    let trackIndex = 0;
    const updateButton = () => {
        if (audio.paused) {
            label.textContent = "Play music";
            button.setAttribute("aria-label", "Play SHAKE music");
            button.setAttribute("aria-pressed", "false");
        } else if (audio.muted) {
            label.textContent = "Sound off";
            button.setAttribute("aria-label", `Unmute ${tracks[trackIndex].title}`);
            button.setAttribute("aria-pressed", "false");
        } else {
            label.textContent = "Mute music";
            button.setAttribute("aria-label", `Mute ${tracks[trackIndex].title}`);
            button.setAttribute("aria-pressed", "true");
        }
    };

    button.addEventListener("click", () => {
        if (audio.paused) {
            audio.muted = false;
            audio.play().catch((error) => {
                console.error("SHAKE music could not be played:", error);
                updateButton();
            });
            return;
        }

        audio.muted = !audio.muted;
        updateButton();
    });

    audio.addEventListener("play", updateButton);
    audio.addEventListener("volumechange", updateButton);
    audio.addEventListener("pause", updateButton);
    audio.addEventListener("ended", () => {
        trackIndex = (trackIndex + 1) % tracks.length;
        audio.src = new URL(tracks[trackIndex].path, scriptUrl).href;
        audio.play().catch((error) => {
            console.error(`SHAKE playlist track "${tracks[trackIndex].title}" could not be played:`, error);
            updateButton();
        });
    });
    audio.addEventListener("error", () => {
        console.error(`SHAKE playlist track "${tracks[trackIndex].title}" failed to load.`);
        updateButton();
    });

    audio.play().catch((error) => {
        console.warn("SHAKE music autoplay was unavailable:", error);
        updateButton();
    });
});
