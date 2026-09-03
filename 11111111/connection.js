// =========================================
// ScreenLink
// Part 4 - Connection Page
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const backButton =
    document.getElementById(
        "backButton"
    );


const allowButton =
    document.getElementById(
        "allowButton"
    );


const denyButton =
    document.getElementById(
        "denyButton"
    );


const connectionCode =
    document.getElementById(
        "connectionCode"
    );


const connectionStatus =
    document.getElementById(
        "connectionStatus"
    );


const deviceName =
    document.getElementById(
        "deviceName"
    );



// =========================================
// GET CONNECTION DATA
// =========================================


// Get connection code from URL

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const code =
    urlParams.get(
        "code"
    );



// =========================================
// SHOW CONNECTION DATA
// =========================================

if (code) {


    connectionCode.textContent =
        code;


    deviceName.textContent =
        "ScreenLink Device";


    connectionStatus.textContent =
        "Connection request received.";


} else {


    connectionCode.textContent =
        "------";


    connectionStatus.textContent =
        "No connection code found.";

}



// =========================================
// ALLOW CONNECTION
// =========================================

allowButton.addEventListener(
    "click",
    function () {


        if (!code) {


            alert(
                "Connection code not found."
            );


            return;

        }



        connectionStatus.textContent =
            "Connection allowed.";



        // Save connection permission

        localStorage.setItem(
            "screenLinkPermission",
            "allowed"
        );


        // Save connection code

        localStorage.setItem(
            "screenLinkConnectionCode",
            code
        );



        // Disable buttons to prevent double click

        allowButton.disabled =
            true;


        denyButton.disabled =
            true;



        // Open Session Page

        setTimeout(
            function () {


                window.location.href =
                    "session.html?code=" +
                    encodeURIComponent(
                        code
                    );


            },
            500
        );

    }
);



// =========================================
// DENY CONNECTION
// =========================================

denyButton.addEventListener(
    "click",
    function () {


        connectionStatus.textContent =
            "Connection denied.";



        // Save denied status

        localStorage.setItem(
            "screenLinkPermission",
            "denied"
        );



        // Disable buttons

        allowButton.disabled =
            true;


        denyButton.disabled =
            true;



        // Return to Scan Page

        setTimeout(
            function () {


                window.location.replace(
                    "scan.html"
                );


            },
            700
        );

    }
);



// =========================================
// BACK TO SCAN PAGE
// =========================================

backButton.addEventListener(
    "click",
    function () {


        window.location.replace(
            "scan.html"
        );

    }
);