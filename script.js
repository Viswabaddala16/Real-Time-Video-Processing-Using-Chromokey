let video, video1, c_out, c_temp, context_out, context_temp;

function init() {
    video = document.getElementById("video");
    video.addEventListener("loadedmetadata", setupCanvas);

    video1 = document.createElement("video");
    video1.src = "./Videos/SeaBackground.mp4";
    video1.muted = true;
    video1.autoplay = true;
    video1.loop = true;
    video1.addEventListener("canplay", () => {
        video.play();
    });

    c_out = document.getElementById("output-canvas");
    context_out = c_out.getContext("2d");
}

function setupCanvas() {
    c_temp = document.createElement("canvas");
    c_temp.width = video.videoWidth;
    c_temp.height = video.videoHeight;
    context_temp = c_temp.getContext("2d");

    video.addEventListener("play", computeFrame);
}

function computeFrame() {
    if (video.paused || video.ended) {
        return;
    }
    
    context_temp.clearRect(0, 0, c_temp.width, c_temp.height);
    context_temp.drawImage(video, 0, 0, c_temp.width, c_temp.height);
    let frame = context_temp.getImageData(0, 0, c_temp.width, c_temp.height);

    // Define the green screen color (RGB: 102, 221, 10)
    let greenR = 102;
    let greenG = 221;
    let greenB = 10;
    let tolerance = 50;

    // Draw the background video onto the canvas
    context_temp.drawImage(video1, 0, 0, c_temp.width, c_temp.height);

    // Get the pixel data of the background video
    let frame1 = context_temp.getImageData(0, 0, c_temp.width, c_temp.height);
    let length = frame.data.length;
    console.log(length);

    // Loop through each pixel
    for (let i = 0; i < length; i += 4) {
        let r = frame.data[i];
        let g = frame.data[i + 1];
        let b = frame.data[i + 2];

        // Check if the pixel color is within the tolerance range of the green screen color
        if (
            r >= greenR - tolerance && r <= greenR + tolerance &&
            g >= greenG - tolerance && g <= greenG + tolerance &&
            b >= greenB - tolerance && b <= greenB + tolerance
        ) {
            // Replace the green screen area with the corresponding pixel from the background video
            frame.data[i] = frame1.data[i];
            frame.data[i + 1] = frame1.data[i + 1];
            frame.data[i + 2] = frame1.data[i + 2];
        }
    }

    context_out.putImageData(frame, 0, 0);
    requestAnimationFrame(computeFrame);
}

document.addEventListener("DOMContentLoaded", init);
