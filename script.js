// =====================================================
// CLIENT-SIDE GAME LOGIC
// =====================================================

const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                window.location.protocol === 'file:';

const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const wsHost = (window.location.host && window.location.host !== '') ? 
               window.location.host : 'localhost:3000';

let syncSocket = null;

try {
    syncSocket = new WebSocket(`${wsProtocol}${wsHost}`);
} catch (err) {
    console.warn("WebSocket сервер недоступен, работаем локально");
}

// =====================================================
// WEBSOCKET HANDLERS
// =====================================================

if (syncSocket) {
    syncSocket.onopen = () => {
        console.log("✅ WebSocket подключен");
    };

    syncSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleServerMessage(data);
        } catch (error) {
            console.error("❌ Ошибка парсинга сообщения:", error);
        }
    };

    syncSocket.onerror = (error) => {
        console.error("❌ WebSocket ошибка:", error);
    };

    syncSocket.onclose = () => {
        console.warn("⚠️ WebSocket соединение закрыто");
    };
}

// =====================================================
// SEND MESSAGE TO SERVER
// =====================================================

function sendToServer(data) {
    if (syncSocket && syncSocket.readyState === WebSocket.OPEN) {
        try {
            syncSocket.send(JSON.stringify(data));
        } catch (error) {
            console.error("❌ Ошибка отправки:", error);
        }
    } else {
        console.warn("⚠️ WebSocket не подключен");
    }
}

// =====================================================
// HANDLE SERVER MESSAGES
// =====================================================

function handleServerMessage(data) {
    if (!data || !data.type) {
        return;
    }

    console.log("📨 Получено сообщение:", data.type);

    switch (data.type) {
        case "gameState":
            handleGameState(data.state);
            break;
        case "operatorState":
            handleOperatorState(data.state);
            break;
        case "gameReset":
            handleGameReset();
            break;
        default:
            console.warn("⚠️ Неизвестный тип сообщения:", data.type);
    }
}

// =====================================================
// GAME STATE HANDLERS
// =====================================================

function handleGameState(state) {
    if (!state) return;
    
    console.log("🎮 Получено состояние игры:", state);
    // Implement game state update logic here
}

function handleOperatorState(state) {
    if (!state) return;
    
    console.log("👤 Получено состояние оператора:", state);
    // Implement operator state update logic here
}

function handleGameReset() {
    console.log("🗑️ Сброс игры получен");
    // Implement reset logic here
}

// =====================================================
// IDENTIFY CLIENT ROLE
// =====================================================

function identifyRole(role) {
    if (role !== "player" && role !== "operator") {
        console.error("❌ Неверная роль:", role);
        return;
    }

    sendToServer({
        type: "identify",
        role: role
    });

    console.log("✅ Роль отправлена:", role);
}

// =====================================================
// RESET GAME (OPERATOR ONLY)
// =====================================================

function resetGame() {
    sendToServer({
        type: "resetGame"
    });

    console.log("🗑️ Команда сброса отправлена");
}

// =====================================================
// SEND GAME ACTION
// =====================================================

function sendGameAction(action) {
    if (!action || !action.type) {
        console.error("❌ Некорректное действие");
        return;
    }

    sendToServer({
        type: "action",
        action: action
    });

    console.log("📤 Действие отправлено:", action.type);
}
