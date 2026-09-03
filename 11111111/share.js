// =========================================
// ScreenLink
// Part 7 - Share Screen
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const connectionCode =
    document.getElementById(
        "connectionCode"
    );


const shareStatus =
    document.getElementById(
        "shareStatus"
    );


const startShareButton =
    document.getElementById(
        "startShareButton"
    );


const stopShareButton =
    document.getElementById(
        "stopShareButton"
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


    connectionCode.textContent =
        savedCode;


} else {


    connectionCode.textContent =
        "------";


}



// =========================================
// CHECK CONNECTION
// =========================================

let isSharing =
    false;



if (
    permission === "allowed"
) {


    shareStatus.textContent =
        "Connection approved. Ready to share.";


} else {


    shareStatus.textContent =
        "Connection permission required.";


    startShareButton.disabled =
        true;

}



// =========================================
// START SHARING
// =========================================

startShareButton.addEventListener(
    "click",
    function () {


        if (
            permission !== "allowed"
        ) {


            alert(
                "Connection permission is required."
            );


            return;

        }



        if (
            !savedCode
        ) {


            alert(
                "Connection code not found."
            );


            return;

        }



        isSharing =
            true;



        localStorage.setItem(
            "screenLinkSharing",
            "active"
        );



        shareStatus.textContent =
            "Screen sharing started.";



        startShareButton.disabled =
            true;



        stopShareButton.disabled =
            false;



        alert(
            "Screen sharing session started.\n\n" +
            "In this HTML demo, this updates " +
            "the sharing session status.\n\n" +
            "Real Android screen capture requires " +
            "the device owner's system permission."
        );

    }
);



// =========================================
// STOP SHARING
// =========================================

stopShareButton.addEventListener(
    "click",
    function () {


        if (
            !isSharing
        ) {


            alert(
                "Screen sharing is not active."
            );


            return;

        }



        const confirmStop =
            confirm(
                "Do you want to stop screen sharing?"
            );



        if (
            !confirmStop
        ) {

            return;

        }



        isSharing =
            false;



        localStorage.setItem(
            "screenLinkSharing",
            "stopped"
        );



        shareStatus.textContent =
            "Screen sharing stopped.";



        startShareButton.disabled =
            false;



        alert(
            "Screen sharing stopped."
        );

    }
);



// =========================================
// BACK BUTTON
// =========================================

backButton.addEventListener(
    "click",
    function () {


        if (
            isSharing
        ) {


            const confirmLeave =
                confirm(
                    "Screen sharing is active. " +
                    "Do you want to leave?"
                );



            if (
                !confirmLeave
            ) {

                return;

            }


        }



        window.location.replace(
            "../index.html"
        );

    }
);



// =========================================
// LOAD SHARING STATUS
// =========================================

const savedSharingStatus =
    localStorage.getItem(
        "screenLinkSharing"
    );



if (
    savedSharingStatus ===
    "active"
) {


    isSharing =
        true;


    shareStatus.textContent =
        "Screen sharing is active.";


    startShareButton.disabled =
        true;

}