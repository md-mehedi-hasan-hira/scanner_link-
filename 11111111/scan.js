// =========================================
// ScreenLink
// Scan QR Page
//
// Connected Flow:
//
// connect.js
//      ↓
// scan.js
//      ↓
// connection.js
//      ↓
// session.js
//      ↓
// viewer.js / share.js
// =========================================

// =========================================
// PAGE ELEMENTS
// =========================================

const scanStatus =
document.getElementById(
"scanStatus"
);

const codeInput =
document.getElementById(
"codeInput"
);

const connectButton =
document.getElementById(
"connectButton"
);

const backButton =
document.getElementById(
"backButton"
);

// =========================================
// SCREENLINK STORAGE KEYS
//
// Same keys used by connect.js
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
// QR SCANNER VARIABLES
// =========================================

let scanner =
null;

let isConnected =
false;

let isStopping =
false;

// =========================================
// CREATE SESSION ID
//
// Same format used by connect.js
// =========================================

function createSessionId() {

const randomPart =
    Math.random()
        .toString(36)
        .substring(
            2,
            10
        )
        .toUpperCase();


const timePart =
    Date.now()
        .toString()
        .slice(
            -6
        );


return (
    "SL-" +
    timePart +
    "-" +
    randomPart
);

}

// =========================================
// UPDATE STATUS
// =========================================

function updateScanStatus(
message,
type
) {

if (!scanStatus) {

    return;

}


scanStatus.textContent =
    message;


scanStatus.classList.remove(
    "success",
    "warning",
    "error",
    "connecting"
);


if (type) {

    scanStatus.classList.add(
        type
    );

}

}

// =========================================
// SAVE CONNECTION DATA
//
// Data can be used by:
//
// connection.js
// session.js
// viewer.js
// share.js
// =========================================

function saveConnectionData(
code,
method,
qrData
) {

let sessionId =
    localStorage.getItem(
        SCREENLINK_KEYS.sessionId
    );


/*
If a session already exists,
keep it.

Otherwise create a new session.
*/

if (!sessionId) {

    sessionId =
        createSessionId();

}



// Save connection code

localStorage.setItem(
    SCREENLINK_KEYS.connectionCode,
    code
);


// Save connection method

localStorage.setItem(
    SCREENLINK_KEYS.connectionMethod,
    method
);


// Connection is waiting
// for approval

localStorage.setItem(
    SCREENLINK_KEYS.connectionStatus,
    "pending"
);


// Save session

localStorage.setItem(
    SCREENLINK_KEYS.sessionId,
    sessionId
);


localStorage.setItem(
    SCREENLINK_KEYS.sessionStatus,
    "created"
);


// Prepare next pages

localStorage.setItem(
    SCREENLINK_KEYS.viewerMode,
    "ready"
);


localStorage.setItem(
    SCREENLINK_KEYS.shareMode,
    "ready"
);



/*
Save QR device information
if available.
*/

if (qrData) {

    localStorage.setItem(
        "screenLinkQRData",
        JSON.stringify(
            qrData
        )
    );

}


return sessionId;

}

// =========================================
// START QR SCANNER
// =========================================

function startQRScanner() {

/*
Check QR library first.
*/

if (
    typeof Html5Qrcode ===
    "undefined"
) {

    updateScanStatus(
        "QR scanner library could not load.",
        "error"
    );

    return;

}



try {


    scanner =
        new Html5Qrcode(
            "reader"
        );



    updateScanStatus(
        "Starting camera...",
        "connecting"
    );



    scanner.start(

        {
            facingMode:
                "environment"
        },

        {

            fps:
                10,

            qrbox: {

                width:
                    220,

                height:
                    220

            }

        },


        // SUCCESS

        function(
            decodedText
        ) {


            handleQRCode(
                decodedText
            );

        },


        // ERROR

        function(
            errorMessage
        ) {

            /*
            QR code is not detected yet.

            No need to show error
            because this callback runs
            continuously.
            */

        }

    )

    .then(
        function() {


            updateScanStatus(
                "Camera ready. Scan the ScreenLink QR Code.",
                "success"
            );


        }
    )

    .catch(
        function(
            error
        ) {


            console.error(
                error
            );


            updateScanStatus(
                "Camera permission is required to scan QR codes.",
                "error"
            );


        }
    );


}

catch (
    error
) {


    console.error(
        error
    );


    updateScanStatus(
        "Unable to start the QR scanner.",
        "error"
    );


}

}

// =========================================
// HANDLE QR RESULT
// =========================================

