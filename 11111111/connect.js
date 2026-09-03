// =========================================
// ScreenLink
// Connect Device Page
// Connected With:
//
// scan.js
// connection.js
// session.js
// viewer.js
// share.js
// =========================================

// =========================================
// GET PAGE ELEMENTS
// =========================================

const connectionCodeInput =
document.getElementById(
"connectionCode"
);

const connectButton =
document.getElementById(
"connectButton"
);

const scanButton =
document.getElementById(
"scanButton"
);

const connectionStatus =
document.getElementById(
"connectionStatus"
);

const backButton =
document.getElementById(
"backButton"
);

// =========================================
// SCREENLINK STORAGE KEYS
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

const SCREENLINK_KEYS = {

connectionCode:
    "screenLinkConnectCode",

connectionMethod:
    "screenLinkConnectionMethod",

connectionStatus:
    "screenLinkConnectionStatus",

sessionId:
    "screenLinkSessionId",

sessionStatus:
    "screenLinkSessionStatus",

viewerMode:
    "screenLinkViewerMode",

shareMode:
    "screenLinkShareMode"

};

// =========================================
// UPDATE CONNECTION STATUS
// =========================================

function updateConnectionStatus(
message,
type
) {

if (!connectionStatus) {

    return;

}


connectionStatus.textContent =
    message;


connectionStatus.classList.remove(
    "success",
    "warning",
    "error",
    "connecting"
);


if (type) {

    connectionStatus.classList.add(
        type
    );

}

}

// =========================================
// CREATE SESSION ID
//
// Used later by:
//
// connection.js
// session.js
// viewer.js
// share.js
// =========================================

function createSessionId() {

const randomPart =
    Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();


const timePart =
    Date.now()
        .toString()
        .slice(-6);


return (
    "SL-" +
    timePart +
    "-" +
    randomPart
);

}

// =========================================
// SAVE CONNECTION DATA
// =========================================

function saveConnectionData(
code,
method
) {

const sessionId =
    createSessionId();


localStorage.setItem(
    SCREENLINK_KEYS.connectionCode,
    code
);


localStorage.setItem(
    SCREENLINK_KEYS.connectionMethod,
    method
);


localStorage.setItem(
    SCREENLINK_KEYS.connectionStatus,
    "pending"
);


localStorage.setItem(
    SCREENLINK_KEYS.sessionId,
    sessionId
);


localStorage.setItem(
    SCREENLINK_KEYS.sessionStatus,
    "created"
);


localStorage.setItem(
    SCREENLINK_KEYS.viewerMode,
    "ready"
);


localStorage.setItem(
    SCREENLINK_KEYS.shareMode,
    "ready"
);


return sessionId;

}

// =========================================
// BACK BUTTON
// =========================================

if (backButton) {

backButton.addEventListener(
    "click",
    function () {

        /*
        Return to ScreenLink Home Page.
        */

        window.location.href =
            "../index.html";

    }
);

}

// =========================================
// SCAN QR BUTTON
// =========================================

if (scanButton) {

scanButton.addEventListener(
    "click",
    function () {


        /*
        Save connection method.
        scan.js can read this.
        */

        localStorage.setItem(
            SCREENLINK_KEYS.connectionMethod,
            "qr"
        );


        updateConnectionStatus(
            "Opening QR scanner...",
            "connecting"
        );


        setTimeout(
            function () {

                window.location.href =
                    "scan.html";

            },
            300
        );

    }
);

}

// =========================================
// CONNECTION CODE INPUT
// =========================================

if (connectionCodeInput) {

connectionCodeInput.addEventListener(
    "input",
    function () {


        /*
        Allow only:
        A-Z
        0-9
        */

        this.value =
            this.value
                .toUpperCase()
                .replace(
                    /[^A-Z0-9]/g,
                    ""
                );


        /*
        Remove error message while typing.
        */

        if (
            this.value.length > 0
        ) {

            updateConnectionStatus(
                "Enter the complete 6-digit connection code.",
                null
            );

        }

    }
);



// =====================================
// ENTER KEY
// =====================================

connectionCodeInput.addEventListener(
    "keydown",
    function (
        event
    ) {

        if (
            event.key === "Enter"
        ) {

            if (connectButton) {

                connectButton.click();

            }

        }

    }
);

}

// =========================================
// CONNECT DEVICE
// =========================================

if (
connectButton &&
connectionCodeInput
) {

connectButton.addEventListener(
    "click",
    function () {


        const code =
            connectionCodeInput.value
                .trim()
                .toUpperCase();



        // =================================
        // VALIDATE CODE
        // =================================

        if (
            code.length !== 6
        ) {

            updateConnectionStatus(
                "Please enter a valid 6-digit connection code.",
                "error"
            );

            connectionCodeInput.focus();

            return;

        }



        // =================================
        // SAVE DATA FOR OTHER JS FILES
        // =================================

        const sessionId =
            saveConnectionData(
                code,
                "code"
            );



        // =================================
        // UPDATE STATUS
        // =================================

        updateConnectionStatus(
            "Connection request sent...",
            "connecting"
        );



        // =================================
        // DISABLE BUTTON
        // =================================

        connectButton.disabled =
            true;



        // =================================
        // GO TO CONNECTION PAGE
        //
        // connection.js will continue
        // the connection process.
        // =================================

        setTimeout(
            function () {


                window.location.href =
                    "connection.html" +
                    "?code=" +
                    encodeURIComponent(
                        code
                    ) +
                    "&session=" +
                    encodeURIComponent(
                        sessionId
                    );


            },
            500
        );

    }
);

}

// =========================================
// RESTORE PREVIOUS CONNECTION CODE
//
// Useful when user returns from:
//
// connection.html
// session.html
// viewer.html
// share.html
// =========================================

window.addEventListener(
"load",
function () {

    if (!connectionCodeInput) {

        return;

    }


    const savedCode =
        localStorage.getItem(
            SCREENLINK_KEYS.connectionCode
        );


    if (
        savedCode &&
        savedCode.length === 6
    ) {

        connectionCodeInput.value =
            savedCode;

    }

}

);

// =========================================
// SCREENLINK CONNECTION FLOW
// =========================================

/*

CODE CONNECTION:

connect.html
↓
connect.js
↓
connection.html
↓
connection.js
↓
session.html
↓
session.js
↓
Choose Screen Sharing Mode
↓
viewer.html
↓
viewer.js

QR CONNECTION:

connect.html
↓
connect.js
↓
scan.html
↓
scan.js
↓
connection.html
↓
connection.js
↓
session.html
↓
session.js
↓
share.html
↓
share.js

ALL PAGES SHARE:

screenLinkConnectCode
screenLinkConnectionMethod
screenLinkConnectionStatus
screenLinkSessionId
screenLinkSessionStatus
screenLinkViewerMode
screenLinkShareMode

*/