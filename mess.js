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
            const newPO = `${trackingValues.po}-${window.dynamicContent?.lang}`.toUpperCase();
            const newC = `${trackingValues.c}-${window.dynamicContent?.lang
                }-${window.dynamicContent?.styleName
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
        trackingValues = {
            ...trackingValues,
            triggered: { ...trackingValues.triggered, exit: true },
        };
    }
};