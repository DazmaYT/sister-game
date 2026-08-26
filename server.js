const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { Pool } = require("pg");


// =====================================================
// POSTGRESQL
// =====================================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});


// =====================================================
// PORT
// =====================================================

const PORT =
    process.env.PORT || 3000;


// =====================================================
// СОСТОЯНИЕ ИГРЫ
// =====================================================

let gameState = null;


// =====================================================
// DATABASE INIT
// =====================================================

async function initDatabase() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS game_state (
                id INTEGER PRIMARY KEY,
                state JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log(
            "💾 PostgreSQL: таблица game_state готова"
        );


        const result =
            await pool.query(`
                SELECT state
                FROM game_state
                WHERE id = 1
            `);


        if (result.rows.length > 0) {

            gameState =
                result.rows[0].state;

            console.log(
                "🔄 Игра загружена из PostgreSQL"
            );

        } else {

            console.log(
                "📭 Сохранённой игры нет"
            );
        }

    } catch (error) {

        console.error(
            "❌ Ошибка PostgreSQL:",
            error
        );
    }
}


// =====================================================
// SAVE GAME
// =====================================================

async function saveGameState() {

    if (!gameState) {
        return;
    }

    try {

        await pool.query(
            `
            INSERT INTO game_state
                (id, state, updated_at)

            VALUES
                (1, $1, NOW())

            ON CONFLICT (id)

            DO UPDATE SET
                state = EXCLUDED.state,
                updated_at = NOW()
            `,
            [
                JSON.stringify(gameState)
            ]
        );

        console.log(
            "💾 Состояние сохранено"
        );

    } catch (error) {

        console.error(
            "❌ Ошибка сохранения:",
            error
        );
    }
}


// =====================================================
// HTTP SERVER
// =====================================================

const server =
    http.createServer(
        (req, res) => {

            let filePath;


            if (req.url === "/") {

                filePath =
                    path.join(
                        __dirname,
                        "index.html"
                    );

            } else {

                try {

                    filePath =
                        path.join(
                            __dirname,
                            decodeURIComponent(
                                req.url.split("?")[0]
                            )
                        );

                } catch {

                    res.writeHead(
                        400,
                        {
                            "Content-Type":
                                "text/plain; charset=utf-8"
                        }
                    );

                    res.end(
                        "Некорректный путь"
                    );

                    return;
                }
            }


            const ext =
                path.extname(filePath);


            const contentTypes = {

                ".html":
                    "text/html; charset=utf-8",

                ".js":
                    "text/javascript; charset=utf-8",

                ".css":
                    "text/css; charset=utf-8",

                ".json":
                    "application/json; charset=utf-8",

                ".png":
                    "image/png",

                ".jpg":
                    "image/jpeg",

                ".jpeg":
                    "image/jpeg",

                ".svg":
                    "image/svg+xml",

                ".ico":
                    "image/x-icon"
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
                                contentType,

                            "Cache-Control":
                                "no-cache, no-store, must-revalidate"
                        }
                    );


                    res.end(data);
                }
            );
        }
    );


// =====================================================
// WEBSOCKET
// =====================================================

const wss =
    new WebSocket.Server({
        server
    });


// =====================================================
// SEND
// =====================================================

function send(socket, data) {

    if (
        !socket
    ) {
        return;
    }


    if (
        socket.readyState !==
        WebSocket.OPEN
    ) {
        return;
    }


    try {

        socket.send(
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            "❌ Ошибка отправки WebSocket:",
            error
        );
    }
}


// =====================================================
// SEND STATE TO PLAYER
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
// SEND STATE TO OPERATOR
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
// SEND RESET TO EVERYONE
// =====================================================

function sendGameReset() {

    console.log(
        "📢 Отправляем gameReset всем клиентам"
    );


    for (
        const client of wss.clients
    ) {

        if (
            client.readyState ===
            WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type:
                        "gameReset"
                }
            );
        }
    }
}


// =====================================================
// RESET DATABASE
// =====================================================

