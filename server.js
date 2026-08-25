const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

// ===============================
// HTTP-СЕРВЕР
// ===============================

const server = http.createServer((req, res) => {
    let filePath;

    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
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

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end("Файл не найден");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
});


// ===============================
// WEBSOCKET
// ===============================

const wss = new WebSocket.Server({
    server
});

wss.on("connection", (socket) => {
    console.log("🟢 Новое подключение");

    socket.on("message", (message) => {
        console.log("📨 Получено сообщение");

        // Отправляем сообщение ВСЕМ,
        // кроме того, кто его отправил.
        for (const client of wss.clients) {

            if (
                client !== socket &&
                client.readyState === WebSocket.OPEN
            ) {
                client.send(message);
            }
        }
    });

    socket.on("close", () => {
        console.log("🔴 Подключение закрыто");
    });

    socket.on("error", (error) => {
        console.error(
            "❌ WebSocket ошибка:",
            error.message
        );
    });
});


// ===============================
// ЗАПУСК
// ===============================

server.listen(PORT, () => {
    console.log("");
    console.log("================================");
    console.log("🚀 CASE18 SERVER ЗАПУЩЕН");
    console.log("================================");
    console.log("");
    console.log(
        `🌐 http://localhost:${PORT}`
    );
    console.log("");
    console.log(
        "👥 Подключённые устройства:",
        wss.clients.size
    );
    console.log("");
});