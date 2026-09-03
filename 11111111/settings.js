// =========================================
// ScreenLink
// Settings Page JavaScript
//
// Works with:
//
// settings.html
// settings.css
// =========================================

// =========================================
// GET PAGE ELEMENTS
// =========================================

const backButton =
document.getElementById(
"backButton"
);

const deviceNameInput =
document.getElementById(
"deviceName"
);

const darkModeToggle =
document.getElementById(
"darkModeToggle"
);

const notificationToggle =
document.getElementById(
"notificationToggle"
);

const connectionToggle =
document.getElementById(
"connectionToggle"
);

const autoApproveToggle =
document.getElementById(
"autoApproveToggle"
);

const approvalToggle =
document.getElementById(
"approvalToggle"
);

const shareDeviceNameToggle =
document.getElementById(
"shareDeviceNameToggle"
);

const cameraStatus =
document.getElementById(
"cameraStatus"
);

const cameraButton =
document.getElementById(
"cameraButton"
);

const clearSessionButton =
document.getElementById(
"clearSessionButton"
);

const saveStatus =
document.getElementById(
"saveStatus"
);

// =========================================
// STORAGE KEYS
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
// SESSION KEYS
//
// Used by:
//
// connect.js
// scan.js
// connection.js
// session.js
// viewer.js
// share.js
// =========================================

const SESSION_KEYS = [

"screenLinkConnectCode",

"screenLinkConnectionMethod",

"screenLinkConnectionStatus",

"screenLinkSessionId",

"screenLinkSessionStatus",

"screenLinkViewerMode",

"screenLinkShareMode",

"screenLinkQRData"

];

// =========================================
// UPDATE SAVE STATUS
// =========================================

function updateSaveStatus(
message,
type
) {

if (!saveStatus) {

    return;

}


saveStatus.textContent =
    message;


saveStatus.classList.remove(
    "success",
    "warning",
    "error"
);


if (type) {

    saveStatus.classList.add(
        type
    );

}

}

// =========================================
// SAVE A SETTING
// =========================================

function saveSetting(
key,
value,
message
) {

localStorage.setItem(
    key,
    value
);


updateSaveStatus(
    message ||
    "Settings saved automatically.",
    "success"
);

}

// =========================================
// LOAD SETTINGS
// =========================================

function loadSettings() {

// -------------------------------------
// DEVICE NAME
// -------------------------------------

const savedDeviceName =
    localStorage.getItem(
        SETTINGS_KEYS.deviceName
    );


if (
    savedDeviceName &&
    deviceNameInput
) {

    deviceNameInput.value =
        savedDeviceName;

}



// -------------------------------------
// APPEARANCE
// -------------------------------------

const savedAppearance =
    localStorage.getItem(
        SETTINGS_KEYS.appearance
    );


if (
    savedAppearance ===
    "light"
) {

    document.body.classList.add(
        "light-mode"
    );


    if (darkModeToggle) {

        darkModeToggle.checked =
            false;

    }

}

else {


    document.body.classList.remove(
        "light-mode"
    );


    if (darkModeToggle) {

        darkModeToggle.checked =
            true;

    }

}



// -------------------------------------
// NOTIFICATIONS
// -------------------------------------

const savedNotifications =
    localStorage.getItem(
        SETTINGS_KEYS.notifications
    );


if (notificationToggle) {

    notificationToggle.checked =
        savedNotifications !==
        "false";

}



// -------------------------------------
// ALLOW CONNECTIONS
// -------------------------------------

const savedAllowConnections =
    localStorage.getItem(
        SETTINGS_KEYS.allowConnections
    );


if (connectionToggle) {

    connectionToggle.checked =
        savedAllowConnections !==
        "false";

}



// -------------------------------------
// AUTO APPROVE
// -------------------------------------

const savedAutoApprove =
    localStorage.getItem(
        SETTINGS_KEYS.autoApprove
    );


if (autoApproveToggle) {

    autoApproveToggle.checked =
        savedAutoApprove ===
        "true";

}



// -------------------------------------
// REQUIRE APPROVAL
// -------------------------------------

const savedRequireApproval =
    localStorage.getItem(
        SETTINGS_KEYS.requireApproval
    );


if (approvalToggle) {

    approvalToggle.checked =
        savedRequireApproval !==
        "false";

}



// -------------------------------------
// SHARE DEVICE NAME
// -------------------------------------

const savedShareDeviceName =
    localStorage.getItem(
        SETTINGS_KEYS.shareDeviceName
    );


if (shareDeviceNameToggle) {

    shareDeviceNameToggle.checked =
        savedShareDeviceName !==
        "false";

}



// -------------------------------------
// CAMERA STATUS
// -------------------------------------

loadCameraPermissionStatus();

}