async function resetDatabase() {

    console.log(
        "🗑️ Удаляем состояние из PostgreSQL..."
    );


    gameState = null;


    await pool.query(`
        DELETE FROM game_state
        WHERE id = 1
    `);


    console.log(
        "✅ PostgreSQL полностью очищен"
    );
}


// =====================================================
// CONNECTION
// =====================================================

wss.on(
    "connection",
    (socket) => {

        console.log(
            "🟢 Новое WebSocket подключение"
        );


        socket.role = null;


        // =================================================
        // MESSAGE
        // =================================================

        socket.on(
            "message",
            async (message) => {

                try {

                    const data =
                        JSON.parse(
                            message.toString()
                        );


                    if (
                        !data ||
                        typeof data.type !==
                        "string"
                    ) {

                        return;
                    }


                    console.log(
                        "📨 Получено:",
                        data.type
                    );


                    // =========================================
                    // IDENTIFY
                    // =========================================

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
                                "⚠️ Неверная роль:",
                                data.role
                            );

                            return;
                        }


                        socket.role =
                            data.role;


                        console.log(
                            "👤 Роль:",
                            socket.role
                        );


                        // Отправляем текущее состояние
                        // подключившемуся клиенту

                        if (gameState) {

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


                    // =========================================
                    // RESET GAME
                    // =========================================

                    if (
                        data.type ===
                        "resetGame"
                    ) {

                        // Только оператор
                        // может полностью сбрасывать игру

                        if (
                            socket.role !==
                            "operator"
                        ) {

                            console.warn(
                                "⚠️ Попытка resetGame не оператором"
                            );

                            return;
                        }


                        console.log(
                            "🗑️ ОПЕРАТОР НАЖАЛ СБРОС"
                        );


                        try {

                            await resetDatabase();


                            // Сообщаем всем
                            // игрокам и операторам

                            sendGameReset();


                            console.log(
                                "✅ ПОЛНЫЙ СБРОС ВЫПОЛНЕН"
                            );

                        } catch (error) {

                            console.error(
                                "❌ Ошибка полного сброса:",
                                error
                            );


                            // Сообщаем оператору,
                            // что сервер не смог удалить данные

                            send(
                                socket,
                                {
                                    type:
                                        "resetError",

                                    message:
                                        "Не удалось очистить PostgreSQL"
                                }
                            );
                        }


                        return;
                    }


                    // =========================================
                    // PLAYER → SERVER
                    // =========================================

                    if (
                        data.type ===
                        "gameState"
                    ) {

                        if (
                            socket.role !==
                            "player"
                        ) {

                            console.warn(
                                "⚠️ gameState не от игрока"
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
                            "🎮 Состояние игрока получено"
                        );


                        await saveGameState();


                        sendToOperator();


                        return;
                    }


                    // =========================================
                    // OPERATOR → SERVER
                    // =========================================

                    if (
                        data.type ===
                        "operatorState"
                    ) {

                        if (
                            socket.role !==
                            "operator"
                        ) {

                            console.warn(
                                "⚠️ operatorState не от оператора"
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
                            "🖥️ Состояние изменено оператором"
                        );


                        await saveGameState();


                        sendToPlayer();


                        return;
                    }


                    // =========================================
                    // UNKNOWN MESSAGE
                    // =========================================

                    console.warn(
                        "⚠️ Неизвестный тип:",
                        data.type
                    );

                } catch (error) {

                    console.error(
                        "❌ Ошибка обработки сообщения:",
                        error
                    );
                }
            }
        );


        // =================================================
        // CLOSE
        // =================================================

        socket.on(
            "close",
            () => {

                console.log(
                    "🔴 Клиент отключён:",
                    socket.role ||
                    "неизвестный"
                );
            }
        );


        // =================================================
        // ERROR
        // =================================================

        socket.on(
            "error",
            (error) => {

                console.error(
                    "❌ WebSocket ошибка:",
                    error.message
                );
            }
        );

    }
);


// =====================================================
// START
// =====================================================

initDatabase()
    .then(() => {

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

    })
    .catch(
        (error) => {

            console.error(
                "❌ Не удалось запустить сервер:",
                error
            );

            process.exit(1);
        }
    );