function handleQRCode(
decodedText
) {

if (
    isConnected
) {

    return;

}



let connectionData;


try {


    /*
    Expected QR format:

    {
        "app": "ScreenLink",
        "code": "ABC123"
    }
    */

    connectionData =
        JSON.parse(
            decodedText
        );


}

catch (
    error
) {


    updateScanStatus(
        "Invalid ScreenLink QR Code.",
        "error"
    );

    return;

}



// =====================================
// CHECK APP NAME
// =====================================

if (

    connectionData.app !==
    "ScreenLink"

) {


    updateScanStatus(
        "This is not a ScreenLink QR Code.",
        "error"
    );

    return;

}



// =====================================
// CHECK CONNECTION CODE
// =====================================

if (

    !connectionData.code

) {


    updateScanStatus(
        "Invalid connection code.",
        "error"
    );

    return;

}



const code =
    connectionData.code
        .toString()
        .trim()
        .toUpperCase();



// Check code length

if (
    code.length !== 6
) {


    updateScanStatus(
        "Invalid 6-digit connection code.",
        "error"
    );

    return;

}



// Put scanned code in input

if (
    codeInput
) {


    codeInput.value =
        code;

}



updateScanStatus(
    "QR Code scanned successfully.",
    "success"
);



// Connect

connectToDevice(
    code,
    "qr",
    connectionData
);

}

// =========================================
// MANUAL CONNECTION
// =========================================

if (
connectButton &&
codeInput
) {

connectButton.addEventListener(

    "click",

    function() {


        const code =
            codeInput.value
                .trim()
                .toUpperCase();



        // Check length

        if (
            code.length !== 6
        ) {


            updateScanStatus(
                "Please enter a valid 6-digit connection code.",
                "error"
            );


            codeInput.focus();

            return;

        }



        connectToDevice(
            code,
            "manual",
            null
        );


    }

);

}

// =========================================
// ENTER KEY
// =========================================

if (
codeInput
) {

codeInput.addEventListener(

    "keydown",

    function(
        event
    ) {


        if (
            event.key ===
            "Enter"
        ) {


            if (
                connectButton
            ) {

                connectButton.click();

            }

        }

    }

);


// Allow only letters and numbers

codeInput.addEventListener(

    "input",

    function() {


        this.value =
            this.value

                .toUpperCase()

                .replace(
                    /[^A-Z0-9]/g,
                    ""
                );


    }

);

}

// =========================================
// CONNECT TO DEVICE
// =========================================

function connectToDevice(
code,
method,
qrData
) {

if (
    isConnected
) {

    return;

}



isConnected =
    true;



updateScanStatus(
    "Connecting to device...",
    "connecting"
);



if (
    connectButton
) {

    connectButton.disabled =
        true;

}



/*
Save all data before
going to connection.html.
*/

const sessionId =
    saveConnectionData(
        code,
        method,
        qrData
    );



/*
Stop camera.
*/

stopScanner();



/*
Open Connection Page.

connection.js can read:

localStorage values

and URL parameters.
*/

setTimeout(

    function() {


        window.location.href =

            "connection.html" +

            "?code=" +

            encodeURIComponent(
                code
            ) +

            "&session=" +

            encodeURIComponent(
                sessionId
            ) +

            "&method=" +

            encodeURIComponent(
                method
            );


    },

    500

);

}

// =========================================
// STOP QR SCANNER
// =========================================

function stopScanner() {

if (
    !scanner ||
    isStopping
) {

    return;

}



isStopping =
    true;



scanner.stop()

.then(

    function() {


        console.log(
            "ScreenLink QR scanner stopped."
        );


        isStopping =
            false;


    }

)

.catch(

    function(
        error
    ) {


        /*
        Scanner may already be stopped.
        */

        console.log(
            "Scanner stop:",
            error
        );


        isStopping =
            false;


    }

);

}

// =========================================
// BACK BUTTON
// =========================================

if (
backButton
) {

backButton.addEventListener(

    "click",

    function() {


        updateScanStatus(
            "Closing camera...",
            "connecting"
        );


        stopScanner();


        /*
        Return to Connect Device page.
        */

        setTimeout(

            function() {


                window.location.href =
                    "connect.html";


            },

            300

        );


    }

);

}

// =========================================
// PAGE EXIT
// =========================================

window.addEventListener(

"beforeunload",

function() {


    stopScanner();


}

);

// =========================================
// START QR SCANNER
// =========================================

document.addEventListener(

"DOMContentLoaded",

function() {


    startQRScanner();


}

);

// =========================================
// SCREENLINK FLOW
// =========================================

/*

MANUAL CODE:

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
viewer.html
or
share.html

QR CODE:

connect.html
↓
connect.js
↓
scan.html
↓
scan.js
↓
Camera Opens
↓
QR Code Scan
↓
Save Connection Data
↓
connection.html
↓
connection.js
↓
session.html
↓
session.js
↓
viewer.html
or
share.html

SHARED LOCAL STORAGE:

screenLinkConnectCode

screenLinkConnectionMethod

screenLinkConnectionStatus

screenLinkSessionId

screenLinkSessionStatus

screenLinkViewerMode

screenLinkShareMode

screenLinkQRData

*/