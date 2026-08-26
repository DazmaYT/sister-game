const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;


// =====================================================
// СОСТОЯНИЕ ИГРЫ
// =====================================================

let gameState = null;


// =====================================================
// HTTP
// =====================================================

const server = http.createServer((req, res) => {

    let filePath;

    if (req.url === "/") {

        filePath = path.join(
            __dirname,
            "index.html"
        );

    } else {

        filePath = path.join(
            __dirname,
            decodeURIComponent(req.url)
        );
    }


    const ext = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8"
    };


    const contentType =
        contentTypes[ext] ||
        "text/plain; charset=utf-8";


    fs.readFile(
        filePath,
        (error, data) => {

            if (error) {

                res.writeHead(
                    404,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );

                res.end(
                    "Файл не найден"
                );

                return;
            }


            res.writeHead(
                200,
                {
                    "Content-Type":
                        contentType
                }
            );

            res.end(data);
        }
    );
});


// =====================================================
// WEBSOCKET
// =====================================================

const wss =
    new WebSocket.Server({
        server
    });


// =====================================================
// ОТПРАВКА
// =====================================================

function send(socket, data) {

    if (
        socket &&
        socket.readyState ===
            WebSocket.OPEN
    ) {

        socket.send(
            JSON.stringify(data)
        );
    }
}


// =====================================================
// ОТПРАВИТЬ СОСТОЯНИЕ ИГРОКУ
// =====================================================

function sendToPlayer() {

    if (!gameState) {
        return;
    }


    for (
        const client of wss.clients
    ) {

        if (
            client.role === "player" &&
            client.readyState ===
                WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type:
                        "operatorState",

                    state:
                        gameState
                }
            );
        }
    }
}


// =====================================================
// ОТПРАВИТЬ СОСТОЯНИЕ ОПЕРАТОРУ
// =====================================================

function sendToOperator() {

    if (!gameState) {
        return;
    }


    for (
        const client of wss.clients
    ) {

        if (
            client.role === "operator" &&
            client.readyState ===
                WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type:
                        "gameState",

                    state:
                        gameState
                }
            );
        }
    }
}


// =====================================================
// ПОДКЛЮЧЕНИЕ
// =====================================================

wss.on(
    "connection",
    (socket) => {

        console.log(
            "🟢 Новое подключение"
        );


        socket.role = null;


        // =================================================
        // СООБЩЕНИЕ
        // =================================================

        socket.on(
            "message",
            (message) => {

                try {

                    const data =
                        JSON.parse(
                            message.toString()
                        );


                    // =====================================
                    // РЕГИСТРАЦИЯ
                    // =====================================

                    if (
                        data.type ===
                        "identify"
                    ) {

                        if (
                            data.role !==
                                "player" &&
                            data.role !==
                                "operator"
                        ) {

                            console.warn(
                                "⚠️ Неверная роль"
                            );

                            return;
                        }


                        socket.role =
                            data.role;


                        console.log(
                            "👤 Зарегистрирован:",
                            socket.role
                        );


                        // Если состояние уже есть —
                        // сразу отправляем его.

                        if (
                            gameState
                        ) {

                            if (
                                socket.role ===
                                    "player"
                            ) {

                                send(
                                    socket,
                                    {
                                        type:
                                            "operatorState",

                                        state:
                                            gameState
                                    }
                                );
                            }


                            if (
                                socket.role ===
                                    "operator"
                            ) {

                                send(
                                    socket,
                                    {
                                        type:
                                            "gameState",

                                        state:
                                            gameState
                                    }
                                );
                            }
                        }


                        return;
                    }


                    // =====================================
                    // ИГРОК → СЕРВЕР
                    // =====================================

                    if (
                        data.type ===
                        "gameState"
                    ) {

                        if (
                            socket.role !==
                            "player"
                        ) {

                            console.warn(
                                "⚠️ gameState пришёл не от игрока"
                            );

                            return;
                        }


                        if (
                            !data.state
                        ) {

                            return;
                        }


                        gameState =
                            data.state;


                        console.log(
                            "💾 Состояние игрока сохранено:",
                            gameState.currentStage
                        );


                        // Отправляем оператору

                        sendToOperator();


                        return;
                    }


                    // =====================================
                    // ОПЕРАТОР → СЕРВЕР
                    // =====================================

                    if (
                        data.type ===
                        "operatorState"
                    ) {

                        if (
                            socket.role !==
                            "operator"
                        ) {

                            console.warn(
                                "⚠️ operatorState пришёл не от оператора"
                            );

                            return;
                        }


                        if (
                            !data.state
                        ) {

                            return;
                        }


                        gameState =
                            data.state;


                        console.log(
                            "💾 Оператор изменил состояние:",
                            gameState.currentStage
                        );


                        // Отправляем игроку

                        sendToPlayer();


                        return;
                    }

                } catch (error) {

                    console.error(
                        "❌ Ошибка сообщения:",
                        error
                    );
                }
            }
        );


        // =================================================
        // ОТКЛЮЧЕНИЕ
        // =================================================

        socket.on(
            "close",
            () => {

                console.log(
                    "🔴 Отключён:",
                    socket.role || "неизвестный"
                );
            }
        );


        socket.on(
            "error",
            (error) => {

                console.error(
                    "❌ WebSocket:",
                    error.message
                );
            }
        );
    }
);


// =====================================================
// ЗАПУСК
// =====================================================

server.listen(
    PORT,
    () => {

        console.log(
            "================================"
        );

        console.log(
            "🚀 CASE18 SERVER ЗАПУЩЕН"
        );

        console.log(
            "================================"
        );

        console.log(
            `🌐 PORT: ${PORT}`
        );
    }
);