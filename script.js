import { startMESS, trackingValues, exit } from './mess.js';

let prevData;

// A flat data object, these values will be visible as dynamic values in MESS
const obj = {
    text: "",
    contentColor: "#000000",
    background: "#00ff00",
    testBoolean: true,
    videoStream: '',
    video: '',
    image: '',
    selector: '',
    exitUrl: '',
    lang: '',
};

// This function will handle the dynamic updates of the elements in the AD
const updateDOM = (data) => {
    const header = document.querySelector('.header');
    const button = document.querySelector('.button');
    const bgImage = document.querySelector('.bgImage');
    const body = document.querySelector('body');

    // Change the text in the header based on the text value
    if (prevData?.text !== data?.text) {
        header.innerHTML = data.text;
    }
    if (prevData?.contentColor !== data?.contentColor) {
        header.style.color = data.contentColor;
        button.style.backgroundColor = data.contentColor;
    }

    // Show or hide the black circle based on the testBoolean value
    if (prevData?.testBoolean !== data?.testBoolean) {
        button.style.display = data.testBoolean ? 'block' : 'none';
    }

    // Show or hide the video element based on the selector value and start a video stream
    if ((prevData?.videoStream !== data?.videoStream || prevData?.selector !== data?.selector) && data?.selector.toLowerCase() === 'stream') {
        video.style.display = 'block';
        bgImage.style.background = 'none';
        // Start the video stream
        Streamedby({
            videoElem: video, // Target your video element
            stream: data.videoStream, // Get the video stream id from the data object
            timesToPlay: 3,
            trackImpression: true,
            trackingDetails: {
                c: trackingValues.c + '-stream',
                po: trackingValues.po,
            },
        });
    }

    // Show or hide the video element based on the selector value and start a video without a stream
    if ((prevData?.video !== data?.video || prevData?.selector !== data?.selector) && data?.selector.toLowerCase() === 'video') {
        video.style.display = 'block';
        video.src = data.video;
        video.play();
        bgImage.style.background = 'none';
    }

    // Show or hide the background image element based on the selector value
    if ((prevData?.image !== data?.image || data?.selector !== prevData?.selector) && data?.selector.toLowerCase() === 'image') {
        bgImage.style.background = `url('${data.image}')`;
        bgImage.style.display = 'block';
        video.style.display = 'none';
        video.src = '';
    }

    // Hide the background image element and the video element based on the selector value and display the background color
    if ((data?.selector !== prevData?.selector) && data?.selector.toLowerCase() === 'color') {
        bgImage.style.display = 'none';
        video.style.display = 'none';
        video.src = '';
    }

    // Change the background color of the body based on the background value
    if (prevData?.background !== data?.background) {
        body.style.background = data.background;
    }

    // Set previous data to the current data to prevent unnecessary DOM updates
    prevData = { ...data };
};


document.querySelector('body').addEventListener('click', (e) => {
    exit(e, data.exitUrl, trackingValues);
});

const handler = {
    set(target, property, value) {
        target[property] = value;
        updateDOM(target);
        return true;
    }
};

export const data = new Proxy(obj, handler);

window.onload = () => {
    startMESS(data);
};
