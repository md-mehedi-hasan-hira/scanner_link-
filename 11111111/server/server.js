// =========================================
// ScreenLink
// Part 8 - Realtime Server
// =========================================


// =========================================
// IMPORT PACKAGES
// =========================================

const express =
    require("express");


const http =
    require("http");


const cors =
    require("cors");


const {
    Server
} =
    require("socket.io");



// =========================================
// CREATE EXPRESS APP
// =========================================

const app =
    express();


// Allow requests

app.use(
    cors()
);


app.use(
    express.json()
);



// =========================================
// CREATE HTTP SERVER
// =========================================

const server =
    http.createServer(
        app
    );



// =========================================
// CREATE SOCKET.IO SERVER
// =========================================

const io =
    new Server(
        server,
        {

            cors: {

                origin:
                    "*",

                methods:
                    [
                        "GET",
                        "POST"
                    ]

            }

        }
    );



// =========================================
// SESSION STORAGE
// =========================================


// Demo in-memory storage

const sessions =
    {};



// =========================================
// HOME ROUTE
// =========================================

app.get(
    "/",
    function (
        request,
        response
    ) {


        response.json(
            {

                app:
                    "ScreenLink",


                status:
                    "Server is running"

            }
        );

    }
);



// =========================================
// SOCKET CONNECTION
// =========================================

io.on(
    "connection",
    function (
        socket
    ) {


        console.log(
            "Device connected:",
            socket.id
        );



        // =================================
        // CREATE SESSION
        // =================================

        socket.on(
            "create-session",
            function (
                data
            ) {


                const code =
                    data.code;



                if (
                    !code
                ) {

                    socket.emit(
                        "error-message",
                        "Connection code is required."
                    );

                    return;

                }



                // Create new session

                sessions[
                    code
                ] =
                    {

                        viewer:
                            socket.id,


                        sharer:
                            null,


                        sharing:
                            false

                    };



                // Join Socket.IO room

                socket.join(
                    code
                );



                socket.emit(
                    "session-created",
                    {

                        code:
                            code

                    }
                );



                console.log(
                    "Session created:",
                    code
                );

            }
        );



        // =================================
        // JOIN SESSION
        // =================================

        socket.on(
            "join-session",
            function (
                data
            ) {


                const code =
                    data.code;



                if (
                    !sessions[
                        code
                    ]
                ) {

                    socket.emit(
                        "error-message",
                        "Session not found."
                    );

                    return;

                }



                sessions[
                    code
                ].sharer =
                    socket.id;



                socket.join(
                    code
                );



                socket.emit(
                    "session-joined",
                    {

                        code:
                            code

                    }
                );



                // Notify viewer

                socket.to(
                    code
                ).emit(
                    "device-connected",
                    {

                        code:
                            code

                    }
                );



                console.log(
                    "Device joined:",
                    code
                );

            }
        );



        // =================================
        // START SHARING
        // =================================

        socket.on(
            "start-sharing",
            function (
                data
            ) {


                const code =
                    data.code;



                if (
                    sessions[
                        code
                    ]
                ) {


                    sessions[
                        code
                    ].sharing =
                        true;



                    io.to(
                        code
                    ).emit(
                        "sharing-started",
                        {

                            code:
                                code

                        }
                    );



                    console.log(
                        "Sharing started:",
                        code
                    );

                }

            }
        );



        // =================================
        // STOP SHARING
        // =================================

        socket.on(
            "stop-sharing",
            function (
                data
            ) {


                const code =
                    data.code;



                if (
                    sessions[
                        code
                    ]
                ) {


                    sessions[
                        code
                    ].sharing =
                        false;



                    io.to(
                        code
                    ).emit(
                        "sharing-stopped",
                        {

                            code:
                                code

                        }
                    );



                    console.log(
                        "Sharing stopped:",
                        code
                    );

                }

            }
        );



        // =================================
        // DISCONNECT
        // =================================

        socket.on(
            "disconnect",
            function ()
            {


                console.log(
                    "Device disconnected:",
                    socket.id
                );



                // Find session

                Object.keys(
                    sessions
                ).forEach(
                    function (
                        code
                    ) {


                        const session =
                            sessions[
                                code
                            ];



                        // Viewer disconnected

                        if (
                            session.viewer ===
                            socket.id
                        ) {


                            io.to(
                                code
                            ).emit(
                                "viewer-disconnected"
                            );


                            delete sessions[
                                code
                            ];

                        }



                        // Sharer disconnected

                        if (
                            session.sharer ===
                            socket.id
                        ) {


                            session.sharer =
                                null;


                            session.sharing =
                                false;



                            io.to(
                                code
                            ).emit(
                                "sharer-disconnected"
                            );

                        }


                    }
                );

            }
        );


    }
);



// =========================================
// START SERVER
// =========================================

const PORT =
    process.env.PORT ||
    3000;



server.listen(
    PORT,
    function ()
    {


        console.log(
            "================================="
        );


        console.log(
            "ScreenLink Server Running"
        );


        console.log(
            "Port:",
            PORT
        );


        console.log(
            "================================="
        );


    }
);