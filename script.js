// =========================================
// ScreenLink
// Main Home Screen
//
// Connected With:
//
// settings.html
// settings.css
// settings.js
// =========================================

// =========================================
// GET BUTTONS
// =========================================

const createQR =
document.getElementById(
"createQR"
);

const connectButton =
document.getElementById(
"connectButton"
);

const settingsButton =
document.getElementById(
"settingsButton"
);

// =========================================
// GET HOME ELEMENTS
// =========================================

const welcomeTitle =
document.getElementById(
"welcomeTitle"
);

const welcomeText =
document.getElementById(
"welcomeText"
);

const settingsInfo =
document.getElementById(
"settingsInfo"
);

// =========================================
// SETTINGS STORAGE KEYS
//
// Same keys used in settings.js
// =========================================

const SETTINGS_KEYS = {

deviceName:
    "screenLinkDeviceName",

appearance:
    "screenLinkAppearance",

notifications:
    "screenLinkNotifications",

allowConnections:
    "screenLinkAllowConnections",

autoApprove:
    "screenLinkAutoApprove",

requireApproval:
    "screenLinkRequireApproval",

shareDeviceName:
    "screenLinkShareDeviceName",

cameraPermission:
    "screenLinkCameraPermission"

};

// =========================================
// LOAD APPEARANCE
// =========================================

function loadAppearance() {

const appearance =
    localStorage.getItem(
        SETTINGS_KEYS.appearance
    );


if (
    appearance ===
    "light"
) {


    document.body.classList.add(
        "light-mode"
    );


}

else {


    document.body.classList.remove(
        "light-mode"
    );


}

}

// =========================================
// LOAD DEVICE NAME
// =========================================

function loadDeviceName() {

const deviceName =
    localStorage.getItem(
        SETTINGS_KEYS.deviceName
    );


if (
    deviceName &&
    welcomeTitle
) {


    welcomeTitle.textContent =
        "Welcome to " +
        deviceName;


}


if (
    deviceName &&
    welcomeText
) {


    welcomeText.textContent =
        "This device is named " +
        deviceName +
        ". Connect another device and start sharing.";


}

}

// =========================================
// LOAD CONNECTION SETTINGS
// =========================================

function loadConnectionSettings() {

const allowConnections =
    localStorage.getItem(
        SETTINGS_KEYS.allowConnections
    );


// Default is enabled

const connectionsAllowed =
    allowConnections !==
    "false";



if (connectButton) {


    connectButton.disabled =
        !connectionsAllowed;


    if (
        !connectionsAllowed
    ) {


        const buttonText =
            connectButton.querySelector(
                "small"
            );


        if (
            buttonText
        ) {


            buttonText.textContent =
                "Connection requests are disabled in Settings";


        }


    }


}

}

// =========================================
// LOAD SETTINGS STATUS
// =========================================

function loadSettingsStatus() {

if (
    !settingsInfo
) {

    return;

}



const notifications =
    localStorage.getItem(
        SETTINGS_KEYS.notifications
    );


const allowConnections =
    localStorage.getItem(
        SETTINGS_KEYS.allowConnections
    );


const requireApproval =
    localStorage.getItem(
        SETTINGS_KEYS.requireApproval
    );


const cameraPermission =
    localStorage.getItem(
        SETTINGS_KEYS.cameraPermission
    );



// -------------------------------------
// CONNECTIONS DISABLED
// -------------------------------------

if (
    allowConnections ===
    "false"
) {


    settingsInfo.textContent =
        "Connection requests are currently disabled in Settings.";

    return;

}



// -------------------------------------
// CAMERA DENIED
// -------------------------------------

if (
    cameraPermission ===
    "denied"
) {


    settingsInfo.textContent =
        "Camera permission is denied. QR scanning may not work.";

    return;

}



// -------------------------------------
// NOTIFICATIONS DISABLED
// -------------------------------------

if (
    notifications ===
    "false"
) {


    settingsInfo.textContent =
        "Notifications are currently turned off.";

    return;

}



// -------------------------------------
// CONNECTION APPROVAL
// -------------------------------------

if (
    requireApproval !==
    "false"
) {


    settingsInfo.textContent =
        "Connection approval is required for secure screen sharing.";

    return;

}



// -------------------------------------
// DEFAULT
// -------------------------------------

settingsInfo.textContent =
    "ScreenLink is ready. Your settings are active.";

}

// =========================================
// CREATE QR BUTTON
// =========================================

if (createQR) {

createQR.addEventListener(
    "click",
    function () {


        window.location.href =
            "pages/create-qr.html";


    }
);

}

// =========================================
// CONNECT DEVICE BUTTON
// =========================================

if (connectButton) {

connectButton.addEventListener(
    "click",
    function () {


        const allowConnections =
            localStorage.getItem(
                SETTINGS_KEYS.allowConnections
            );


        if (
            allowConnections ===
            "false"
        ) {


            if (
                settingsInfo
            ) {


                settingsInfo.textContent =
                    "Connection requests are disabled. Enable them in Settings first.";


            }


            return;

        }



        window.location.href =
            "pages/connect.html";


    }
);

}

// =========================================
// SETTINGS BUTTON
// =========================================

if (settingsButton) {

settingsButton.addEventListener(
    "click",
    function () {


        window.location.href =
            "pages/settings.html";


    }
);

}

// =========================================
// UPDATE SETTINGS
//
// Useful when returning to this page
// =========================================

function loadAllSettings() {

loadAppearance();

loadDeviceName();

loadConnectionSettings();

loadSettingsStatus();

}

// =========================================
// PAGE LOAD
// =========================================

document.addEventListener(
"DOMContentLoaded",
function () {

    loadAllSettings();


}

);

// =========================================
// PAGE VISIBILITY
//
// Reload settings when user comes back
// from Settings page.
// =========================================

window.addEventListener(
"pageshow",
function () {

    loadAllSettings();


}

);n