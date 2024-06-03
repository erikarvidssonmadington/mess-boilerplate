import { data } from "./script.js";
let waitingForProps = false;
export let trackingValues = {
    c: `wonderus`, // example
    po: "WDUS", // example
    triggered: {
        exit: false,
        impression: false,
    },
};

function track(ev, c, po) {
    if (trackingValues.triggered[ev] != undefined) {
        trackingValues.triggered[ev] = true;
    }

    if (
        window.name != "mess-style" && window.name != "mess-dev"
    ) {
        if (c && po) {
            var url =
                "https://track.streamedby.com?c=" +
                c +
                "&count=" +
                ev +
                "&ord=" +
                Date.now() +
                "&po=" +
                po.toUpperCase();
            if (window.fetch) {
                fetch(url);
            } else {
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        } else {
            return;
        }
    }
}

export const startMESS = () => {
    window.addEventListener("message", async (e) => {
        try {
            if (e.data.messMessage == "MESS_PROP_UPDATE") {
                if (
                    window.name == "mess-style" ||
                    (window.name == "mess-dev" && waitingForProps)
                ) {
                    data[e.data.prop] = e.data.propValue;
                }
            }
        } catch (e) {
            // Eh...
        }
    });
    if (typeof window.dynamicContent == "undefined") {
        window.dynamicContent = {};
    }

    if (window.name == "props-handler") {
        new MESSenger({
            data: Object.assign({ ...data }),
        });

        return true
    } else if (window.name == "mess-style" || window.name == "mess-dev") {
        waitingForProps = true;
        window.top.postMessage(
            {
                messMessage: "MESS_CLIENT_HERE",
                windowName: window.name,
            },
            "*"
        );

        return true
    } else {
        if (Object.keys(window.dynamicContent).length !== 0) {
            const newPO = `${trackingValues.po}}`.toUpperCase();
            const newC = `${trackingValues.c}-${window.dynamicContent?.styleName
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\ {1,}/gim, "_")
                .toLowerCase()}-${window.dynamicContent?.size}`.replace(/\s+/g, "");

            trackingValues.c = newC
            trackingValues.po = newPO

            track('impression', trackingValues.c, trackingValues.po);

            Object.keys(data).forEach((key) => {
                data[key] = window.dynamicContent[key];
            });
        }

        return true
    }
};

export const exit = (e, exit, trackingValues, data) => {
    let urlParams = new URL(window.location.href).searchParams;
    e.preventDefault();
    let cTag = data?.clickTag != undefined ? data?.clickTag : urlParams?.get("clickTag");
    window.open(
        decodeURIComponent(cTag) != "null" ? decodeURIComponent(cTag) + exit : "" + exit
    );

    if (trackingValues.triggered.exit == false) {
        track("exit", `${trackingValues.c}`, trackingValues.po);
    }
};


/**
 * Checks if a specific key's value has changed between two objects.
 *
 * @param {Object} prevVal - The previous object to compare.
 * @param {Object} val - The current object to compare.
 * @param {string} key - The key to check for changes.
 * @returns {boolean} - Returns true if the value associated with the key has changed, otherwise false.
 */
export const lookForChanges = (prevVal, val, key) => {
    if (prevVal?.[key] !== val?.[key]) {
        return true;
    } else {
        return false;
    }
};

/**
 * Checks if a specific key's value or a selected value has changed between two objects,
 * and if the selected value matches the given type.
 *
 * @param {Object} prevData - The previous object to compare.
 * @param {Object} data - The current object to compare.
 * @param {string} key - The key to check for changes.
 * @param {string} selector - The key for the value to check against the type.
 * @param {string} type - The type to check the selected value against.
 * @returns {boolean} - Returns true if the specified conditions are met, otherwise false.
 */
export const lookForChangesAndType = (prevData, data, key, selector, type) => {
    if ((prevData?.[key] !== data?.[key] || data?.[selector] !== prevData?.[selector]) && data?.[selector].toLowerCase() === type) {
        return true;
    } else {
        return false;
    }
};

/**
 * Updates the background color of an HTML element.
 *
 * @param {HTMLElement} element - The element to update.
 * @param {string} color - The new background color.
 */
export const updateBackground = (element, color) => {
    element.style.background = color;
};

/**
 * Updates the inner HTML of an element to the specified color.
 *
 * @param {HTMLElement} element - The element to update.
 * @param {string} color - The new color.
 */
export const updateColor = (element, color) => {
    element.innerHTML = color;
};

/**
 * Updates the inner HTML of an element to the specified text.
 *
 * @param {HTMLElement} element - The element to update.
 * @param {string} text - The new text content.
 */
export const updateHtml = (element, text) => {
    element.innerHTML = text;
};

/**
 * Updates the display property of an HTML element.
 *
 * @param {HTMLElement} element - The element to update.
 * @param {boolean} boolean - Determines whether the element should be displayed or hidden.
 */
export const updateDisplay = (element, boolean) => {
    element.style.display = boolean ? 'block' : 'none';
};