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

const PORT = process.env.PORT || 3000;


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


        const result = await pool.query(`
            SELECT state
            FROM game_state
            WHERE id = 1
        `);


        if (result.rows.length > 0) {

            gameState = result.rows[0].state;

            console.log(
                "🔄 Состояние игры загружено из PostgreSQL"
            );

        } else {

            console.log(
                "📭 В PostgreSQL сохранённой игры нет"
            );
        }

    } catch (error) {

        console.error(
            "❌ Ошибка PostgreSQL:",
            error
        );

        throw error;
    }
}


// =====================================================
// SAVE GAME STATE
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
            "💾 Состояние сохранено в PostgreSQL"
        );

    } catch (error) {

        console.error(
            "❌ Ошибка сохранения:",
            error
        );
    }
}


// =====================================================
// ПОЛНЫЙ RESET DATABASE
// =====================================================

async function resetDatabase() {

    console.log(
        "🗑️ НАЧИНАЕМ ПОЛНЫЙ СБРОС"
    );

    // Сначала память сервера
    gameState = null;

    // Затем база
    await pool.query(`
        DELETE FROM game_state
        WHERE id = 1
    `);

    // Дополнительно VACUUM здесь НЕ нужен:
    // DELETE полностью удаляет запись id=1.

    console.log(
        "✅ PostgreSQL: game_state полностью очищен"
    );
}


// =====================================================
// HTTP SERVER
// =====================================================

const server = http.createServer((req, res) => {

    let filePath;

    try {

        if (req.url === "/") {

            filePath = path.join(
                __dirname,
                "index.html"
            );

        } else {

            const requestedPath =
                decodeURIComponent(
                    req.url.split("?")[0]
                );

            filePath = path.join(
                __dirname,
                requestedPath
            );
        }

    } catch (error) {

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
                        "no-store, no-cache, must-revalidate, proxy-revalidate",

                    "Pragma":
                        "no-cache",

                    "Expires":
                        "0"
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
// SEND
// =====================================================

function send(socket, data) {

    if (
        !socket ||
        socket.readyState !== WebSocket.OPEN
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


    for (const client of wss.clients) {

        if (
            client.role === "player" &&
            client.readyState === WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type: "operatorState",
                    state: gameState
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


    for (const client of wss.clients) {

        if (
            client.role === "operator" &&
            client.readyState === WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type: "gameState",
                    state: gameState
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


    for (const client of wss.clients) {

        if (
            client.readyState === WebSocket.OPEN
        ) {

            send(
                client,
                {
                    type: "gameReset"
                }
            );
        }
    }
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
                        typeof data.type !== "string"
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
                        data.type === "identify"
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
                            "👤 Роль:",
                            socket.role
                        );


                        /*
                         * ВАЖНО:
                         *
                         * Если gameState === null,
                         * НИЧЕГО игроку не отправляем.
                         *
                         * Это означает, что после полного reset
                         * новый игрок НЕ получит старый этап.
                         */

                        if (gameState) {

                            if (
                                socket.role === "player"
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
                                socket.role === "operator"
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
                        data.type === "resetGame"
                    ) {

                        if (
                            socket.role !== "operator"
                        ) {

                            console.warn(
                                "⚠️ resetGame пришёл не от оператора"
                            );

                            return;
                        }


                        console.log(
                            "🗑️ ОПЕРАТОР НАЖАЛ ПОЛНЫЙ СБРОС"
                        );


                        try {

                            /*
                             * 1. Удаляем состояние
                             *    из памяти Node.js.
                             */

                            gameState = null;


                            /*
                             * 2. Удаляем состояние
                             *    из PostgreSQL.
                             */

                            await pool.query(`
                                DELETE FROM game_state
                                WHERE id = 1
                            `);


                            /*
                             * 3. Проверяем,
                             *    что запись действительно удалена.
                             */

                            const check =
                                await pool.query(`
                                    SELECT id
                                    FROM game_state
                                    WHERE id = 1
                                `);


                            if (check.rows.length > 0) {

                                throw new Error(
                                    "Запись game_state всё ещё существует после DELETE"
                                );
                            }


                            console.log(
                                "✅ PostgreSQL полностью очищен"
                            );


                            /*
                             * 4. Отправляем reset
                             *    ВСЕМ подключённым клиентам.
                             */

                            sendGameReset();


                            console.log(
                                "✅ ПОЛНЫЙ СБРОС ВЫПОЛНЕН"
                            );

                        } catch (error) {

                            console.error(
                                "❌ Ошибка полного сброса:",
                                error
                            );


                            send(
                                socket,
                                {
                                    type: "resetError",

                                    message:
                                        "Не удалось полностью очистить игру"
                                }
                            );
                        }


                        return;
                    }


                    // =========================================
                    // PLAYER → SERVER
                    // =========================================

                    if (
                        data.type === "gameState"
                    ) {

                        if (
                            socket.role !== "player"
                        ) {

                            console.warn(
                                "⚠️ gameState пришёл не от игрока"
                            );

                            return;
                        }


                        if (!data.state) {
                            return;
                        }


                        /*
                         * Если состояние уже было сброшено,
                         * игрок может создать новое состояние.
                         */

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
                        data.type === "operatorState"
                    ) {

                        if (
                            socket.role !== "operator"
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
// START SERVER
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