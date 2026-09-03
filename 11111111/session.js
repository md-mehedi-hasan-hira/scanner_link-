// =========================================
// ScreenLink
// Part 5 - Session
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const sessionCode =
    document.getElementById(
        "sessionCode"
    );


const sessionStatus =
    document.getElementById(
        "sessionStatus"
    );


const startButton =
    document.getElementById(
        "startButton"
    );


const disconnectButton =
    document.getElementById(
        "disconnectButton"
    );


const backButton =
    document.getElementById(
        "backButton"
    );



// =========================================
// GET CONNECTION DATA
// =========================================

const savedCode =
    localStorage.getItem(
        "screenLinkConnectionCode"
    );


const permission =
    localStorage.getItem(
        "screenLinkPermission"
    );



// =========================================
// SHOW CONNECTION CODE
// =========================================

if (savedCode) {


    sessionCode.textContent =
        savedCode;


} else {


    sessionCode.textContent =
        "------";

}



// =========================================
// CHECK PERMISSION
// =========================================

if (
    permission === "allowed"
) {


    sessionStatus.textContent =
        "Connection Approved";


} else {


    sessionStatus.textContent =
        "Permission Required";

}



// =========================================
// START SCREEN SHARING
// =========================================

startButton.addEventListener(
    "click",
    function () {


        // Check permission

        if (
            permission !== "allowed"
        ) {


            alert(
                "Connection permission is required."
            );


            return;

        }



        // Check connection code

        if (
            !savedCode
        ) {


            alert(
                "Connection code not found."
            );


            return;

        }



        sessionStatus.textContent =
            "Starting screen sharing...";



        // Open Screen Viewer

        setTimeout(
            function () {


                window.location.href =
                    "viewer.html";


            },
            500
        );

    }
);



// =========================================
// DISCONNECT
// =========================================

disconnectButton.addEventListener(
    "click",
    function () {


        const confirmDisconnect =
            confirm(
                "Do you want to disconnect?"
            );



        if (
            !confirmDisconnect
        ) {

            return;

        }



        // Remove saved permission

        localStorage.removeItem(
            "screenLinkPermission"
        );



        // Remove saved connection code

        localStorage.removeItem(
            "screenLinkConnectionCode"
        );



        // Return to Home Page

        window.location.replace(
            "../index.html"
        );

    }
);



// =========================================
// BACK BUTTON
// =========================================

backButton.addEventListener(
    "click",
    function () {


        window.location.replace(
            "connection.html"
        );

    }
);