// =========================================
// DEVICE NAME
// =========================================

if (deviceNameInput) {

deviceNameInput.addEventListener(
    "input",
    function() {


        const deviceName =
            this.value
                .trim();


        saveSetting(
            SETTINGS_KEYS.deviceName,
            deviceName,
            "Device name saved."
        );


    }
);

}

// =========================================
// DARK / LIGHT MODE
// =========================================

if (darkModeToggle) {

darkModeToggle.addEventListener(
    "change",
    function() {


        if (this.checked) {


            document.body.classList.remove(
                "light-mode"
            );


            saveSetting(
                SETTINGS_KEYS.appearance,
                "dark",
                "Dark mode enabled."
            );

        }

        else {


            document.body.classList.add(
                "light-mode"
            );


            saveSetting(
                SETTINGS_KEYS.appearance,
                "light",
                "Light mode enabled."
            );

        }


    }
);

}

// =========================================
// NOTIFICATIONS
// =========================================

if (notificationToggle) {

notificationToggle.addEventListener(
    "change",
    function() {


        saveSetting(
            SETTINGS_KEYS.notifications,
            this.checked
                ? "true"
                : "false",
            this.checked
                ? "Notifications enabled."
                : "Notifications disabled."
        );


    }
);

}

// =========================================
// ALLOW CONNECTION REQUESTS
// =========================================

if (connectionToggle) {

connectionToggle.addEventListener(
    "change",
    function() {


        saveSetting(
            SETTINGS_KEYS.allowConnections,
            this.checked
                ? "true"
                : "false",
            this.checked
                ? "Connection requests enabled."
                : "Connection requests disabled."
        );


    }
);

}

// =========================================
// AUTO APPROVE CONNECTIONS
// =========================================

if (autoApproveToggle) {

autoApproveToggle.addEventListener(
    "change",
    function() {


        saveSetting(
            SETTINGS_KEYS.autoApprove,
            this.checked
                ? "true"
                : "false",
            this.checked
                ? "Auto approval enabled."
                : "Auto approval disabled."
        );


    }
);

}

// =========================================
// REQUIRE CONNECTION APPROVAL
// =========================================

if (approvalToggle) {

approvalToggle.addEventListener(
    "change",
    function() {


        saveSetting(
            SETTINGS_KEYS.requireApproval,
            this.checked
                ? "true"
                : "false",
            this.checked
                ? "Connection approval required."
                : "Connection approval disabled."
        );


    }
);

}

// =========================================
// SHARE DEVICE NAME
// =========================================

if (shareDeviceNameToggle) {

shareDeviceNameToggle.addEventListener(
    "change",
    function() {


        saveSetting(
            SETTINGS_KEYS.shareDeviceName,
            this.checked
                ? "true"
                : "false",
            this.checked
                ? "Device name sharing enabled."
                : "Device name sharing disabled."
        );


    }
);

}

// =========================================
// LOAD CAMERA PERMISSION STATUS
// =========================================

