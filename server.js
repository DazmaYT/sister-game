const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const PORT = process.env.PORT || 3000;


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


        // Загружаем последнее состояние игры

        const result = await pool.query(`
            SELECT state
            FROM game_state
            WHERE id = 1
        `);


        if (result.rows.length > 0) {

            gameState =
                result.rows[0].state;

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

async function saveGameState() {

    if (!gameState) {
        return;
    }

    try {

        await pool.query(`
            INSERT INTO game_state
                (id, state, updated_at)
            VALUES
                (1, $1, NOW())

            ON CONFLICT (id)
            DO UPDATE SET
                state = EXCLUDED.state,
                updated_at = NOW()
        `, [
            JSON.stringify(gameState)
        ]);

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

        socket.on(
            "message",
            async (message) => {

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
                            data.role !== "player" &&
                            data.role !== "operator"
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

                        if (!data.state) {
                            return;
                        }

                        gameState =
                            data.state;

                        console.log(
                            "💾 Состояние игрока получено:",
                            gameState.currentStage
                        );

                        await saveGameState();

                        sendToOperator();

                        return;
                    }


                        // =====================================
                        // ПОЛНЫЙ СБРОС ИГРЫ
                        // =====================================

                        if (data.type === "resetGame") {

                            if (socket.role !== "operator") {

                                console.warn(
                                    "⚠️ resetGame пришёл не от оператора"
                                );

                                return;
                            }


                            console.log(
                                "🗑️ Оператор запросил полный сброс игры"
                            );


                            try {

                                // Удаляем состояние из памяти
                                gameState = null;


                                // Удаляем состояние из PostgreSQL
                                await pool.query(`
                                    DELETE FROM game_state
                                    WHERE id = 1
                                `);


                                console.log(
                                    "🗑️ PostgreSQL: состояние игры полностью удалено"
                                );


                                // Сообщаем ВСЕМ клиентам
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
                                                type: "gameReset"
                                            }
                                        );
                                    }
                                }


                                console.log(
                                    "🔄 Всем клиентам отправлен gameReset"
                                );


                            } catch (error) {

                                console.error(
                                    "❌ Ошибка полного сброса:",
                                    error
                                );
                            }


                            return;
                        }


                        // Отправляем сброс всем клиентам

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

                        if (!data.state) {
                            return;
                        }

                        gameState =
                            data.state;

                        console.log(
                            "💾 Оператор изменил состояние:",
                            gameState.currentStage
                        );

                        await saveGameState();

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


        // =====================================
        // ОТКЛЮЧЕНИЕ
        // =====================================

        socket.on(
            "close",
            () => {

                console.log(
                    "🔴 Отключён:",
                    socket.role ||
                    "неизвестный"
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

initDatabase().then(() => {

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

});