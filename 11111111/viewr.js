// =========================================
// ScreenLink
// Part 6 - Screen Viewer
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const backButton =
    document.getElementById(
        "backButton"
    );


const fullscreenButton =
    document.getElementById(
        "fullscreenButton"
    );


const refreshButton =
    document.getElementById(
        "refreshButton"
    );


const disconnectButton =
    document.getElementById(
        "disconnectButton"
    );


const connectionCode =
    document.getElementById(
        "connectionCode"
    );


const sessionStatus =
    document.getElementById(
        "sessionStatus"
    );


const connectionText =
    document.getElementById(
        "connectionText"
    );


const screenContainer =
    document.getElementById(
        "screenContainer"
    );


const remoteScreen =
    document.getElementById(
        "remoteScreen"
    );


const screenPlaceholder =
    document.getElementById(
        "screenPlaceholder"
    );



// =========================================
// LOAD SESSION DATA
// =========================================

const savedCode =
    localStorage.getItem(
        "screenLinkConnectionCode"
    );


const permission =
    localStorage.getItem(
        "screenLinkPermission"
    );



if (savedCode) {


    connectionCode.textContent =
        savedCode;


} else {


    connectionCode.textContent =
        "------";

}



// =========================================
// CHECK CONNECTION
// =========================================

if (
    permission === "allowed"
) {


    sessionStatus.textContent =
        "Connected";


    connectionText.textContent =
        "Connected";


} else {


    sessionStatus.textContent =
        "Not Connected";


    connectionText.textContent =
        "Offline";

}



// =========================================
// START VIEWER INTERFACE
// =========================================

function showViewerReady() {


    if (
        permission !== "allowed"
    ) {

        return;

    }


    sessionStatus.textContent =
        "Waiting for shared screen";


    screenPlaceholder.style.display =
        "block";


    remoteScreen.style.display =
        "none";

}


showViewerReady();



// =========================================
// FULL SCREEN
// =========================================

fullscreenButton.addEventListener(
    "click",
    function () {


        if (
            !document.fullscreenElement
        ) {


            screenContainer
                .requestFullscreen()
                .catch(
                    function(error) {

                        console.error(
                            error
                        );

                    }
                );


        } else {


            document.exitFullscreen();

        }

    }
);



// =========================================
// REFRESH SESSION
// =========================================

refreshButton.addEventListener(
    "click",
    function () {


        sessionStatus.textContent =
            "Refreshing connection...";


        setTimeout(
            function () {


                if (
                    permission === "allowed"
                ) {


                    sessionStatus.textContent =
                        "Waiting for shared screen";


                } else {


                    sessionStatus.textContent =
                        "Connection unavailable";

                }


            },
            700
        );

    }
);



// =========================================
// DISCONNECT SESSION
// =========================================

disconnectButton.addEventListener(
    "click",
    function () {


        const shouldDisconnect =
            confirm(
                "Do you want to disconnect this session?"
            );



        if (
            !shouldDisconnect
        ) {

            return;

        }



        localStorage.removeItem(
            "screenLinkPermission"
        );


        localStorage.removeItem(
            "screenLinkConnectionCode"
        );



        window.location.replace(
            "../index.html"
        );

    }
);



// =========================================
// BACK
// =========================================

backButton.addEventListener(
    "click",
    function () {


        window.location.replace(
            "session.html"
        );

    }
);