function loadCameraPermissionStatus() {

const savedPermission =
    localStorage.getItem(
        SETTINGS_KEYS.cameraPermission
    );


if (
    savedPermission ===
    "granted"
) {


    if (cameraStatus) {

        cameraStatus.textContent =
            "Camera permission is allowed.";

    }


    if (cameraButton) {

        cameraButton.textContent =
            "Allowed";

    }


}

else {


    if (cameraStatus) {

        cameraStatus.textContent =
            "Camera permission has not been checked.";

    }


    if (cameraButton) {

        cameraButton.textContent =
            "Check";

    }


}

}

// =========================================
// CHECK / REQUEST CAMERA PERMISSION
// =========================================

if (cameraButton) {

cameraButton.addEventListener(
    "click",
    async function() {


        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {


            if (cameraStatus) {

                cameraStatus.textContent =
                    "Camera access is not supported.";

            }


            updateSaveStatus(
                "Camera is not supported in this browser.",
                "error"
            );

            return;

        }



        try {


            cameraButton.disabled =
                true;


            cameraButton.textContent =
                "Checking...";


            if (cameraStatus) {

                cameraStatus.textContent =
                    "Requesting camera permission...";

            }



            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia(
                        {
                            video:
                                true
                        }
                    );



            /*
            Stop camera immediately.

            This only checks permission.
            */

            stream
                .getTracks()
                .forEach(
                    function(
                        track
                    ) {


                        track.stop();


                    }
                );



            localStorage.setItem(
                SETTINGS_KEYS.cameraPermission,
                "granted"
            );



            if (cameraStatus) {

                cameraStatus.textContent =
                    "Camera permission is allowed.";

            }



            cameraButton.textContent =
                "Allowed";



            updateSaveStatus(
                "Camera permission granted.",
                "success"
            );


        }

        catch (
            error
        ) {


            console.error(
                error
            );


            localStorage.setItem(
                SETTINGS_KEYS.cameraPermission,
                "denied"
            );



            if (cameraStatus) {

                cameraStatus.textContent =
                    "Camera permission was denied.";

            }



            cameraButton.textContent =
                "Denied";



            updateSaveStatus(
                "Camera permission was denied.",
                "error"
            );


        }

        finally {


            cameraButton.disabled =
                false;


        }


    }
);

}

// =========================================
// CLEAR SESSION DATA
// =========================================

if (clearSessionButton) {

clearSessionButton.addEventListener(
    "click",
    function() {


        const confirmed =
            window.confirm(
                "Clear all ScreenLink connection and session data?"
            );


        if (!confirmed) {

            return;

        }



        SESSION_KEYS.forEach(
            function(
                key
            ) {


                localStorage.removeItem(
                    key
                );


            }
        );



        updateSaveStatus(
            "ScreenLink session data cleared successfully.",
            "success"
        );


    }
);

}

// =========================================
// BACK BUTTON
// =========================================

if (backButton) {

backButton.addEventListener(
    "click",
    function() {


        /*
        Return to Home Page.
        */

        window.location.href =
            "index.html";


    }
);

}

// =========================================
// PAGE LOAD
// =========================================

document.addEventListener(
"DOMContentLoaded",
function() {

    loadSettings();


    updateSaveStatus(
        "Settings are saved automatically.",
        null
    );


}

);

// =========================================
// SCREENLINK SETTINGS STORAGE
// =========================================

/*

DEVICE SETTINGS:

screenLinkDeviceName

screenLinkAppearance

screenLinkNotifications

CONNECTION SETTINGS:

screenLinkAllowConnections

screenLinkAutoApprove

PRIVACY SETTINGS:

screenLinkRequireApproval

screenLinkShareDeviceName

CAMERA SETTINGS:

screenLinkCameraPermission

SESSION DATA:

screenLinkConnectCode

screenLinkConnectionMethod

screenLinkConnectionStatus

screenLinkSessionId

screenLinkSessionStatus

screenLinkViewerMode

screenLinkShareMode

screenLinkQRData

*/