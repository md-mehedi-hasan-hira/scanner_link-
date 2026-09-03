// =========================================
// ScreenLink
// Part 8 - Create QR + Server Session
// =========================================


// =========================================
// SERVER URL
// =========================================

const SERVER_URL =
    "http://192.168.0.100:3000";



// =========================================
// GET HTML ELEMENTS
// =========================================

const qrContainer =
    document.getElementById(
        "qrcode"
    );


const connectionCodeElement =
    document.getElementById(
        "connectionCode"
    );


const statusText =
    document.getElementById(
        "statusText"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const cancelButton =
    document.getElementById(
        "cancelButton"
    );



// =========================================
// GENERATE CONNECTION CODE
// =========================================

function generateConnectionCode() {


    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


    let result =
        "";


    for (
        let i = 0;
        i < 6;
        i++
    ) {


        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );


        result +=
            characters[
                randomIndex
            ];


    }


    return result;


}



// =========================================
// CREATE CONNECTION CODE
// =========================================

const connectionCode =
    generateConnectionCode();



if (
    connectionCodeElement
) {


    connectionCodeElement.textContent =
        connectionCode;


}



// =========================================
// CREATE QR DATA
// =========================================

const qrData =
    JSON.stringify(
        {


            app:
                "ScreenLink",


            type:
                "screen_share",


            code:
                connectionCode,


            server:
                SERVER_URL,


            version:
                "1.0"


        }
    );



// =========================================
// CREATE QR CODE
// =========================================

function createQRCode() {


    if (
        !qrContainer
    ) {


        console.error(
            "QR container not found."
        );

        return;


    }



    if (
        typeof QRCode ===
        "undefined"
    ) {


        if (
            statusText
        ) {


            statusText.textContent =
                "QR library could not load.";


        }


        return;


    }



    // Clear old QR

    qrContainer.innerHTML =
        "";



    // Create QR

    new QRCode(
        qrContainer,
        {


            text:
                qrData,


            width:
                210,


            height:
                210


        }
    );



    if (
        statusText
    ) {


        statusText.textContent =
            "QR Code ready. Waiting for device...";


    }


}



// =========================================
// SOCKET.IO CONNECTION
// =========================================

let socket =
    null;



function connectToServer() {


    // Check Socket.IO library

    if (
        typeof io ===
        "undefined"
    ) {


        console.log(
            "Socket.IO is not loaded."
        );


        return;


    }



    try {


        socket =
            io(
                SERVER_URL,
                {


                    transports:
                        [
                            "websocket",
                            "polling"
                        ],


                    timeout:
                        5000


                }
            );



        // =============================
        // SERVER CONNECTED
        // =============================

        socket.on(
            "connect",
            function () {


                console.log(
                    "Connected to ScreenLink server."
                );



                if (
                    statusText
                ) {


                    statusText.textContent =
                        "Creating secure session...";


                }



                // Create session

                socket.emit(
                    "create-session",
                    {


                        code:
                            connectionCode


                    }
                );


            }
        );



        // =============================
        // SESSION CREATED
        // =============================

        socket.on(
            "session-created",
            function (
                data
            ) {


                console.log(
                    "Session created:",
                    data.code
                );



                if (
                    statusText
                ) {


                    statusText.textContent =
                        "QR ready. Waiting for device...";


                }


            }
        );



        // =============================
        // DEVICE CONNECTED
        // =============================

        socket.on(
            "device-connected",
            function (
                data
            ) {


                console.log(
                    "Device connected:",
                    data.code
                );



                if (
                    statusText
                ) {


                    statusText.textContent =
                        "Device connected!";


                }


            }
        );



        // =============================
        // SERVER ERROR MESSAGE
        // =============================

        socket.on(
            "error-message",
            function (
                message
            ) {


                console.error(
                    message
                );



                if (
                    statusText
                ) {


                    statusText.textContent =
                        message;


                }


            }
        );



        // =============================
        // CONNECTION ERROR
        // =============================

        socket.on(
            "connect_error",
            function (
                error
            ) {


                console.log(
                    "Server connection error:",
                    error.message
                );



                // QR must still work
                // even if server is offline

                if (
                    statusText
                ) {


                    statusText.textContent =
                        "QR ready. Server connection unavailable.";


                }


            }
        );



    }

    catch (
        error
    ) {


        console.error(
            error
        );


    }


}



// =========================================
// BACK BUTTON
// =========================================

if (
    backButton
) {


    backButton.addEventListener(
        "click",
        function () {


            // Disconnect socket

            if (
                socket
            ) {


                socket.disconnect();


            }



            window.location.href =
                "../index.html";


        }
    );


}



// =========================================
// CANCEL BUTTON
// =========================================

if (
    cancelButton
) {


    cancelButton.addEventListener(
        "click",
        function () {


            // Disconnect socket

            if (
                socket
            ) {


                socket.disconnect();


            }



            window.location.href =
                "../index.html";


        }
    );


}



// =========================================
// START PAGE
// =========================================

createQRCode();


connectToServer();