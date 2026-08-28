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
let currentRole = null;

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
    updateOperatorUI(state);
}

function handleOperatorState(state) {
    if (!state) return;
    
    console.log("👤 Получено состояние оператора:", state);
    updatePlayerUI(state);
}

function handleGameReset() {
    console.log("🗑️ Сброс игры получен");
    resetLocalGame();
}

// =====================================================
// UI UPDATES
// =====================================================

function updatePlayerUI(state) {
    if (!state) return;
    
    const stage = state.stage || 1;
    const progress = state.progress || 0;
    
    document.getElementById('playerProgress').textContent = `ЭТАП ${stage} / 11`;
    document.getElementById('playerPercent').textContent = `${Math.round(progress * 100)}%`;
    
    const progressBar = document.getElementById('playerProgressBar');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }
}

function updateOperatorUI(state) {
    if (!state) return;
    
    const stage = state.stage || 1;
    const progress = state.progress || 0;
    
    document.getElementById('operatorStage').textContent = `ЭТАП ${stage}`;
    document.getElementById('operatorStageNumber').textContent = String(stage).padStart(2, '0');
    
    const progressBar = document.getElementById('operatorProgressBar');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }
}

// =====================================================
// SCREEN MANAGEMENT
// =====================================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// =====================================================
// ROLE SELECTION
// =====================================================

function selectRole(role) {
    if (role !== "player" && role !== "operator") {
        console.error("❌ Неверная роль:", role);
        return;
    }

    currentRole = role;
    
    sendToServer({
        type: "identify",
        role: role
    });

    console.log("✅ Роль отправлена:", role);
    
    if (role === "player") {
        showScreen('playerScreen');
    } else if (role === "operator") {
        showScreen('operatorScreen');
    }
}

// =====================================================
// RESET GAME
// =====================================================

function resetLocalGame() {
    console.log("🗑️ Сброс игры");
    
    sendToServer({
        type: "resetGame"
    });

    currentRole = null;
    showScreen('roleScreen');
}

function resetGame() {
    resetLocalGame();
}

// =====================================================
// GO BACK
// =====================================================

function backToRoles() {
    currentRole = null;
    showScreen('roleScreen');
}

// =====================================================
// PLAYER ACTIONS
// =====================================================

function submitPlayerGuess() {
    const guessInput = document.getElementById('playerGuess');
    if (!guessInput) return;
    
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showToast("Введите число от 1 до 100");
        return;
    }

    sendGameAction({
        type: "guess",
        value: guess
    });

    guessInput.value = '';
}

// =====================================================
// OPERATOR ACTIONS
// =====================================================

function operatorNext() {
    console.log("✓ Подтвердить этап");
    
    sendToServer({
        type: "operatorAction",
        action: "nextStage"
    });
}

function operatorReset() {
    console.log("↻ Сбросить квест");
    
    if (confirm("Вы уверены, что хотите сбросить весь квест?")) {
        sendToServer({
            type: "resetGame"
        });
    }
}

// =====================================================
// PENALTY SYSTEM
// =====================================================

let selectedPenalty = null;

function openPenaltyModal() {
    const modal = document.getElementById('penaltyModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closePenaltyModal() {
    const modal = document.getElementById('penaltyModal');
    if (modal) {
        modal.style.display = 'none';
    }
    selectedPenalty = null;
}

function closePenaltyOutside(event) {
    if (event.target.id === 'penaltyModal') {
        closePenaltyModal();
    }
}

function selectPenalty(penalty) {
    selectedPenalty = penalty;
    console.log("Выбрано наказание:", penalty);
}

function sendPenalty() {
    const customPenalty = document.getElementById('customPenalty');
    const penalty = customPenalty && customPenalty.value ? customPenalty.value : selectedPenalty;
    
    if (!penalty) {
        showToast("Выберите или введите наказание");
        return;
    }

    sendToServer({
        type: "operatorAction",
        action: "penalty",
        penalty: penalty
    });

    closePenaltyModal();
    showToast("✓ Наказание отправлено");
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

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =====================================================
// IDENTIFY CLIENT ROLE
// =====================================================

function identifyRole(role) {
    if (role !== "player" && role !== "operator") {
        console.error("❌ Неверная роль:", role);
        return;
    }

    selectRole(role);
}

