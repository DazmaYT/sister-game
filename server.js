const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { Pool } = require("pg");


// =====================================================
// CONFIG
// =====================================================

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


// =====================================================
// СОСТОЯНИЕ ИГРЫ
// =====================================================

let gameState = null;


// =====================================================
// POSTGRESQL
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


        const result = await pool.query(`
            SELECT state
            FROM game_state
            WHERE id = 1
        `);


        if (result.rows.length > 0) {

            gameState = result.rows[0].state;

            console.log(
                "🔄 Состояние игры загружено из PostgreSQL:",
                gameState.currentStage
            );

        } else {

            console.log(
                "📭 В PostgreSQL пока нет сохранённой игры"
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
// СОХРАНЕНИЕ ИГРЫ
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
            "💾 Состояние сохранено в PostgreSQL:",
            gameState.currentStage
        );


    } catch (error) {

        console.error(
            "❌ Ошибка сохранения состояния:",
            error
        );
    }
}


// =====================================================
// HTTP SERVER
// =====================================================

const server = http.createServer(
    (req, res) => {

        let filePath;


        if (req.url === "/") {

            filePath = path.join(
                __dirname,
                "index.html"
            );

        } else {

            try {

                const cleanUrl =
                    decodeURIComponent(
                        req.url.split("?")[0]
                    );

                filePath = path.join(
                    __dirname,
                    cleanUrl
                );

            } catch (error) {

                res.writeHead(
                    400,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );

                res.end(
                    "Некорректный URL"
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
                            contentType
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
// ОТПРАВИТЬ ИГРОКУ
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
// ОТПРАВИТЬ ОПЕРАТОРУ
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
// ОТПРАВИТЬ СБРОС ВСЕМ
// =====================================================

function broadcastGameReset() {

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
// WEBSOCKET CONNECTION
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


                    if (!data || !data.type) {

                        console.warn(
                            "⚠️ Получено некорректное сообщение"
                        );

                        return;
                    }


                    // =========================================
                    // РЕГИСТРАЦИЯ
                    // =========================================

                    if (
                        data.type ===
                        "identify"
                    ) {

                        if (
                            data.role !== "player" &&
                            data.role !== "operator"
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
                            "👤 Клиент зарегистрирован как:",
                            socket.role
                        );


                        // Если игра уже есть —
                        // сразу отправляем состояние.

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


                                console.log(
                                    "📤 Состояние отправлено игроку при подключении"
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


                                console.log(
                                    "📤 Состояние отправлено оператору при подключении"
                                );
                            }
                        }


                        return;
                    }


                    // =========================================
                    // ИГРОК → СЕРВЕР
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
                                "⚠️ gameState пришёл не от игрока"
                            );

                            return;
                        }


                        if (!data.state) {

                            console.warn(
                                "⚠️ gameState не содержит state"
                            );

                            return;
                        }


                        gameState =
                            data.state;


                        console.log(
                            "📥 Получено состояние от игрока:",
                            gameState.currentStage
                        );


                        await saveGameState();


                        // Отправляем оператору

                        sendToOperator();


                        return;
                    }


                    // =========================================
                    // ПОЛНЫЙ СБРОС ИГРЫ
                    // =========================================

                    if (
                        data.type ===
                        "resetGame"
                    ) {

                        // Только оператор имеет право
                        // полностью сбрасывать игру.

                        if (
                            socket.role !==
                            "operator"
                        ) {

                            console.warn(
                                "⚠️ resetGame пришёл не от оператора"
                            );

                            return;
                        }


                        console.log(
                            "🗑️ Оператор запросил полный сброс игры"
                        );


                        try {

                            // ---------------------------------
                            // 1. Сбрасываем память сервера
                            // ---------------------------------

                            gameState = null;


                            // ---------------------------------
                            // 2. Удаляем состояние PostgreSQL
                            // ---------------------------------

                            await pool.query(`
                                DELETE FROM game_state
                                WHERE id = 1
                            `);


                            console.log(
                                "🗑️ PostgreSQL: игра полностью удалена"
                            );


                            // ---------------------------------
                            // 3. Сообщаем всем клиентам
                            // ---------------------------------

                            broadcastGameReset();


                            console.log(
                                "✅ Полный сброс игры выполнен"
                            );


                        } catch (error) {

                            console.error(
                                "❌ Ошибка полного сброса:",
                                error
                            );
                        }


                        return;
                    }


                    // =========================================
                    // ОПЕРАТОР → СЕРВЕР
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
                                "⚠️ operatorState пришёл не от оператора"
                            );

                            return;
                        }


                        if (!data.state) {

                            console.warn(
                                "⚠️ operatorState не содержит state"
                            );

                            return;
                        }


                        gameState =
                            data.state;


                        console.log(
                            "📥 Получено состояние от оператора:",
                            gameState.currentStage
                        );


                        // Сохраняем в PostgreSQL

                        await saveGameState();


                        // Отправляем игроку

                        sendToPlayer();


                        return;
                    }


                    // =========================================
                    // НЕИЗВЕСТНЫЙ ТИП
                    // =========================================

                    console.warn(
                        "⚠️ Неизвестный тип сообщения:",
                        data.type
                    );


                } catch (error) {

                    console.error(
                        "❌ Ошибка обработки WebSocket сообщения:",
                        error
                    );
                }
            }
        );


        // =================================================
        // DISCONNECT
        // =================================================

        socket.on(
            "close",
            () => {

                console.log(
                    "🔴 WebSocket отключён:",
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
// ЗАПУСК
// =====================================================

async function startServer() {

    await initDatabase();


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

            console.log(
                "🔌 WebSocket: готов"
            );
        }
    );
}


startServer();