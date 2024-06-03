import { startMESS, trackingValues, exit, lookForChanges, lookForChangesAndType, updateBackground, updateColor, updateHtml, updateDisplay } from './mess.js';
let prevData;

/**
 * A flat data object, these values will be visible as dynamic values in MESS
 * @type {{ text: string, 
 *          contentColor: string, 
 *          backgroundColor: string,
 *          testBoolean: boolean, 
 *          videoStream: string, 
 *          video: string, 
 *          image: string, 
 *          selector: string, 
 *          exitUrl: string, 
 *          lang: string }}
 */
const obj = {
    text: "",
    contentColor: "#000000",
    backgroundColor: "",
    testBoolean: true,
    videoStream: '',
    video: '',
    image: '',
    selector: '',
    exitUrl: '',
    lang: '',
};

/**
 * This function will handle the dynamic updates in the AD
 * @param {object} data - The data object containing dynamic values
 * 
 * The lookForChanges() function will compare the previous value with the new value and update the target element if the value has changed
 * The lookForChangesAndType() function will compare the previous value with the new value and update the target element if the value has changed and the selector is equal to the type
 * You dont have to use the lookForChanges() and lookForChangesAndType() functions, you can create your own logic to update the DOM elements
 */
const updateDOM = (data) => {
    const header = document.querySelector('.header');
    const button = document.querySelector('.button');
    const bgImage = document.querySelector('.bgImage');
    const body = document.querySelector('body');

    /**
     * Change the text in the header based on the text value
     */
    if (lookForChanges(prevData, data, 'text')) {
        /**
         * Updates the inner HTML of an element to the specified text.
         *
         * @param {HTMLElement} element - The element to update.
         * @param {string} text - The new text content.
         */
        updateHtml(header, data.text);
        header.innerHTML = data.text;
    }

    /**
     * Change the background color of the body based on the background value
     */
    if (lookForChanges(prevData, data, 'backgroundColor')) {
        /**
         * Updates the background color of an HTML element.
         *
         * @param {HTMLElement} element - The element to update.
         * @param {string} color - The new background color.
         */
        updateBackground(body, data.backgroundColor)
    }

    /**
     * Change the color of multiple elements based on the contentColor
     */
    if (lookForChanges(prevData, data, 'contentColor')) {
        /**
         * Updates the inner HTML of an element to the specified color.
         *
         * @param {HTMLElement} element - The element to update.
         * @param {string} color - The new color.
         */
        updateColor(header, data.contentColor);

        /**
         * You dont have to use the prebuilt functions, you can create your own logic to update the DOM elements
         */
        button.style.backgroundColor = data.contentColor;
    }

    /**
     * Show or hide the black circle based on the testBoolean value
     */
    if (lookForChanges(prevData, data, 'testBoolean')) {
        /**
         * Updates the display property of an HTML element to block or none.
         *
         * @param {HTMLElement} element - The element to update.
         * @param {boolean} boolean - Determines whether the element should be displayed or hidden.
         */
        updateDisplay(button, data.testBoolean);
    }

    /**
     * Show or hide the video element based on the obj selector value and start a video stream
     */
    if (lookForChangesAndType(prevData, data, 'videoStream', 'selector', 'stream')) {
        video.style.display = 'block';
        bgImage.style.background = 'none';
        // Start the Streamedby video stream
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

    /**
     * Show or hide the video element based on the obj selector value and start a video without a stream
     */
    if (lookForChangesAndType(prevData, data, 'video', 'selector', 'video')) {
        video.style.display = 'block';
        video.src = data.video;
        video.play();
        bgImage.style.background = 'none';
    }

    /**
     * Show or hide the background image element based on the obj selector value
     */
    if (lookForChangesAndType(prevData, data, 'image', 'selector', 'image')) {
        bgImage.style.background = `url('${data.image}')`;
        bgImage.style.display = 'block';
        video.style.display = 'none';
        video.src = '';
    }

    /**
     * Hide the background image element and the video element based on the obj selector value and display the background color
     */
    if (lookForChangesAndType(prevData, data, 'color', 'selector', 'color')) {
        bgImage.style.display = 'none';
        video.style.display = 'none';
        video.src = '';
    }

    // Set previous data to the current data to prevent unnecessary DOM updates
    prevData = { ...data };
};

/**
 * Event listener for the body click event to handle exit URL navigation
 * @param {MouseEvent} e - The mouse event
 */
document.querySelector('body').addEventListener('click', (e) => {
    exit(e, data.exitUrl, trackingValues);
});

/**
 * Proxy handler to update the DOM when data changes
 */
const handler = {
    set(target, property, value) {
        target[property] = value;
        updateDOM(target);
        return true;
    }
};

/**
 * Proxy object for the data with handler
 */
export const data = new Proxy(obj, handler);

/**
 * Initialize MESS on window load
 */
window.onload = () => {
    startMESS(data);
};
