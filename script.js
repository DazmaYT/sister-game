

"use strict";

/* =====================================================
   CONFIG
===================================================== */

const EARLY_STAGES = 10;
const TOTAL_STAGES = 18;
const STORAGE_KEY = "case18_v4";

/* =====================================================
   QUEST DATA
===================================================== */
const globalPenaltyButtonHtml = `
        <div
            class="operator-action"
            style="
                margin-top:15px;
                border-top:1px solid #333;
                padding-top:15px;
            "
        >
            <button
                class="admin-btn danger"
                type="button"
                style="
                    width:100%;
                    padding:12px;
                    border-radius:8px;
                    font-weight:bold;
                    cursor:pointer;
                "
                onclick="openManualPenaltyModal()"
            >
                ⚠ ВЫДАТЬ НАКАЗАНИЕ
            </button>
        </div>
    `;
const stages = [

    /* =================================================
       1
    ================================================= */

    {
        id: 1,
        title: "Экзамен на сестру",
        location: "📍 ДОМА",
        label: "START / 01",

        text: `
Для начала докажи,
что ты действительно моя сестра.

Ответь на 3 вопроса обо мне:

🔧 Какой мой любимый цвет?

🔧 В какой игре я больше всего провожу времени?

🔧 Какое моё любимое слово?
        `,

        type: "manual",
        operatorConfirm: true
    },

    


    /* =================================================
       2
    ================================================= */

    {
        id: 2,
        title: "Кто это сказал?",
        location: "📍 ДОМА",
        label: "BRAIN TEST / 02",

        text: `
Угадай, кто из домашних обычно
произносит эти фразы:

«Я только на пять минут».

«Я не хочу есть».

«Выключи свет».
        `,

        instruction: `
После выполнения оператор подтвердит
переход к следующему этапу.
        `,

        type: "manual",
        operatorConfirm: true
    },


    /* =================================================
       3
    ================================================= */

    {
        id: 3,
        title: "Томик из прошлого",
        location: "📍 ВОЗЛЕ КЛЕТКИ С ТОМЧИКОМ",
        label: "MEMORY / 03",

        text: `
Раньше ты проводила со мной
всё своё время.

Тискала и играла.

А сейчас я просто наблюдаю за тобой
со стороны.

Но сегодня я помогу тебе продвинуться.

Найди меня.
        `,

        type: "manual",
        operatorConfirm: true
    },


    /* =================================================
       4
    ================================================= */

    {
        id: 4,
        title: "Логика",
        location: "📍 ДОМА",
        label: "LOGIC TEST / 04",

        text: `
Есть три коробки:

А — ПОДАРОК
Б — ПУСТО
В — ПОДСКАЗКА

Все надписи на коробках — ложные.

Можно открыть только одну.

Какую выберешь?
        `,

        type: "choice",

        choices: [
            {
                text: "А — ПОДАРОК",
                correct: false
            },
            {
                text: "Б — ПУСТО",
                correct: true
            },
            {
                text: "В — ПОДСКАЗКА",
                correct: false
            }
        ],

        penalty: false
    },


    /* =================================================
       5
    ================================================= */

    {
        id: 5,
        title: "Звонок по шифру",
        location: "📍 ДОМА",
        label: "CODE BREAK / 05",

        text: `
Перед тобой зашифрованное слово:

13 — 1 — 13 — 1

Расшифруй его по порядку букв
русского алфавита.

Введи получившееся слово.

После правильной расшифровки
ты получишь следующее действие.
        `,

        type: "textAnswer",

        answer: "мама",

        hintAfter: `
🔓 ШИФР РАЗГАДАН.

Получатель найден:

❤️ МАМА

Теперь тебе нужно позвонить
этому человеку.

📞 ПОЗВОНИ МАМЕ.

После звонка возвращайся сюда
и нажми кнопку ниже.
        `
    },


    /* =================================================
       6
    ================================================= */

    {
        id: 6,
        title: "Сайт №18",
        location: "📱 ТЕЛЕФОН",
        label: "SYSTEM / 06",

        text: `
Для продолжения необходимо
активировать систему №18.

Сначала отсканируй QR-код,
который получила на предыдущем этапе.
        `,

        type: "qr",

        password: "18"
    },


    /* =================================================
       7
    ================================================= */

    {
        id: 7,
        title: "Тест на взрослость",
        location: "📱 НА САЙТЕ",
        label: "ADULT TEST / 07",

        text: `
Проверяем уровень взрослости.

Ответь на 3 вопроса.
        `,

        type: "adult",

        questions: [

            {
                question:
                    "1. У тебя осталось 500 ₸. Твои действия?",

                choices: [
                    {
                        text: "А) Экономлю.",
                        correct: false
                    },
                    {
                        text: "Б) Заказываю доставку еды.",
                        correct: true
                    },
                    {
                        text: "В) Живём один раз!",
                        correct: false
                    }
                ]
            },

            {
                question:
                    "2. На кассе пробили товар по другой цене. Что делать?",

                choices: [
                    {
                        text: "А) Молча заплачу.",
                        correct: false
                    },
                    {
                        text:
                            "Б) Попрошу администратора и покажу ценник.",
                        correct: true
                    },
                    {
                        text: "В) Устрою скандал.",
                        correct: false
                    }
                ]
            },

            {
                question:
                    "3. В субботу в 8:00 соседи начали сверлить.",

                choices: [
                    {
                        text:
                            "А) Познакомлюсь с перфоратором.",
                        correct: false
                    },
                    {
                        text:
                            "Б) Завернусь в одеяло и буду плакать.",
                        correct: false
                    },
                    {
                        text:
                            "В) Тяжело вздохну и смирюсь.",
                        correct: true
                    }
                ]
            }
        ],

        penalty: true
    },


    /* =================================================
       8
    ================================================= */

    {
        id: 8,
        title: "Тройной маршрут",
        location: "📍 МАГАЗИН / РАБОТА",
        label: "FIELD MISSION / 08",

        text: `
Ты прибыла на место.

Начинается тройной маршрут.

Каждая точка должна быть подтверждена
оператором.
        `,

        type: "route",

        steps: [
            `
📍 ТОЧКА 1

Найди того, кто пришёл сегодня
на смену раньше всех
и уже заварил чай.
            `,

            `
📍 ТОЧКА 2

Найди человека,
у которого сегодня законный выходной,
но он почему-то здесь.
            `,

            `
📍 ТОЧКА 3

Найди нашу крестную маму.
            `
        ]
    },


    /* =================================================
       9
    ================================================= */

    {
        id: 9,
        title: "18 секунд",
        location: "📍 В МАГАЗИНЕ",
        label: "SPEED TEST / 09",

        text: `
Оператор сначала выберет
задание для этого испытания.

После этого тебе появится
конкретная миссия.

Когда будешь полностью готова —
нажми «ГОТОВА».

Только после этого начнётся
18-секундный отсчёт.
        `,

        type: "timer",

        timer: 18,

        tasks: [

            {
                title: "КРАСНЫЙ ОБЪЕКТ",

                text: `
За 18 секунд:

1. Найди что-нибудь красное.
2. Коснись этого предмета.
3. Вернись к телефону.
                `
            },

            {
                title: "ТРИ НАПИТКА",

                text: `
За 18 секунд:

Назови оператору 3 розливного
пива, которые продаются здесь.
                `
            },

            {
                title: "СКОРОСТНОЙ ПОИСК",

                text: `
За 18 секунд:

Найди любой предмет,
на котором есть цифра 18.

Покажи его оператору.
                `
            }
        ]
    },


    /* =================================================
       10
    ================================================= */

    {
        id: 10,
        title: "Следующий след",
        location: "📍 ДОМА",
        label: "TRACK / 10",

        text: `
Финишная прямая.

Следующая подсказка находится
там, где ты чаще всего
оставляешь заряжаться телефон.
        `,

        instruction: `
Найди это место.

После выполнения нажми:
«Задание выполнено».

Оператор подтвердит переход.
        `,

        type: "manual",
        operatorConfirm: true
    },


    /* =================================================
       11
    ================================================= */

    {
        id: 11,
        title: "Второй уровень",
        location: "📍 ДОМА",
        label: "LEVEL TWO / 11",

        text: `
Поздравляем.

Ты прошла первый уровень.

Но...

это был только первый уровень.

Впереди ещё семь испытаний.

И теперь игры становятся сложнее.
        `,

        type: "unlock"
    },


    /* =================================================
       12
    ================================================= */

    {
        id: 12,
        title: "Дуэль с братом",
        location: "📍 ДОМА",
        label: "BATTLE / 12",

        text: `
Камень — ножницы — бумага.

Сделай свой выбор.

Оператор увидит твой ход,
но ты не увидишь его выбор,
пока он сам не сделает ход.

После этого появится результат дуэли.
        `,

        type: "rps"
    },


    /* =================================================
       13
    ================================================= */
{
    id: 13,
    title: "Башня памяти",
    location: "📍 ДОМА",
    label: "MEMORY TEST / 13",

    text: `
Назови без запинки за 10 секунд:

• год своего рождения;

• сколько лет нашим родителям;

• в каком году родился твой брат.

После ответа нажми кнопку.
Оператор проверит результат.
    `,

    type: "memory",
    timer: 10
},


    /* =================================================
       ЭТАП 14
    ================================================= */
   {
        id: 14,
        title: "Guess Game",
        location: "📍 ДОМА",
        label: "GUESS / 14",
        text: "Ожидайте оператора.",
        type: "guess"
    },


    /* =================================================
       15
    ================================================= */

    {
        id: 15,
        title: "Запомни последовательность",
        location: "📍 ДОМА",
        label: "MEMORY GAME / 15",

        text: `
Сейчас на экране появится
пятизначная последовательность.

У тебя есть несколько секунд,
чтобы её запомнить.

После этого она исчезнет.

Введи её в правильном порядке.
        `,

        type: "sequenceGame"
    },


    /* =================================================
       16
    ================================================= */
{
    id: 16,
    title: "Поймай зелёный",
    location: "📍 ДОМА",
    label: "REACTION / 16",

    text: `
Проверим скорость реакции.

Когда экран станет зелёным —
нажми как можно быстрее.

Не нажимай раньше времени.
    `,

    type: "reaction"
},


    /* =================================================
       17
    ================================================= */

    {
        id: 17,
        title: "Последний ход",
        location: "📍 ДОМА",
        label: "FINAL GAME / 17",

        text: `
Перед тобой три закрытые карты.

Только одна карта ведёт
к закрытию дела №18.

Выбери карту.

Если не угадала —
ничего страшного.

Можно попробовать ещё раз.
        `,

        type: "cards",

        correctCard: 2
    },


    /* =================================================
       18
    ================================================= */

    {
        id: 18,
        title: "ДЕЛО №18 ЗАКРЫТО",
        location: "📍 ПРАЗДНИЧНЫЙ СТОЛ",
        label: "CASE CLOSED / 18",

        type: "final",

        text: `
🎉 ДЕЛО №18 ЗАКРЫТО.

Ты прошла все 17 игровых испытаний.

Объект успешно прошёл проверку.

Твоя награда:

💰 18 000 ₸

Использовать по своему усмотрению.

Потратить всё за один день —
строго разрешается.

Потратить на какую-нибудь фигню —
тоже разрешается.

❤️ С 18-летием, сестрёнка!

Сегодня ты официально
получила новый уровень взрослости.

Дело закрыто.

Но приключения только начинаются.
        `
    }
];

// ==========================================
// СИНХРОНИЗАЦИЯ ИГРОК ↔ ОПЕРАТОР
// ==========================================

const wsProtocol =
    window.location.protocol === "https:"
        ? "wss:"
        : "ws:";

const syncSocket = new WebSocket(
    `${wsProtocol}//${window.location.host}`
);

let isReceivingRemoteState = false;
let lastSentState = null;


// ==========================================
// ПОДКЛЮЧЕНИЕ
// ==========================================

syncSocket.addEventListener("open", () => {
    console.log("🟢 Синхронизация подключена");
});

syncSocket.addEventListener("close", () => {
    console.log("🔴 Синхронизация отключена");
});

syncSocket.addEventListener("error", (error) => {
    console.error(
        "❌ Ошибка синхронизации:",
        error
    );
});


// ==========================================
// ПОЛУЧЕНИЕ СОСТОЯНИЯ
// ==========================================

syncSocket.addEventListener("message", async (event) => {

    try {

        let text;

        // WebSocket может вернуть Blob
        if (event.data instanceof Blob) {

            text = await event.data.text();

        } else if (event.data instanceof ArrayBuffer) {

            text = new TextDecoder().decode(
                event.data
            );

        } else {

            text = event.data;
        }


        const message = JSON.parse(text);


        // ==========================================
        // ИГРОК → ОПЕРАТОР
        // ==========================================

        if (message.type === "gameState") {

            // Получать состояние игрока должен оператор
            if (currentRole !== "operator") {
                return;
            }

            if (!message.state) {
                return;
            }


            console.log(
                "🔄 Получено состояние игрока"
            );


            // Сохраняем отдельную копию состояния игрока
            operatorPlayerState = message.state;


            // Обновляем экран оператора
            if (typeof renderOperator === "function") {
                renderOperator();
            }


            return;
        }


        // ==========================================
        // ОПЕРАТОР → ИГРОК
        // ==========================================

        if (message.type === "operatorState") {

            // Получать команды оператора должен игрок
            if (currentRole !== "player") {
                return;
            }

            if (!message.state) {
                return;
            }


            console.log(
                "🔄 Получено состояние от оператора"
            );


            // Пока получаем состояние,
            // не отправляем его обратно
            isReceivingRemoteState = true;


            // Обновляем состояние игрока
            state = message.state;


            // Сохраняем локально
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );


            // Обновляем экран игрока
            if (typeof renderPlayer === "function") {
                renderPlayer();
            }


            // Даём renderPlayer закончить работу,
            // затем снова разрешаем отправку
            setTimeout(() => {
                isReceivingRemoteState = false;
            }, 100);


            return;
        }


    } catch (error) {

        console.error(
            "❌ Ошибка обработки синхронизации:",
            error
        );

    }

});


// ==========================================
// ОТПРАВКА СОСТОЯНИЯ
// ==========================================

function sendGameState() {

    // Только игрок автоматически отправляет состояние
    if (currentRole !== "player") {
        return;
    }

    if (isReceivingRemoteState) {
        return;
    }

    if (syncSocket.readyState !== WebSocket.OPEN) {
        return;
    }

    const stateString = JSON.stringify(state);

    if (stateString === lastSentState) {
        return;
    }

    lastSentState = stateString;

    syncSocket.send(
        JSON.stringify({
            type: "gameState",
            state: state
        })
    );

    console.log("📤 Состояние отправлено");
}

function sendOperatorState(playerState) {

    if (currentRole !== "operator") {
        return;
    }

    if (syncSocket.readyState !== WebSocket.OPEN) {
        console.warn(
            "⚠️ WebSocket ещё не подключён"
        );
        return;
    }

    syncSocket.send(
        JSON.stringify({
            type: "operatorState",
            state: playerState
        })
    );

    console.log(
        "📤 Оператор отправил состояние игроку"
    );
}

/* =====================================================
   STATE
===================================================== */
let currentRole = null;

let operatorPlayerState = null;

let state = {

    currentStage: 1,

    completed: [],

    revealedSecondPart: false,

    qrUnlocked: false,

    penalty: null,
    penaltyCompleted: false,

    routeStep: 0,
    routeConfirmed: [],

    timerTask: null,
    timerSelected: false,
    timerReady: false,
    timerRunning: false,
    timerFinished: false,
    timerStartedAt: null,
    timerOperatorResult: null,
    timerReport: null,

    rpsPlayer: null,
    rpsOperator: null,

    adultIndex: 0,
    adultScore: 0,
    adultFinished: false,
    playerId: null,
    guessNumber: null,

    sequenceGame: null,

    reactionGame: null,

    cardsGameFinished: false,

    logs: [],

    pendingOperator: null
};

let lastProcessedTime = 0;


/* =====================================================
   LOAD / SAVE
===================================================== */

function loadState() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {

        state = {
            ...state,
            ...JSON.parse(saved)
        };

    } catch (e) {

        console.error(
            "Ошибка загрузки:",
            e
        );
    }
}


function resetLocalGame() {

    const confirmed = confirm(
        "Сбросить игру на этом устройстве?\n\n" +
        "Весь локальный прогресс будет удалён."
    );

    if (!confirmed) {
        return;
    }

    // Удаляем сохранённое состояние
    localStorage.removeItem(STORAGE_KEY);

    // Если есть сохранённый ID игрока — тоже удаляем
    localStorage.removeItem("player_id");

    // Перезагружаем страницу
    location.reload();
}

function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

    if (isReceivingRemoteState) {
        return;
    }


    sendGameState();
}


/* =====================================================
   LOG
===================================================== */

function addLog(text) {

    state.logs.unshift({

        text,

        time:
            new Date().toLocaleTimeString(
                "ru-RU",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
    });

    state.logs =
        state.logs.slice(0, 40);

    saveState();
}


/* =====================================================
   ROLE
===================================================== */

function selectRole(role) {

    currentRole = role;

    document
        .querySelectorAll(".screen")
        .forEach(
            x =>
                x.classList.remove(
                    "active"
                )
        );

    if (role === "player") {

        document
            .getElementById(
                "playerScreen"
            )
            .classList.add("active");

        renderPlayer();
    }

    if (role === "operator") {

        document
            .getElementById("operatorScreen")
            .classList.add("active");

        renderOperator();

    }
}


function backToRoles() {

    document
        .querySelectorAll(".screen")
        .forEach(
            x =>
                x.classList.remove(
                    "active"
                )
        );

    document
        .getElementById(
            "roleScreen"
        )
        .classList.add("active");
}


/* =====================================================
   PLAYER
===================================================== */

function renderPlayer() {

    clearInterval(timerInterval);

    // =========================================
    // ФИНАЛ
    // =========================================

    if (state.currentStage === 18) {
        showFinal();
        return;
    }

    // =========================================
    // ТЕКУЩИЙ ЭТАП
    // =========================================

    const stage =
        stages[state.currentStage - 1];

    if (!stage) {

        console.error(
            "Этап не найден:",
            state.currentStage
        );

        return;
    }

    updatePlayerProgress();

    const container =
        document.getElementById("playerStage");

    const action =
        document.getElementById("playerAction");

    if (!container || !action) {

        console.error(
            "Не найдены playerStage/playerAction"
        );

        return;
    }

    // =========================================
    // ШАПКА ЭТАПА
    // =========================================

    container.innerHTML = `

        <div class="stage-head">

            <div class="stage-number">
                ${stage.label}
            </div>

            <h1 class="stage-title">
                ${stage.title}
            </h1>

            <div class="stage-location">
                ${stage.location}
            </div>

        </div>

        <div id="stageContent"></div>
    `;

    action.innerHTML = "";

    // =========================================
    // ОСНОВНОЙ КОНТЕНТ ЭТАПА
    // =========================================

    renderStageType(stage);

    // =========================================
    // ШТРАФ
    // =========================================

    /*
     * Если оператор назначил наказание,
     * показываем его игроку.
     */
    if (
        state.penalty &&
        state.pendingOperator &&
        (
            state.pendingOperator.type ===
                "penaltyAssigned"
            ||
            state.pendingOperator.type ===
                "penaltyCompleted"
        )
    ) {

        renderPenaltyPlayer();
    }
}


/* =====================================================
   PLAYER PROGRESS
===================================================== */

function updatePlayerProgress() {

    const unlocked =
        state.currentStage > EARLY_STAGES
            ? TOTAL_STAGES
            : EARLY_STAGES;

    const percent =
        Math.round(
            (
                (state.currentStage - 1)
                /
                unlocked
            ) * 100
        );

    const progress =
        document.getElementById(
            "playerProgress"
        );

    const percentElement =
        document.getElementById(
            "playerPercent"
        );

    const bar =
        document.getElementById(
            "playerProgressBar"
        );

    if (progress) {

        progress.innerText =
            `ЭТАП ${state.currentStage} / ${unlocked}`;
    }

    if (percentElement) {

        percentElement.innerText =
            `${percent}%`;
    }

    if (bar) {

        bar.style.width =
            `${percent}%`;
    }
}


/* =====================================================
   STAGE TYPES
===================================================== */

function renderStageType(stage) {

    if (stage.id === 14) {
        renderGuessNumberStage(stage);
        return;
    }
    const box =
        document.getElementById("stageContent");

    if (!box) {
        console.error("stageContent не найден");
        return;
    }

    switch (stage.type) {

        case "choice":
            renderChoiceStage(stage);
            break;

        case "textAnswer":
            renderTextAnswerStage(stage);
            break;

        case "qr":
            renderQRStage(stage);
            break;

        case "adult":
            renderAdultStage(stage);
            break;

        case "route":
            renderRouteStage(stage);
            break;

        case "timer":
            renderTimerStage(stage);
            break;

        case "rps":
            renderRPSStage(stage);
            break;

        case "memory":
            renderMemoryStage(stage);
            break;

        case "unlock":
            renderUnlockStage(stage);
            break;

        case "guessNumber":
            renderGuessNumberStage(stage);
            break;

        case "sequenceGame":
            renderSequenceGame(stage);
            break;

        case "reaction":
            renderReactionGame(stage);
            break;

        case "cards":
            renderCardsGame(stage);
            break;

        case "manual":
            renderManualStage(stage);
            break;

        default:
            box.innerHTML = `
                <div class="card">
                    ${stage.text || ""}
                </div>
            `;
    }
}


/* =====================================================
   MANUAL
===================================================== */

function renderManualStage(stage) {

    const box = document.getElementById("stageContent");
    const action = document.getElementById("playerAction");

    if (!box || !action) return;

    box.innerHTML = `
        <div class="card">

            <div class="card-label">
                ЗАДАНИЕ
            </div>

            <p>
                ${stage.text}
            </p>

            ${
                stage.instruction
                    ? `
                    <div class="instruction">
                        ${stage.instruction}
                    </div>
                    `
                    : ""
            }

        </div>
    `;

    /*
     * Этап уже завершён
     */
    if (state.completed.includes(stage.id)) {

        action.innerHTML = `
            <div class="success-box">
                ✓ ЭТАП ПРОЙДЕН
            </div>
        `;

        return;
    }

    /*
     * Ожидается подтверждение оператора
     */
    if (
        state.pendingOperator &&
        state.pendingOperator.stage === stage.id
    ) {

        action.innerHTML = `
            <div class="instruction">
                ⏳ Ожидается подтверждение оператора.
            </div>
        `;

        return;
    }

    /*
     * Обычное прохождение этапа.
     *
     * Если штраф уже был выполнен и этап
     * возвращён на повторное прохождение,
     * сюда попадём автоматически.
     */
    action.innerHTML = `
        <button
            class="main-button"
            type="button"
            onclick="playerRequestConfirm()"
        >
            Я ВЫПОЛНИЛА ЗАДАНИЕ →
        </button>
    `;
}


/* =====================================================
   PLAYER CONFIRM
===================================================== */

function playerRequestConfirm() {

    state.pendingOperator = {

        stage:
            state.currentStage,

        type:
            "confirm"
    };

    addLog(
        `Игрок запросила подтверждение этапа ${state.currentStage}`
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   CHOICE
===================================================== */

function renderChoiceStage(stage) {
    const box = document.getElementById("stageContent");

    // Массив иконок и букв для коробок
    const boxConfig = [
        { icon: "🎁", label: "КОРОБКА А" },
        { icon: "📦", label: "КОРОБКА Б" },
        { icon: "💡", label: "КОРОБКА В" }
    ];

    box.innerHTML = `
        <div class="card">
            <div class="card-label">
                SELECT RESPONSE
            </div>

            <p>
                ${stage.text}
            </p>

            <div id="choiceList" class="box-choices-grid">
                ${stage.choices.map((choice, i) => {
                    const cfg = boxConfig[i] || { icon: "🔹", label: `КОРОБКА ${i + 1}` };
                    return `
                        <button class="box-choice-card" onclick="playerChoice(${i})">
                            <div class="box-icon">${cfg.icon}</div>
                            <div class="box-content">
                                <span class="box-tag">${cfg.label}</span>
                                <span class="box-title">${choice.text}</span>
                            </div>
                            <div class="box-arrow">→</div>
                        </button>
                    `;
                }).join("")}
            </div>

            <div
                id="choiceMessage"
                class="answer-message"
            ></div>
        </div>
    `;
}


function playerChoice(index) {

    const stage =
        stages[state.currentStage - 1];

    const choice =
        stage.choices[index];

    const message =
        document.getElementById(
            "choiceMessage"
        );

    if (!choice.correct) {

        message.style.color =
            "var(--red)";

        message.innerText =
            "❌ Не совсем. Попробуй ещё раз.";

        return;
    }

    message.style.color =
        "var(--green)";

    message.innerText =
        "✓ Правильно.";

    state.pendingOperator = {

        stage:
            stage.id,

        type:
            "confirm"
    };

    addLog(
        `Игрок правильно выполнила этап ${stage.id}`
    );

    saveState();

    setTimeout(
        renderPlayer,
        500
    );
}


/* =====================================================
   CIPHER
===================================================== */

function renderTextAnswerStage(stage) {

    const box =
        document.getElementById(
            "stageContent"
        );

    box.innerHTML = `

        <div class="card">

            <div class="card-label">
                CODE BREAK
            </div>

            <p>
                ${stage.text}
            </p>

            <input
                id="textAnswerInput"
                class="answer-input"
                type="text"
                autocomplete="off"
                placeholder="Введи слово"
                onkeydown="
                    if(event.key === 'Enter')
                        checkTextAnswer()
                "
            >

            <button
                class="answer-button"
                onclick="checkTextAnswer()"
            >
                ПРОВЕРИТЬ ШИФР
            </button>

            <div
                id="textAnswerMessage"
                class="answer-message"
            ></div>

        </div>
    `;
}


function checkTextAnswer() {

    const stage =
        stages[state.currentStage - 1];

    const input =
        document
            .getElementById(
                "textAnswerInput"
            )
            .value
            .trim()
            .toLowerCase()
            .replace(
                /ё/g,
                "е"
            );

    const answer =
        stage.answer
            .trim()
            .toLowerCase()
            .replace(
                /ё/g,
                "е"
            );

    const message =
        document.getElementById(
            "textAnswerMessage"
        );

    if (input === answer) {

        message.style.color =
            "var(--green)";

        message.innerHTML = `

            <div class="success-box">
                ✓ ШИФР РАЗГАДАН
            </div>

            <div
                class="reveal"
                style="margin-top:20px;"
            >
                ${stage.hintAfter}
            </div>

            <br>

            <button
                class="main-button"
                onclick="cipherCallDone()"
            >
                📞 Я ПОЗВОНИЛА →
            </button>
        `;

        addLog(
            "Этап 5: шифр разгадан — найден контакт МАМЫ"
        );

        saveState();

    } else {

        message.style.color =
            "var(--red)";

        message.innerText =
            "❌ Неверно. Попробуй ещё.";
    }
}


function cipherCallDone() {

    state.pendingOperator = {

        stage: 5,

        type: "confirm"
    };

    addLog(
        "Игрок сообщила, что позвонила маме"
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   QR
===================================================== */

function renderQRStage(stage) {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    /* =====================================================
       СИСТЕМА ОТКРЫТА — ВВОД КОДА
    ===================================================== */

    if (state.qrUnlocked) {

        box.innerHTML = `

            <div class="reveal qr-access-card">

                <div class="qr-status">
                    <span class="qr-status-dot"></span>
                    SECURE CONNECTION
                </div>

                <div class="qr-number">
                    18
                </div>

                <h2>
                    СИСТЕМА ОТКРЫТА
                </h2>

                <p class="muted">
                    Для продолжения требуется код доступа.
                </p>

                <div class="qr-input-wrap">

                    <span class="qr-input-icon">
                        ⌕
                    </span>

                    <input
                        id="qrPassword"
                        class="answer-input"
                        type="password"
                        inputmode="numeric"
                        maxlength="6"
                        autocomplete="off"
                        placeholder="ВВЕДИТЕ КОД"
                        onkeydown="
                            if(event.key === 'Enter')
                                checkQRPassword()
                        "
                    >

                </div>

                <button
                    class="answer-button qr-access-button"
                    type="button"
                    onclick="checkQRPassword()"
                >
                    <span>
                        ПОЛУЧИТЬ ДОСТУП
                    </span>

                    <span class="button-arrow">
                        →
                    </span>
                </button>

                <div
                    id="qrMessage"
                    class="answer-message"
                ></div>

                <div class="qr-footer">

                    <span>
                        ACCESS LEVEL
                    </span>

                    <b>
                        18
                    </b>

                </div>

            </div>

        `;

        return;
    }


    /* =====================================================
       QR-КОД
    ===================================================== */

    box.innerHTML = `

        <div class="card qr-stage-card">

            <div class="card-label">
                QR ACCESS
            </div>

            <h2 class="qr-stage-title">
                ДОСТУП К СИСТЕМЕ
            </h2>

            <p class="qr-stage-description">
                ${stage.text}
            </p>

            <div class="qr-box">

                <div class="qr-corner qr-corner-tl"></div>
                <div class="qr-corner qr-corner-tr"></div>
                <div class="qr-corner qr-corner-bl"></div>
                <div class="qr-corner qr-corner-br"></div>

                <div class="qr-pattern"></div>

                <div class="qr-scan"></div>

            </div>

            <div class="instruction qr-instruction">

                <div class="qr-instruction-title">
                    SCAN REQUIRED
                </div>

                Наведи камеру телефона
                на настоящий QR-код.

                <br><br>

                После сканирования
                нажми кнопку ниже.

            </div>

            <button
                class="main-button qr-scan-button"
                type="button"
                onclick="fakeQRScan()"
            >
                <span>
                    ✓ Я ОТСКАНИРОВАЛА QR
                </span>

                <span class="button-arrow">
                    →
                </span>
            </button>

        </div>

    `;
}


function fakeQRScan() {

    state.qrUnlocked = true;

    addLog(
        "QR-код активирован"
    );

    saveState();

    renderPlayer();
}


function checkQRPassword() {

    const value =
        document
            .getElementById(
                "qrPassword"
            )
            .value
            .trim();

    const msg =
        document.getElementById(
            "qrMessage"
        );

    if (value === "18") {

        state.pendingOperator = {

            stage: 6,

            type: "confirm"
        };

        msg.style.color =
            "var(--green)";

        msg.innerText =
            "✓ Пароль принят. Ожидается подтверждение.";

        addLog(
            "Пароль системы №18 принят"
        );

        saveState();

    } else {

        msg.style.color =
            "var(--red)";

        msg.innerText =
            "❌ Неверный пароль.";
    }
}


/* =====================================================
   ADULT TEST
===================================================== */

function renderAdultStage(stage) {

    if (state.adultFinished) {

        renderAdultResult(stage);

        return;
    }

    renderAdultQuestion(stage);
}


function renderAdultQuestion(stage) {

    const box = document.getElementById("stageContent");

    if (!box) return;

    const question = stage.questions[state.adultIndex];

    if (!question) {
        console.error("Вопрос не найден:", state.adultIndex);
        return;
    }

    /*
     * Если после ответа ожидаем оператора
     */
    if (
        state.pendingOperator &&
        state.pendingOperator.stage === stage.id
    ) {
        box.innerHTML = `
            <div class="logic-card waiting-card">

                <div class="logic-header">
                    <span class="logic-label">
                        ADULT TEST // ${String(stage.id).padStart(2, "0")}
                    </span>

                    <span class="logic-status">
                        ● ОЖИДАНИЕ
                    </span>
                </div>

                <div class="logic-waiting-icon">
                    ⏳
                </div>

                <h2 class="logic-waiting-title">
                    ОТВЕТ ОТПРАВЛЕН
                </h2>

                <p class="logic-waiting-text">
                    Ожидается подтверждение оператора.
                </p>

            </div>
        `;

        return;
    }

    const total = stage.questions.length;
    const current = state.adultIndex + 1;

    box.innerHTML = `
        <div class="logic-card">

            <div class="logic-top">

                <div>
                    <div class="logic-label">
                        EXPRESS TEST
                    </div>

                    <div class="logic-counter">
                        ${String(current).padStart(2, "0")}
                        <span>/ ${String(total).padStart(2, "0")}</span>
                    </div>
                </div>

                <div class="logic-progress">
                    <div
                        class="logic-progress-fill"
                        style="width:${(current / total) * 100}%"
                    ></div>
                </div>

            </div>

            <div class="logic-question-number">
                ВОПРОС ${current}
            </div>

                <h2 class="logic-question">
                    ${question.question}
                </h2>

            <div class="logic-answers">

                ${question.choices.map((choice, index) => {

                    const letter =
                        ["A", "B", "C", "D", "E"][index] ||
                        String(index + 1);

                    return `
                        <button
                            type="button"
                            class="logic-answer"
                            onclick="adultAnswer(${index})"
                        >

                            <span class="logic-answer-number">
                                ${letter}
                            </span>

                            <span class="logic-answer-text">
                                ${choice.text}
                            </span>

                            <span class="logic-answer-arrow">
                                →
                            </span>

                        </button>
                    `;

                }).join("")}

            </div>

            <div class="logic-footer">
                <span>
                    ⚡ ВЫБЕРИ ОТВЕТ
                </span>

                <span>
                    ${current} / ${total}
                </span>
            </div>

        </div>
    `;
}


function adultAnswer(index) {

    const stage = stages[state.currentStage - 1];

    if (!stage || !stage.questions) {
        console.error("Этап логики или вопросы не найдены.");
        return;
    }

    const question = stage.questions[state.adultIndex];

    if (!question || !question.choices) {
        console.error("Вопрос не найден:", state.adultIndex);
        return;
    }

    if (question.choices[index]?.correct) {
        state.adultScore++;
    }

    state.adultIndex++;

    saveState();

    if (state.adultIndex >= stage.questions.length) {
        finishAdultTest(stage);
        return;
    }

    renderAdultQuestion(stage);
}


function finishAdultTest(stage) {

    state.adultFinished = true;

    state.pendingOperator = {

        stage: 7,

        type: "adult"
    };

    addLog(
        `Тест на взрослость завершён: ${state.adultScore}/${stage.questions.length}`
    );

    saveState();

    renderAdultResult(stage);
}


function renderAdultResult(stage) {

    const percent =
        Math.round(
            state.adultScore /
            stage.questions.length *
            100
        );

    const box =
        document.getElementById(
            "stageContent"
        );

    box.innerHTML = `

        <div class="card">

            <div class="reveal">

                <div class="huge">
                    ${percent}%
                </div>

                <h2>
                    УРОВЕНЬ ВЗРОСЛОСТИ
                </h2>

                <p>
                    ${state.adultScore}/${stage.questions.length}
                    правильных ответов.
                </p>

                <p class="muted">
                    Результат отправлен оператору.
                </p>

            </div>

        </div>
    `;
}


/* =====================================================
   ROUTE
===================================================== */

function renderRouteStage(stage) {

    const step = state.routeStep;

    const box = document.getElementById("stageContent");

    if (!box) return;

    /*
     * Все точки выполнены.
     * Ждём финального подтверждения оператора.
     */
    if (step >= stage.steps.length) {

        box.innerHTML = `
            <div class="success-box">
                ✓ Все точки отмечены.
                <br><br>
                ⏳ Ожидается подтверждение оператора.
            </div>
        `;

        return;
    }

    /*
     * Игрок отправила текущую точку
     * и теперь ждём оператора.
     */
    if (
        state.pendingOperator &&
        state.pendingOperator.stage === stage.id &&
        state.pendingOperator.type === "route"
    ) {

        box.innerHTML = `
            <div class="card">

                <div class="card-label">
                    ТОЧКА ${step + 1} / ${stage.steps.length}
                </div>

                <p>
                    ${stage.steps[step]}
                </p>

                <div class="instruction">
                    ⏳ Ожидается подтверждение оператора.
                </div>

            </div>
        `;

        return;
    }

    const confirmed =
        state.routeConfirmed[step];

    box.innerHTML = `
        <div class="card">

            <div class="card-label">
                ТОЧКА ${step + 1} / ${stage.steps.length}
            </div>

            <p>
                ${stage.steps[step]}
            </p>

            ${
                confirmed
                ?
                `
                <div class="success-box">
                    ✓ ТОЧКА ПОДТВЕРЖДЕНА
                </div>
                `
                :
                `
                <br>

                <button
                    class="main-button"
                    type="button"
                    onclick="routeDone()"
                >
                    Я ВЫПОЛНИЛА ТОЧКУ
                </button>
                `
            }

        </div>
    `;
}


function routeDone() {

    const stage = stages[state.currentStage - 1];

    if (!stage || !stage.steps) {
        return;
    }

    state.pendingOperator = {
        stage: state.currentStage,
        type: "route",
        step: state.routeStep
    };

    addLog(
        `Игрок выполнила точку ${state.routeStep + 1}`
    );

    saveState();

    renderPlayer();
    renderOperator();
}


/* =====================================================
   TIMER
===================================================== */

let timerInterval = null;


function renderTimerStage(stage) {

    const box =
        document.getElementById(
            "stageContent"
        );

    if (!state.timerSelected) {

        box.innerHTML = `

            <div class="card">

                <div class="card-label">
                    SPEED PROTOCOL
                </div>

                <div class="reveal">

                    <div class="huge">
                        18
                    </div>

                    <h2>
                        ЗАДАНИЕ ЕЩЁ НЕ ВЫБРАНО
                    </h2>

                    <p class="muted">
                        Сначала оператор должен
                        выбрать задание.
                    </p>

                </div>

            </div>
        `;

        return;
    }

    const task =
        stage.tasks[
            state.timerTask
        ];

    if (state.timerFinished) {

        box.innerHTML = `

            <div class="card">

                <div class="card-label">
                    SPEED PROTOCOL / REPORT
                </div>

                <div class="answer-title">
                    ${task.title}
                </div>

                <p>
                    ${task.text}
                </p>

                <div class="timer danger">
                    00
                </div>

                <div class="success-box">
                    ⏱ Время испытания завершено.
                </div>

                ${
                    state.timerReport
                    ?
                    `
                    <div class="instruction">
                        ✓ Отчёт отправлен оператору.
                        <br>
                        Ожидается решение.
                    </div>
                    `
                    :
                    `
                    <button
                        class="main-button"
                        onclick="sendTimerReport()"
                    >
                        ОТПРАВИТЬ ОТЧЁТ →
                    </button>
                    `
                }

            </div>
        `;

        return;
    }

    if (!state.timerRunning) {

        box.innerHTML = `

            <div class="card">

                <div class="card-label">
                    SPEED MISSION / 18 SEC
                </div>

                <div class="answer-title">
                    ${task.title}
                </div>

                <p>
                    ${task.text}
                </p>

                <div class="instruction">
                    Подготовься.

                    <br><br>

                    Таймер начнётся
                    после нажатия кнопки.
                </div>

                <br>

                <button
                    class="main-button"
                    onclick="startPlayerTimer()"
                >
                    ГОТОВА — НАЧАТЬ →
                </button>

            </div>
        `;

        return;
    }

    box.innerHTML = `

        <div class="card">

            <div class="card-label">
                SPEED PROTOCOL / LIVE
            </div>

            <div class="answer-title">
                ${task.title}
            </div>

            <p>
                ${task.text}
            </p>

            <div
                id="timerNumber"
                class="timer"
            >
                18
            </div>

            <div class="instruction">
                Выполняй задание.
            </div>

        </div>
    `;

    updateRunningTimer();
}


function startPlayerTimer() {

    if (
        !state.timerSelected ||
        state.timerRunning
    ) {
        return;
    }

    state.timerReady = true;
    state.timerRunning = true;
    state.timerFinished = false;
    state.timerReport = null;
    state.timerStartedAt = Date.now();

    addLog(
        "Игрок начала испытание на 18 секунд"
    );

    saveState();

    renderPlayer();

    clearInterval(timerInterval);

    timerInterval =
        setInterval(
            updateRunningTimer,
            100
        );
}


function updateRunningTimer() {

    if (!state.timerRunning) {

        clearInterval(
            timerInterval
        );

        return;
    }

    const elapsed =
        Date.now() -
        state.timerStartedAt;

    const remaining =
        Math.max(
            0,
            18000 - elapsed
        );

    const seconds =
        Math.ceil(
            remaining / 1000
        );

    const number =
        document.getElementById(
            "timerNumber"
        );

    if (number) {

        number.innerText =
            seconds;

        if (seconds <= 5) {

            number.classList.add(
                "danger"
            );
        }
    }

    if (remaining <= 0) {

        clearInterval(
            timerInterval
        );

        state.timerRunning = false;
        state.timerFinished = true;
        state.timerReady = false;

        addLog(
            "18 секунд завершены"
        );

        saveState();

        renderPlayer();
    }
}


function sendTimerReport() {

    state.timerReport = {

        sent: true,

        time:
            new Date().toLocaleTimeString(
                "ru-RU",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
    };

    state.pendingOperator = {

        stage: 9,

        type: "timer"
    };

    addLog(
        "Игрок отправила отчёт по испытанию на скорость"
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   RPS
===================================================== */

function renderRPSStage(stage) {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    // Игрок уже выбрала, оператор ещё нет
    if (
        state.rpsPlayer &&
        !state.rpsOperator
    ) {

        box.innerHTML = `

            <div class="rps-player-card">

                <div class="rps-header">
                    <div>
                        <div class="rps-label">
                            BATTLE PROTOCOL
                        </div>

                        <h2>
                            КАМЕНЬ • НОЖНИЦЫ • БУМАГА
                        </h2>
                    </div>

                    <div class="rps-round">
                        DUEL
                    </div>
                </div>

                <div class="rps-status waiting">

                    <div class="rps-status-icon">
                        ⏳
                    </div>

                    <div>
                        <strong>
                            ХОД ПРИНЯТ
                        </strong>

                        <span>
                            Оператор выбирает свой ход
                        </span>
                    </div>

                </div>

                <div class="rps-your-choice">

                    <span>
                        ТВОЙ ХОД
                    </span>

                    <strong>
                        ${rpsName(state.rpsPlayer)}
                    </strong>

                </div>

                <div class="rps-vs">
                    <span>ТВОЙ ХОД</span>
                    <b>VS</b>
                    <span>ОПЕРАТОР</span>
                </div>

                <div class="rps-hidden-choice">
                    ?
                </div>

                <div class="rps-wait-text">
                    Ожидается выбор оператора...
                </div>

            </div>
        `;

        return;
    }

    // Оба сделали выбор
    if (
        state.rpsPlayer &&
        state.rpsOperator
    ) {

        const result =
            state.rpsResult ||
            rpsWinner(
                state.rpsPlayer,
                state.rpsOperator
            );

        let resultClass = "";

        if (result === "ПОБЕДИЛА ИГРОК") {
            resultClass = "player-win";
        }

        if (result === "ПОБЕДИЛ ОПЕРАТОР") {
            resultClass = "operator-win";
        }

        if (result === "НИЧЬЯ") {
            resultClass = "draw";
        }

        box.innerHTML = `

            <div class="rps-player-card result-card">

                <div class="rps-label">
                    BATTLE PROTOCOL // RESULT
                </div>

                <h2>
                    ДУЭЛЬ ЗАВЕРШЕНА
                </h2>

                <div class="rps-battle-result">

                    <div class="rps-side">

                        <span>
                            ТВОЙ ХОД
                        </span>

                        <div class="rps-big-choice">
                            ${rpsName(state.rpsPlayer)}
                        </div>

                    </div>

                    <div class="rps-vs-big">
                        VS
                    </div>

                    <div class="rps-side">

                        <span>
                            ХОД ОПЕРАТОРА
                        </span>

                        <div class="rps-big-choice">
                            ${rpsName(state.rpsOperator)}
                        </div>

                    </div>

                </div>

                <div class="
                    rps-result
                    ${resultClass}
                ">

                    ${result}

                </div>

                <div class="rps-status success">

                    <div class="rps-status-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            РЕЗУЛЬТАТ ПОЛУЧЕН
                        </strong>

                        <span>
                            Ожидается подтверждение оператора.
                        </span>
                    </div>

                </div>

            </div>
        `;

        return;
    }

    // Игрок ещё не выбрала
    box.innerHTML = `

        <div class="rps-player-card">

            <div class="rps-header">

                <div>

                    <div class="rps-label">
                        BATTLE PROTOCOL
                    </div>

                    <h2>
                        КАМЕНЬ • НОЖНИЦЫ • БУМАГА
                    </h2>

                </div>

                <div class="rps-round">
                    DUEL
                </div>

            </div>

            <p class="rps-description">
                Сделай свой ход.
                <br><br>
                Оператор увидит его,
                но не сможет выбрать раньше тебя.
            </p>

            <div class="rps-choice-grid">

                <button
                    class="rps-choice"
                    onclick="rpsPlayer('rock')"
                >
                    <span class="rps-emoji">✊</span>
                    <span>КАМЕНЬ</span>
                </button>

                <button
                    class="rps-choice"
                    onclick="rpsPlayer('scissors')"
                >
                    <span class="rps-emoji">✌️</span>
                    <span>НОЖНИЦЫ</span>
                </button>

                <button
                    class="rps-choice"
                    onclick="rpsPlayer('paper')"
                >
                    <span class="rps-emoji">✋</span>
                    <span>БУМАГА</span>
                </button>

            </div>

            <div class="rps-footer">
                YOUR MOVE // WAITING FOR INPUT
            </div>

        </div>
    `;
}

function rpsPlayer(value) {

    // Если оператор уже выбрал — повторно ходить нельзя
    if (state.rpsOperator) {
        return;
    }

    state.rpsPlayer = value;

    addLog(
        `Игрок выбрала: ${rpsName(value)}`
    );

    saveState();

    renderPlayer();
    renderOperator();
}


function rpsEmoji(value) {

    return {

        rock: "✊",

        scissors: "✌️",

        paper: "✋"

    }[value] || "❓";
}


function rpsName(value) {

    return {

        rock: "✊ КАМЕНЬ",

        scissors: "✌️ НОЖНИЦЫ",

        paper: "✋ БУМАГА"

    }[value] || "—";
}


function rpsWinner(player, operator) {

    if (!player || !operator) {
        return "ОЖИДАНИЕ ХОДА";
    }

    if (player === operator) {
        return "НИЧЬЯ";
    }

    if (
        (player === "rock" && operator === "scissors") ||
        (player === "scissors" && operator === "paper") ||
        (player === "paper" && operator === "rock")
    ) {
        return "ПОБЕДИЛА ИГРОК";
    }

    return "ПОБЕДИЛ ОПЕРАТОР";
}


/* =====================================================
   MEMORY 13
===================================================== */

function renderMemoryStage() {

    const box = document.getElementById("stageContent");

    if (!box) return;

    const waiting =
        state.pendingOperator &&
        state.pendingOperator.type === "memory";

    if (waiting) {

        box.innerHTML = `
            <div class="memory-card">

                <div class="memory-header">
                    <span class="memory-label">
                        MEMORY TEST
                    </span>

                    <span class="memory-status">
                        ОЖИДАНИЕ
                    </span>
                </div>

                <div class="memory-finished" style="display:block">

                    <div class="finished-icon">
                        ✓
                    </div>

                    <h3>
                        ОТВЕТ ОТПРАВЛЕН
                    </h3>

                    <p>
                        Ожидается подтверждение оператора.
                    </p>

                </div>

            </div>
        `;

        return;
    }

    box.innerHTML = `

        <div class="memory-card">

            <div class="memory-header">

                <span class="memory-label">
                    MEMORY TEST / 13
                </span>

                <span
                    class="memory-status"
                    id="memoryStatus"
                >
                    ГОТОВ
                </span>

            </div>


            <!-- НАЧАЛЬНЫЙ ЭКРАН -->

            <div
                class="memory-intro"
                id="memoryIntro"
            >

                <div class="memory-icon">
                    🧠
                </div>

                <h2>
                    БАШНЯ ПАМЯТИ
                </h2>

                <p>
                    У тебя будет
                    <strong>10 секунд</strong>,
                    чтобы запомнить задание.
                </p>

                <button
                    class="memory-start"
                    onclick="startMemoryTest()"
                >
                    НАЧАТЬ ТЕСТ
                    <span>→</span>
                </button>

            </div>


            <!-- САМ ТЕСТ -->

            <div
                class="memory-test"
                id="memoryTest"
            >

                <div class="memory-timer-wrap">

                    <div
                        class="memory-timer"
                        id="memoryTimer"
                    >
                        10
                    </div>

                    <div class="memory-timer-text">
                        СЕКУНД
                    </div>

                </div>


                <div class="memory-task">

                    <div class="memory-task-label">
                        ЗАПОМНИ
                    </div>

                    <h3>
                        Назови без запинки:
                    </h3>


                    <div class="memory-list">

                        <div class="memory-item">
                            <span>01</span>
                            <p>
                                год своего рождения
                            </p>
                        </div>

                        <div class="memory-item">
                            <span>02</span>
                            <p>
                                сколько лет нашим родителям
                            </p>
                        </div>

                        <div class="memory-item">
                            <span>03</span>
                            <p>
                                в каком году родился твой брат
                            </p>
                        </div>

                    </div>

                </div>


                <!-- ПОСЛЕ ТАЙМЕРА -->

                <div
                    class="memory-finished"
                    id="memoryFinished"
                >

                    <div class="finished-icon">
                        ✓
                    </div>

                    <h3>
                        ВРЕМЯ ВЫШЛО
                    </h3>

                    <p>
                        Теперь назови всё,
                        что успела запомнить.
                        После ответа нажми кнопку.
                    </p>

                    <button
                        class="main-button"
                        onclick="memoryDone()"
                    >
                        Я СПРАВИЛАСЬ
                    </button>

                </div>

            </div>

        </div>

    `;
}


function memoryDone() {

    if (state.pendingOperator) {
        return;
    }

    state.pendingOperator = {

        stage: 13,

        type: "memory"
    };

    addLog(
        "Игрок запросила проверку этапа памяти"
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   UNLOCK 11
===================================================== */

function renderUnlockStage() {
    const box = document.getElementById("stageContent");

    if (!box) return;

    box.innerHTML = `
        <div class="unlock-screen">

            <div class="unlock-glow"></div>

            <div class="unlock-card">

                <div class="unlock-top">
                    <span class="unlock-status">
                        ● ACCESS GRANTED
                    </span>

                    <span class="unlock-code">
                        LEVEL 02
                    </span>
                </div>

                <div class="unlock-icon">
                    <span>02</span>
                </div>

                <div class="unlock-label">
                    NEXT PROTOCOL
                </div>

                <h2 class="unlock-title">
                    ВТОРОЙ УРОВЕНЬ
                </h2>

                <p class="unlock-subtitle">
                    Ты думала, что это конец?
                </p>

                <div class="unlock-line"></div>

                <div class="unlock-message">
                    <div class="unlock-message-icon">
                        ⚡
                    </div>

                    <div>
                        <strong>
                            ПЕРВЫЙ УРОВЕНЬ ПРОЙДЕН
                        </strong>

                        <span>
                            Теперь начинаются настоящие игры.
                        </span>
                    </div>
                </div>

                <div class="unlock-progress">
                    <div class="unlock-progress-head">
                        <span>СИСТЕМНЫЙ ДОСТУП</span>
                        <b>02 / 02</b>
                    </div>

                    <div class="unlock-progress-bar">
                        <div class="unlock-progress-fill"></div>
                    </div>
                </div>

                <button
                    class="unlock-button"
                    type="button"
                    onclick="unlockSecondPart()"
                >
                    <span>ОТКРЫТЬ ПРОДОЛЖЕНИЕ</span>
                    <b>→</b>
                </button>

                <div class="unlock-footer">
                    SECURITY PROTOCOL // CASE 18
                </div>

            </div>
        </div>
    `;
}


function unlockSecondPart() {

    state.currentStage = 12;

    state.revealedSecondPart = true;

    addLog(
        "Открыт второй уровень"
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   GAME 14 — GUESS NUMBER
===================================================== */

function renderGuessNumberStage(stage) {

    const box = document.getElementById("stageContent");

    if (!box) return;

    const game = state.guessNumber;

    // Оператор ещё НЕ загадал
    if (!game || game.secret == null) {

        box.innerHTML = `
            <div class="card">

                <div class="card-label">
                    GUESS GAME
                </div>

                <h2>ОЖИДАНИЕ</h2>

                <p>
                    Оператор ещё не загадал число.
                </p>

                <div class="instruction">
                    ⏳ Подожди, пока оператор задаст число.
                </div>

            </div>
        `;

        return;
    }

    // Игра закончена
    if (game.finished) {

        box.innerHTML = `
            <div class="card">

                <div class="card-label">
                    GUESS GAME
                </div>

                <h2>
                    ${game.won ? "🎯 ТЫ УГАДАЛА!" : "❌ ПОПЫТКИ ЗАКОНЧИЛИСЬ"}
                </h2>

                <div class="success-box">
                    ${
                        game.won
                            ? "Число угадано!"
                            : "Попытки закончились."
                    }

                    <br><br>

                    Ожидается подтверждение оператора.
                </div>

            </div>
        `;

        return;
    }

    // ==========================================
    // ВОТ ЗДЕСЬ ИГРОК УГАДЫВАЕТ
    // ==========================================

    box.innerHTML = `
        <div class="card">

            <div class="card-label">
                GUESS GAME
            </div>

            <h2>
                🎯 УГАДАЙ ЧИСЛО
            </h2>

            <p>
                Оператор загадал число от
                <b>1 до 18</b>.
            </p>

            <p>
                Попытка:
                <b>${(game.attempts || 0) + 1} / 3</b>
            </p>

            <input
                id="guessInput"
                class="answer-input"
                type="number"
                min="1"
                max="18"
                placeholder="Введи число 1–18"
                onkeydown="
                    if (event.key === 'Enter') {
                        makeGuess();
                    }
                "
            >

            <button
                class="main-button"
                type="button"
                onclick="makeGuess()"
            >
                УГАДАТЬ →
            </button>

            <div
                id="guessMessage"
                class="answer-message"
            >
                ${game.message || ""}
            </div>

        </div>
    `;
}


function makeGuess() {

    const input =
        document.getElementById("guessInput");

    const message =
        document.getElementById("guessMessage");

    if (!input || !message) return;

    const game = state.guessNumber;

    const guess = Number(input.value);

    if (
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 18
    ) {
        message.innerHTML =
            "⚠ Введи число от 1 до 18.";
        return;
    }

    game.attempts++;
    game.lastGuess = guess;

    if (guess === game.secret) {

        game.won = true;
        game.finished = true;
        game.message = "🎯 Число угадано!";

        state.pendingOperator = {
            stage: 14,
            type: "confirm"
        };

        addLog(
            `Игрок угадала число с ${game.attempts}-й попытки`
        );

    } else if (game.attempts >= 3) {

        game.finished = true;
        game.won = false;
        game.message = "Попытки закончились.";

        state.pendingOperator = {
            stage: 14,
            type: "confirm"
        };

    } else if (guess < game.secret) {

        game.message =
            "📈 Моё число БОЛЬШЕ";

    } else {

        game.message =
            "📉 Моё число МЕНЬШЕ";
    }

    saveState();
    renderPlayer();
    renderOperator();
}

/* =====================================================
   GAME 15 — SEQUENCE
===================================================== */

function renderSequenceGame(stage) {

    const box =
        document.getElementById(
            "stageContent"
        );

    if (!state.sequenceGame) {

        state.sequenceGame = {

            sequence:
                Array.from(
                    {
                        length: 5
                    },
                    () =>
                        Math.floor(
                            Math.random() * 9
                        )
                ).join(""),

            shown: true,

            finished: false
        };

        saveState();
    }

    const game =
        state.sequenceGame;

    if (game.finished) {

        box.innerHTML = `

            <div class="success-box">

                ✓ Игра завершена.

                <br><br>

                Ответ отправлен оператору.

            </div>
        `;

        return;
    }

    if (game.shown) {

        box.innerHTML = `

            <div class="card">

                <div class="card-label">
                    MEMORY GAME
                </div>

                <div class="reveal">

                    <div class="huge">
                        ${game.sequence}
                    </div>

                    <p>
                        Запомни последовательность.
                    </p>

                </div>

                <button
                    class="main-button"
                    onclick="hideSequence()"
                >
                    ЗАПОМНИЛА →
                </button>

            </div>
        `;

        return;
    }

    box.innerHTML = `

        <div class="card">

            <div class="card-label">
                MEMORY GAME
            </div>

            <p>
                Введи последовательность:
            </p>

            <input
                id="sequenceInput"
                class="answer-input"
                inputmode="numeric"
                placeholder="XXXXX"
            >

            <button
                class="main-button"
                onclick="checkSequence()"
            >
                ПРОВЕРИТЬ →
            </button>

            <div
                id="sequenceMessage"
                class="answer-message"
            ></div>

        </div>
    `;
}


function hideSequence() {

    state.sequenceGame.shown =
        false;

    saveState();

    renderPlayer();
}


function checkSequence() {

    const value =
        document
            .getElementById(
                "sequenceInput"
            )
            .value
            .trim();

    const game =
        state.sequenceGame;

    const msg =
        document.getElementById(
            "sequenceMessage"
        );

    game.finished = true;

    if (
        value ===
        game.sequence
    ) {

        msg.innerHTML = `

            <div class="success-box">
                🧠 ИДЕАЛЬНАЯ ПАМЯТЬ!
            </div>
        `;

        addLog(
            "Этап 15: правильная последовательность"
        );

    } else {

        msg.innerHTML = `

            <div class="instruction">

                Почти!

                <br><br>

                Правильный ответ:
                <b>${game.sequence}</b>

            </div>
        `;

        addLog(
            "Этап 15: последовательность завершена"
        );
    }

    state.pendingOperator = {

        stage: 15,

        type: "confirm"
    };

    saveState();

    setTimeout(
        renderPlayer,
        700
    );
}


/* =====================================================
   GAME 16 — REACTION
===================================================== */

function renderReactionGame() {

    const box =
        document.getElementById("stageContent");

    if (!box) return;


    /* --------------------------------
       ИНИЦИАЛИЗАЦИЯ
    -------------------------------- */

    if (!state.reactionGame) {

        state.reactionGame = {

            started: false,

            green: false,

            finished: false,

            startTime: null,

            result: null

        };

        saveState();
    }


    const game =
        state.reactionGame;


    /* --------------------------------
       РЕЗУЛЬТАТ
    -------------------------------- */

    if (game.finished) {

        let rating = "";

        if (game.result < 220) {

            rating = "⚡ МОЛНИЕНОСНО";

        } else if (game.result < 300) {

            rating = "🔥 ОТЛИЧНАЯ РЕАКЦИЯ";

        } else if (game.result < 400) {

            rating = "✓ ХОРОШИЙ РЕЗУЛЬТАТ";

        } else if (game.result < 500) {

            rating = "◐ НОРМАЛЬНО";

        } else {

            rating = "🐢 МОЖНО БЫСТРЕЕ";
        }


        box.innerHTML = `

            <div class="reaction-card">

                <div class="reaction-header">

                    <div>

                        <div class="reaction-label">
                            REACTION TEST / 16
                        </div>

                        <h2>
                            РЕЗУЛЬТАТ
                        </h2>

                    </div>

                    <div class="reaction-status">
                        ГОТОВО
                    </div>

                </div>


                <div class="reaction-result"
                     style="display:block;">

                    <div class="reaction-result-icon">
                        ⚡
                    </div>

                    <div class="reaction-result-label">
                        ТВОЯ СКОРОСТЬ
                    </div>

                    <div class="reaction-time">
                        ${game.result}
                    </div>

                    <div class="reaction-ms">
                        МИЛЛИСЕКУНД
                    </div>

                    <div class="reaction-rating">
                        ${rating}
                    </div>

                    <div class="success-box"
                         style="margin-top:20px;">

                        ✓ Результат отправлен оператору.

                    </div>

                </div>

            </div>
        `;

        return;
    }


    /* --------------------------------
       ЗЕЛЁНЫЙ — НАЖИМАЙ
    -------------------------------- */

    if (game.green) {

        box.innerHTML = `

            <div class="reaction-card reaction-active">

                <div class="reaction-header">

                    <div>

                        <div class="reaction-label">
                            REACTION TEST / 16
                        </div>

                        <h2>
                            СЕЙЧАС!
                        </h2>

                    </div>

                    <div
                        class="reaction-status"
                        style="
                            color:#43ff9a;
                            border-color:rgba(67,255,154,.4);
                            background:rgba(67,255,154,.08);
                        "
                    >
                        ЖМИ
                    </div>

                </div>


                <div class="reaction-game"
                     style="display:block;">

                    <div class="reaction-message"
                         style="color:#43ff9a;">

                        ЗЕЛЁНЫЙ — НАЖИМАЙ!

                    </div>


                    <button
                        class="reaction-target ready"
                        onclick="reactionClick()"
                    >

                        <span
                            class="reaction-target-light"
                        >
                            ●
                        </span>

                        <strong>
                            ЖМИ!
                        </strong>

                        <small>
                            СЕЙЧАС
                        </small>

                    </button>

                </div>

            </div>

        `;

        return;
    }


    /* --------------------------------
       ИГРА ЗАПУЩЕНА — ЖДИ
    -------------------------------- */

    if (game.started) {

        box.innerHTML = `

            <div class="reaction-card">

                <div class="reaction-header">

                    <div>

                        <div class="reaction-label">
                            REACTION TEST / 16
                        </div>

                        <h2>
                            ЖДИ...
                        </h2>

                    </div>

                    <div
                        class="reaction-status"
                        style="
                            color:#ffd84d;
                            border-color:rgba(255,216,77,.35);
                            background:rgba(255,216,77,.06);
                        "
                    >
                        ЖДИ
                    </div>

                </div>


                <div class="reaction-game"
                     style="display:block;">

                    <div class="reaction-message">

                        НЕ НАЖИМАЙ

                    </div>


                    <div
                        class="reaction-target waiting"
                        style="
                            cursor:default;
                        "
                    >

                        <span
                            class="reaction-target-light"
                        >
                            ●
                        </span>

                        <strong>
                            ЖДИ
                        </strong>

                        <small>
                            КОГДА СТАНЕТ ЗЕЛЁНЫМ
                        </small>

                    </div>

                </div>

            </div>

        `;

        return;
    }


    /* --------------------------------
       СТАРТОВЫЙ ЭКРАН
    -------------------------------- */

    box.innerHTML = `

        <div class="reaction-card">

            <div class="reaction-header">

                <div>

                    <div class="reaction-label">
                        REACTION TEST / 16
                    </div>

                    <h2>
                        СКОРОСТЬ РЕАКЦИИ
                    </h2>

                </div>

                <div class="reaction-status">
                    ГОТОВ
                </div>

            </div>


            <div class="reaction-intro">

                <div class="reaction-icon">
                    ⚡
                </div>


                <h3>
                    ПОЙМАЙ ЗЕЛЁНЫЙ
                </h3>


                <p>

                    Нажми «НАЧАТЬ» и жди.
                    <br>

                    Как только круг станет
                    <strong>ЗЕЛЁНЫМ</strong> —
                    нажми на него.

                    <br><br>

                    <strong>
                        Не нажимай раньше времени.
                    </strong>

                </p>


                <div class="reaction-rules">

                    <div class="reaction-rule wait">

                        <span>●</span>

                        <div>
                            <b>ЖЁЛТЫЙ</b>
                            <small>ЖДИ</small>
                        </div>

                    </div>


                    <div class="reaction-rule go">

                        <span>●</span>

                        <div>
                            <b>ЗЕЛЁНЫЙ</b>
                            <small>ЖМИ!</small>
                        </div>

                    </div>


                    <div class="reaction-rule danger">

                        <span>●</span>

                        <div>
                            <b>РАНЬШЕ</b>
                            <small>ОШИБКА</small>
                        </div>

                    </div>

                </div>


                <button
                    class="reaction-start"
                    onclick="startReaction()"
                >

                    НАЧАТЬ ТЕСТ

                    <span>→</span>

                </button>

            </div>

        </div>

    `;
}


function startReaction() {

    const game = state.reactionGame;

    if (!game || game.started) {
        return;
    }

    game.started = true;

    saveState();

    renderPlayer();

    const delay =
        1500 +
        Math.random() * 3000;

    setTimeout(() => {

        if (game.finished) {
            return;
        }

        game.green = true;

        game.startTime = Date.now();

        saveState();

        renderPlayer();

    }, delay);
}


function reactionClick() {

    const game = state.reactionGame;

    if (!game || !game.green || game.finished) {
        return;
    }

    game.result =
        Date.now() - game.startTime;

    game.green = false;
    game.finished = true;

    state.pendingOperator = {
        stage: 16,
        type: "confirm"
    };

    addLog(
        `Этап 16: реакция ${game.result} мс`
    );

    saveState();

    renderPlayer();
}


/* =====================================================
   GAME 17 — CARDS
===================================================== */

function renderCardsGame(stage) {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    // Создаём игру один раз
    if (!state.finalCardGame) {

        state.finalCardGame = {

            // случайная правильная карта: 1, 2 или 3
            correctCard:
                Math.floor(Math.random() * 3) + 1,

            attempts: 0,

            finished: false
        };

        saveState();
    }

    const game =
        state.finalCardGame;

    if (
        state.cardsGameFinished ||
        game.finished
    ) {

        box.innerHTML = `

            <div class="success-box">

                🏆 ПОСЛЕДНЯЯ ИГРА ПРОЙДЕНА

                <br><br>

                Ожидается подтверждение оператора.

            </div>
        `;

        return;
    }

    box.innerHTML = `

        <div class="card">

            <div class="card-label">
                FINAL GAME
            </div>

            <h2>
                ВЫБЕРИ КАРТУ
            </h2>

            <p>
                ${stage.text}
            </p>

            <div class="choice-grid">

                <button
                    class="choice"
                    onclick="chooseFinalCard(1)"
                >
                    🂠
                    <br>
                    КАРТА 1
                </button>

                <button
                    class="choice"
                    onclick="chooseFinalCard(2)"
                >
                    🂠
                    <br>
                    КАРТА 2
                </button>

                <button
                    class="choice"
                    onclick="chooseFinalCard(3)"
                >
                    🂠
                    <br>
                    КАРТА 3
                </button>

            </div>

            <div
                id="cardMessage"
                class="answer-message"
            ></div>

        </div>
    `;
}



function chooseFinalCard(card) {

    const msg =
        document.getElementById("cardMessage");

    const game =
        state.finalCardGame;

    if (!game || game.finished) {
        return;
    }

    game.attempts++;

    // =========================================
    // ПРАВИЛЬНАЯ КАРТА
    // =========================================

    if (card === game.correctCard) {

        game.finished = true;

        state.cardsGameFinished = true;

        state.pendingOperator = {

            stage: 17,

            type: "confirm"
        };

        msg.innerHTML = `

            <div class="success-box">

                🏆 ПРАВИЛЬНАЯ КАРТА!

                <br><br>

                Ты нашла выход.

                <br><br>

                Попыток:
                <b>${game.attempts}</b>

            </div>
        `;

        addLog(
            `Этап 17: правильная карта ${card}, попыток: ${game.attempts}`
        );

        saveState();

        setTimeout(
            renderPlayer,
            700
        );

        return;
    }

    // =========================================
    // НЕПРАВИЛЬНАЯ КАРТА
    // =========================================

    msg.innerHTML = `

        <div class="instruction">

            ❌ КАРТА ${card} ПУСТАЯ.

            <br><br>

            Попробуй другую карту.

            <br><br>

            Попытка:
            <b>${game.attempts}</b>

        </div>
    `;

    addLog(
        `Этап 17: выбрана неправильная карта ${card}`
    );

    saveState();
}


/* =====================================================
   COMPLETE
===================================================== */

function completeStage(id) {

    if (!state.completed.includes(id)) {

        state.completed.push(id);

        addLog(
            `Этап ${id} завершён`
        );
    }

    state.pendingOperator = null;

    // очищаем штраф после завершения этапа
    state.penalty = null;
    state.penaltyCompleted = false;

    // После 17-го этапа — финал
    if (id === 17) {

        state.currentStage = 18;

        saveState();

        renderPlayer();
        renderOperator();

        return;
    }

    // Переходим дальше только если
    // подтверждается текущий этап
    if (id === state.currentStage) {

        state.currentStage = id + 1;
    }

    saveState();

    renderPlayer();
    renderOperator();
}


/* =====================================================
   OPERATOR
===================================================== */
function renderPenaltyModal() {
    const modal = document.getElementById("penaltyModal");

    if (!modal) {
        return;
    }

    const penalties = [
        "5 приседаний",
        "10 приседаний",
        "20 секунд стоять как статуя",
        "Сказать торжественную клятву",
        "Спеть 10 секунд любой песни",
        "Сделать смешное селфи",
        "Изобразить робота 15 секунд"
    ];

    modal.innerHTML = `
        <div class="penalty-modal-content">

            <div class="card-label">
                PENALTY PROTOCOL
            </div>

            <h2>ВЫБЕРИТЕ ШТРАФ</h2>

            <div class="penalty-list">

                ${penalties.map(penalty => `
                    <button
                        type="button"
                        class="penalty-option ${
                            state.penalty === penalty
                                ? "selected"
                                : ""
                        }"
                        onclick="selectPenalty('${escapeAttribute(penalty)}')"
                    >
                        ${penalty}
                    </button>
                `).join("")}

            </div>

            <br>

            <button
                type="button"
                class="admin-btn secondary"
                onclick="closePenaltyModal()"
            >
                ЗАКРЫТЬ
            </button>

        </div>
    `;
}

// Функция отправки команды от оператора
function sendOperatorAction(actionType, value) {
    // Обновляем локальный стейт
    if (actionType === 'stage') {
        state.currentStage = value;
    } else if (actionType === 'penalty') {
        state.penalty = value;
    }
    
    // Сохраняем в localStorage, чтобы сестра на другом устройстве/вкладке это увидела
    const payload = {
        type: actionType,
        value: value,
        time: Date.now() // метка времени, чтобы отловить новое событие
    };
    localStorage.setItem('gameSyncCommand', JSON.stringify(payload));

    // Перерисовываем панель оператора, чтобы интерфейс обновился
    renderOperator();
}


function startSyncListener() {
    setInterval(() => {
        const rawData = localStorage.getItem('gameSyncCommand');
        if (!rawData) return;

        const data = JSON.parse(rawData);

        // Если команда новее, чем то, что мы уже обработали
        if (data.time > lastProcessedTime) {
            lastProcessedTime = data.time;

            // Применяем изменения у игрока
            if (data.type === 'stage') {
                state.currentStage = data.value;
                // Если сестра сейчас на экране игрока — перерисовываем игру
                if (typeof renderPlayer === 'function') {
                    renderPlayer();
                }
            } else if (data.type === 'penalty') {
                state.penalty = data.value;
                // Показываем уведомление или модалку штрафа у сестры
                alert(`⚠️ Внимание! Штраф от оператора: ${data.value}`);
            }
        }
    }, 500); // Проверяем каждые полсекунды
}

async function operatorSendUpdate(newStage, newPenalty) {
    try {
        await fetch('/api/update-state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentStage: newStage,
                penalty: newPenalty
            })
        });
        console.log('Команда отправлена на сервер!');
    } catch (e) {
        console.error('Ошибка связи с сервером', e);
    }
}

function startPlayerSync() {
    setInterval(async () => {
        try {
            let response = await fetch('/api/get-state');
            let serverState = await response.json();

            // Если этап на сервере отличается от того, что сейчас на экране у игрока
            if (serverState.currentStage !== state.currentStage) {
                state.currentStage = serverState.currentStage;
                renderPlayer(); // Перерисовываем экран игрока под новый этап
            }

            // Если прилетел штраф
            if (serverState.penalty && serverState.penalty !== state.penalty) {
                state.penalty = serverState.penalty;
                // Показываем модалку штрафа у сестры
                alert("⚠️ Штраф от оператора: " + serverState.penalty);
            }
        } catch (e) {
            console.log('Ожидание связи с сервером...');
        }
    }, 1500); // Проверять каждые 1.5 секунды
}

function closePenaltyModal() {
    const modal = document.getElementById("penaltyModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

// Закрытие кликом вне карточки
function closePenaltyOutside(event) {
    if (event.target.id === "penaltyModal") {
        closePenaltyModal();
    }
}

function openPenaltyModal() {
    const modal = document.getElementById("penaltyModal");
    if (modal) {
        modal.classList.add("active");
        selectedPenaltyText = "";
        document.querySelectorAll(".penalty-option").forEach(btn => btn.classList.remove("selected"));
        const customInput = document.getElementById("customPenalty");
        if (customInput) customInput.value = "";
    }
}


function renderOperator() {
    updateOperatorHeader();
    renderOperatorControls();
    renderStageList();
    renderOperatorLog();

    // Автоматически добавляем/обновляем контейнер модального окна
    let modalContainer = document.getElementById("penaltyModalContainer");
    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "penaltyModalContainer";
        document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = renderPenaltyModal();
}


function updateOperatorHeader() {

    const stage =
        stages[
            state.currentStage - 1
        ];

    const stageElement =
        document.getElementById(
            "operatorStage"
        );

    const numberElement =
        document.getElementById(
            "operatorStageNumber"
        );

    const nameElement =
        document.getElementById(
            "operatorStageName"
        );

    if (stageElement) {

        stageElement.innerText =
            `ЭТАП ${state.currentStage}`;
    }

    if (numberElement) {

        numberElement.innerText =
            String(
                state.currentStage
            ).padStart(
                2,
                "0"
            );
    }

    if (nameElement) {

        nameElement.innerText =
            stage
                ? stage.title
                : "ЗАВЕРШЕНО";
    }

    const total =
        state.currentStage >
        EARLY_STAGES
            ? TOTAL_STAGES
            : EARLY_STAGES;

    const bar =
        document.getElementById(
            "operatorProgressBar"
        );

    if (bar) {

        bar.style.width =
            `${
                (
                    (state.currentStage - 1)
                    /
                    total
                ) * 100
            }%`;
    }
}


/* =====================================================
   OPERATOR CONTROLS
===================================================== */

function renderOperatorControls() {
    const box = document.getElementById("operatorControls");

    if (!box) return;

    const stage = stages[state.currentStage - 1];

    if (!stage) {
        box.innerHTML = `
            <div class="success-box">
                ДЕЛО ЗАКРЫТО.
            </div>
        `;
        return;
    }

    // =====================================================
    // ПРЕДЫДУЩИЙ ЭТАП
    // =====================================================

    const previousButton =
        state.currentStage > 1
            ? `
                <button
                    class="admin-btn secondary"
                    type="button"
                    onclick="operatorPrevious()"
                >
                    ← ПРЕДЫДУЩИЙ ЭТАП
                </button>
            `
            : "";

    // =====================================================
    // ФИНАЛ
    // =====================================================

    if (stage.type === "final") {
        box.innerHTML = `
            <div class="panel-title">
                ДЕЛО ЗАКРЫТО
            </div>

            <div class="success-box">
                ✓ 17 игровых этапов завершены.
            </div>
        `;

        return;
    }
    

    // =====================================================
    // ЭТАП 14 (GUESS GAME)
    // =====================================================
   if (stage.id === 14) {

    box.innerHTML = `
        <div class="panel-title">
            GUESS GAME
        </div>

        <div class="guess-admin-card">

            <div class="guess-admin-title">
                🔐 ЗАГАДАТЬ ЧИСЛО
            </div>

            <p>
                Игрок будет угадывать число от 1 до 18.
            </p>

            <input
                id="operatorGuessNumber"
                class="answer-input"
                type="number"
                min="1"
                max="18"
                placeholder="1 — 18"
            >

            <button
                class="admin-btn"
                type="button"
                onclick="setGuessNumber()"
            >
                🔒 ЗАПЕЧАТАТЬ ЧИСЛО
            </button>

        </div>
    `;

    return;
}
    // =====================================================
    // ФИНАЛ
    // =====================================================

    if (stage.type === "final") {
        box.innerHTML = `
            <div class="panel-title">
                ДЕЛО ЗАКРЫТО
            </div>

            <div class="success-box">
                ✓ 17 игровых этапов завершены.
            </div>
        `;
        return;
    }



    

    // =====================================================
    // PENDING OPERATOR
    // =====================================================

    if (
        state.pendingOperator &&
        state.pendingOperator.stage === state.currentStage
    ) {

        const pendingType =
            state.pendingOperator.type;

        // =================================================
        // ШТРАФ НАЗНАЧЕН
        // =================================================

        if (pendingType === "penaltyAssigned") {

            box.innerHTML = `
                <div class="panel-title">
                    НАКАЗАНИЕ
                </div>

                <div class="operator-action">

                    <h3>
                        ⚠ НАЗНАЧЕН ШТРАФ
                    </h3>

                    <p>
                        <b>${state.penalty || "Штраф не указан"}</b>
                    </p>

                    ${
                        state.penaltyCompleted
                            ? `
                                <div class="success-box">
                                    ✓ Игрок выполнила штраф.
                                    <br>
                                    <small>
                                        Этап будет запущен заново.
                                    </small>
                                </div>

                                <button
                                    class="admin-btn"
                                    type="button"
                                    onclick="restartStageAfterPenalty()"
                                >
                                    ↻ НАЧАТЬ ЭТАП ЗАНОВО
                                </button>
                            `
                            : `
                                <div class="instruction">
                                    ⏳ Ожидается выполнение штрафа игроком.
                                </div>
                            `
                    }

                </div>

                ${previousButton}
            `;

            return;
        }

        // =================================================
        // ОСТАЛЬНЫЕ PENDING
        // =================================================

        box.innerHTML = `
            <div class="panel-title">
                ТРЕБУЕТСЯ ВАШЕ ДЕЙСТВИЕ
            </div>

            ${renderOperatorPending(stage)}

            <br>

            ${previousButton}

            ${globalPenaltyButtonHtml}
        `;

        return;
    }

    // =====================================================
    // TIMER — ЭТАП 9
    // =====================================================

    if (stage.id === 9) {

        box.innerHTML = `
            <div class="panel-title">
                ИСПЫТАНИЕ НА 18 СЕКУНД
            </div>

            ${renderTimerOperatorControls()}

            ${globalPenaltyButtonHtml}

            ${previousButton}
        `;

        return;
    }

    // =====================================================
    // RPS — ЭТАП 12
    // =====================================================

if (stage.id === 12) {

    const playerChoice = state.rpsPlayer;
    const operatorChoice = state.rpsOperator;

    box.innerHTML = `

        <div class="panel-title">
            BATTLE PROTOCOL
        </div>

        <div class="operator-action rps-operator-card">

            <div class="card-label">
                ДУЭЛЬ // ОПЕРАТОР
            </div>

            ${
                playerChoice
                ? `
                    <div class="rps-player-move">

                        <div class="rps-big-icon">
                            ${rpsIcon(playerChoice)}
                        </div>

                        <div>
                            <span>
                                ХОД ИГРОКА
                            </span>

                            <strong>
                                ${rpsName(playerChoice)}
                            </strong>
                        </div>

                    </div>
                `
                : `
                    <div class="rps-waiting">

                        <span class="status-dot"></span>

                        <div>
                            <strong>
                                ОЖИДАНИЕ ХОДА ИГРОКА
                            </strong>

                            <small>
                                Игрок ещё не выбрала вариант.
                            </small>
                        </div>

                    </div>
                `
            }

        </div>

        ${
            playerChoice && !operatorChoice
            ? `
                <div class="operator-action rps-operator-card">

                    <div class="card-label">
                        ВАШ ХОД
                    </div>

                    <h3>
                        Выберите свой вариант
                    </h3>

                    <div class="choice-grid rps-choice-grid">

                        <button
                            class="choice rps-button"
                            type="button"
                            onclick="operatorRPS('rock')"
                        >
                            <span class="rps-button-icon">
                                ✊
                            </span>
                            <span>
                                КАМЕНЬ
                            </span>
                        </button>

                        <button
                            class="choice rps-button"
                            type="button"
                            onclick="operatorRPS('scissors')"
                        >
                            <span class="rps-button-icon">
                                ✌️
                            </span>
                            <span>
                                НОЖНИЦЫ
                            </span>
                        </button>

                        <button
                            class="choice rps-button"
                            type="button"
                            onclick="operatorRPS('paper')"
                        >
                            <span class="rps-button-icon">
                                ✋
                            </span>
                            <span>
                                БУМАГА
                            </span>
                        </button>

                    </div>

                </div>
            `
            : ""
        }

        ${
            playerChoice && operatorChoice
            ? `
                <div class="operator-action">

                    <div class="card-label">
                        РЕЗУЛЬТАТ
                    </div>

                    <div class="rps-versus">

                        <div class="rps-choice">

                            <div class="rps-big-icon">
                                ${rpsIcon(playerChoice)}
                            </div>

                            <span>
                                ИГРОК
                            </span>

                            <strong>
                                ${rpsName(playerChoice)}
                            </strong>

                        </div>

                        <div class="rps-vs">
                            VS
                        </div>

                        <div class="rps-choice">

                            <div class="rps-big-icon">
                                ${rpsIcon(operatorChoice)}
                            </div>

                            <span>
                                ОПЕРАТОР
                            </span>

                            <strong>
                                ${rpsName(operatorChoice)}
                            </strong>

                        </div>

                    </div>

                    <div class="rps-result">
                        ${rpsWinner(
                            playerChoice,
                            operatorChoice
                        )}
                    </div>

                    <button
                        class="admin-btn"
                        type="button"
                        onclick="operatorNext()"
                    >
                        ✓ ПОДТВЕРДИТЬ ДУЭЛЬ
                    </button>

                </div>
            `
            : ""
        }

        ${globalPenaltyButtonHtml}

        ${previousButton}
    `;

    return;
}

function showPlayerGuessControls() {

    const controls =
        document.getElementById("playerGuessControls");

    if (!controls) {
        return;
    }

    controls.style.display = "block";

    const input =
        document.getElementById("playerGuess");

    if (input) {
        input.value = "";
        input.focus();
    }
}


window.submitPlayerGuess = function () {

    const input = document.getElementById("playerGuess");
    const result = document.getElementById("guessResult");

    if (!input || !result) return;

    const guess = Number(input.value);
    const game = state.guessNumber;

    if (!game || game.secret == null) {
        result.innerHTML = "⏳ Оператор ещё не загадал число.";
        return;
    }

    if (!Number.isInteger(guess) || guess < 1 || guess > 18) {
        result.innerHTML = "⚠ Введите число от 1 до 18.";
        return;
    }

    game.attempts = (game.attempts || 0) + 1;
    game.lastGuess = guess;

    if (guess === game.secret) {

        game.finished = true;
        game.won = true;

        state.pendingOperator = {
            stage: 14,
            type: "confirm"
        };

        result.innerHTML = `
            <div class="success-box">
                🎉 ПРАВИЛЬНО!
            </div>
        `;

        addLog(
            `Игрок угадала число с ${game.attempts}-й попытки`
        );

    } else if (guess < game.secret) {

        result.innerHTML = `
            <div class="instruction">
                📈 Моё число <b>БОЛЬШЕ</b>.
            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="instruction">
                📉 Моё число <b>МЕНЬШЕ</b>.
            </div>
        `;
    }

    saveState();
    renderPlayer();
    renderOperator();
};




    // =====================================================
    // ОБЫЧНЫЙ ЭТАП
    // =====================================================

    const isCompleted =
        state.completed.includes(stage.id);

    box.innerHTML = `
        <div class="panel-title">
            УПРАВЛЕНИЕ ЭТАПОМ
        </div>

        <div class="operator-action">

            <h3>
                ${stage.title}
            </h3>

            <p>
                Игрок находится на этом этапе.
            </p>

        </div>

        ${
            isCompleted
                ? `
                    <div class="success-box">
                        ✓ ЭТАП УЖЕ ЗАВЕРШЁН
                    </div>
                `
                : `
                    <button
                        class="admin-btn"
                        type="button"
                        onclick="operatorNext()"
                    >
                        ✓ ПОДТВЕРДИТЬ ЭТАП
                    </button>
                `
        }

        ${globalPenaltyButtonHtml}

        ${previousButton}
    `;
}

    
/* =====================================================
   MANUAL PENALTY MODAL
===================================================== */

/* =====================================================
   MANUAL PENALTY
===================================================== */

function openManualPenaltyModal() {

    let modal = document.getElementById("manualPenaltyModal");

    if (modal) {
        modal.style.display = "flex";
        return;
    }

    modal = document.createElement("div");

    modal.id = "manualPenaltyModal";

    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.75);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;

    modal.innerHTML = `
        <div style="
            width:100%;
            max-width:500px;
            background:#151515;
            border:1px solid #444;
            border-radius:16px;
            padding:25px;
            box-shadow:0 20px 60px rgba(0,0,0,.6);
        ">

            <h2 style="margin-top:0;">
                ⚠ НАКАЗАНИЕ
            </h2>

            <p>
                Выберите готовое наказание
                или напишите своё.
            </p>

            <div class="penalty-list">

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('5 приседаний')"
                >
                    5 приседаний
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('10 приседаний')"
                >
                    10 приседаний
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('20 секунд стоять как статуя')"
                >
                    20 секунд стоять как статуя
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('Сказать торжественную клятву')"
                >
                    Сказать торжественную клятву
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('Спеть 10 секунд любой песни')"
                >
                    Спеть 10 секунд любой песни
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('Сделать смешное селфи')"
                >
                    Сделать смешное селфи
                </button>

                <button
                    type="button"
                    class="penalty-option"
                    onclick="selectManualPenalty('Изобразить робота 15 секунд')"
                >
                    Изобразить робота 15 секунд
                </button>

            </div>

            <input
                id="customPenalty"
                type="text"
                placeholder="Или напишите своё наказание..."
                style="
                    width:100%;
                    box-sizing:border-box;
                    margin-top:15px;
                    padding:12px;
                    border-radius:8px;
                    border:1px solid #555;
                    background:#222;
                    color:#fff;
                "
            >

            <div style="
                display:flex;
                gap:10px;
                margin-top:15px;
            ">

                <button
                    type="button"
                    class="admin-btn"
                    onclick="sendManualPenalty()"
                    style="flex:1;"
                >
                    ⚠ НАЗНАЧИТЬ
                </button>

                <button
                    type="button"
                    class="admin-btn secondary"
                    onclick="closeManualPenaltyModal()"
                >
                    ОТМЕНА
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);
}


function selectManualPenalty(text) {

    const input =
        document.getElementById("customPenalty");

    if (!input) {
        return;
    }

    input.value = text;

    document
        .querySelectorAll(
            "#manualPenaltyModal .penalty-option"
        )
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.textContent.trim() === text
            );

        });
}


function closeManualPenaltyModal() {

    const modal =
        document.getElementById("manualPenaltyModal");

    if (modal) {
        modal.remove();
    }
}


function sendManualPenalty() {

    const input =
        document.getElementById("customPenalty");

    if (!input) {
        return;
    }

    const penalty =
        input.value.trim();

    if (!penalty) {

        alert(
            "Сначала выберите или напишите наказание."
        );

        return;
    }

    // Сохраняем наказание
    state.penalty = penalty;

    // Игрок ещё не выполнила
    state.penaltyCompleted = false;

    // Отправляем наказание игроку
    state.pendingOperator = {

        stage: state.currentStage,

        type: "penaltyAssigned"

    };

    addLog(
        `Оператор назначил наказание: ${penalty}`
    );

    saveState();

    closeManualPenaltyModal();

    renderPlayer();
    renderOperator();
}


/* =====================================================
   CONFIRM MANUAL PENALTY
===================================================== */

function confirmManualPenalty() {

    const input =
        document.getElementById(
            "manualPenaltyInput"
        );

    const message =
        document.getElementById(
            "manualPenaltyMessage"
        );

    if (!input) return;

    const penalty =
        input.value.trim();

    if (!penalty) {

        if (message) {
            message.innerText =
                "Введите наказание.";
        }

        input.focus();
        return;
    }

    state.penalty = penalty;

    saveState();

    closeManualPenaltyModal();

    // СРАЗУ отправляем игроку
    sendPenalty();
}


/* =====================================================
   CLOSE MANUAL PENALTY MODAL
===================================================== */

function renderTimerOperatorControls() {

    const stage =
        stages[8];

    if (!state.timerSelected) {

        return `

            <div class="operator-action">

                <h3>
                    Выбери задание
                </h3>

                <p>
                    После выбора игрок увидит
                    конкретную миссию.
                </p>

            </div>

            <div class="penalty-list">

                ${stage.tasks.map(
                    (task, index) => `

                        <button
                            class="
                                penalty-option
                                ${
                                    state.timerTask ===
                                    index
                                        ? "selected"
                                        : ""
                                }
                            "
                            onclick="
                                selectTimerTask(${index})
                            "
                        >
                            ${index + 1}.
                            ${task.title}
                        </button>

                    `
                ).join("")}

            </div>
        `;
    }


    const selectedTask =
        stage.tasks[
            state.timerTask
        ];


    if (
        state.pendingOperator &&
        state.pendingOperator.type ===
            "timer"
    ) {

        return `

            <div class="operator-action">

                <h3>
                    ОТЧЁТ ИГРОКА
                </h3>

                <p>
                    Задание:
                    <b>
                        ${selectedTask.title}
                    </b>
                </p>

                <div class="instruction">

                    Игрок завершила
                    18-секундное испытание
                    и отправила отчёт.

                </div>

            </div>

            <button
                class="admin-btn"
                onclick="timerDecision(true)"
            >
                ⚡ УСПЕЛА
            </button>

            <button
                class="admin-btn secondary"
                onclick="timerDecision(false)"
            >
                ⏱ НЕ УСПЕЛА
            </button>
        `;
    }


    return `

        <div class="operator-action">

            <h3>
                Задание выбрано
            </h3>

            <p>
                <b>
                    ${selectedTask.title}
                </b>
            </p>

            <div class="instruction">
                ${selectedTask.text}
            </div>

        </div>

        ${
            state.timerRunning
            ?
            `
            <div class="success-box">
                ● ИСПЫТАНИЕ ИДЁТ
            </div>
            `
            :
            state.timerFinished
            ?
            `
            <div class="instruction">

                ⏱ Таймер завершён.

                <br>

                Ожидается отчёт игрока.

            </div>
            `
            :
            `
            <div class="success-box">

                ✓ Задание отправлено игроку.

                <br><br>

                Игрок должна нажать
                «ГОТОВА».

            </div>
            `
        }

        <br>

        <button
            class="admin-btn secondary"
            onclick="resetTimerTask()"
        >
            ↻ ВЫБРАТЬ ДРУГОЕ ЗАДАНИЕ
        </button>
    `;
}


function selectTimerTask(index) {

    const stage =
        stages[8];

    if (!stage.tasks[index]) {
        return;
    }

    state.timerTask =
        index;

    state.timerSelected =
        true;

    state.timerReady =
        false;

    state.timerRunning =
        false;

    state.timerFinished =
        false;

    state.timerReport =
        null;

    state.timerOperatorResult =
        null;

    addLog(
        `Оператор выбрал задание скорости: ${stage.tasks[index].title}`
    );

    saveState();

    renderOperator();
}


function resetTimerTask() {

    clearInterval(
        timerInterval
    );

    state.timerTask =
        null;

    state.timerSelected =
        false;

    state.timerReady =
        false;

    state.timerRunning =
        false;

    state.timerFinished =
        false;

    state.timerReport =
        null;

    state.timerStartedAt =
        null;

    state.pendingOperator =
        null;

    saveState();

    renderOperator();
}


/* =====================================================
   OPERATOR PENDING
===================================================== */

function renderOperatorPending(stage) {
    const pending = state.pendingOperator;

    if (!pending) {
        return "";
    }

    if (pending.type === "penaltyAssigned") {
        return `
            <div class="operator-action">
                <h3>ШТРАФ НАЗНАЧЕН</h3>

                <div class="success-box">
                    ${state.penalty}
                </div>

                <p>
                    Игрок должна выполнить штраф.
                </p>
            </div>
        `;
    }

    if (pending.type === "penaltyCompleted") {
        return `
            <div class="operator-action">
                <h3>✓ ШТРАФ ВЫПОЛНЕН</h3>

                <div class="success-box">
                    ${state.penalty}
                </div>
            </div>

            <button
                class="admin-btn"
                onclick="confirmPenalty()"
            >
                ✓ ПОДТВЕРДИТЬ ШТРАФ
            </button>
        `;
    }

    if (pending.type === "adult") {
        return `
            <div class="operator-action">
                <h3>Тест на взрослость завершён</h3>

                <p>
                    Результат:
                    <b>${state.adultScore}/3</b>
                </p>

                <div class="success-box">
                    ${Math.round(state.adultScore / 3 * 100)}%
                </div>
            </div>

            ${renderPenaltySelector()}

            ${
                state.penalty
                    ? `
                        <button
                            class="admin-btn"
                            onclick="sendPenalty()"
                        >
                            НАЗНАЧИТЬ ШТРАФ
                        </button>

                        <button
                            class="admin-btn secondary"
                            onclick="skipPenaltyAndContinue()"
                        >
                            ПРОПУСТИТЬ ШТРАФ
                        </button>
                    `
                    : ""
            }
        `;
    }

    if (pending.type === "route") {
        return `
            <div class="operator-action">
                <h3>Точка ${pending.step + 1}</h3>

                <p>
                    Игрок утверждает,
                    что выполнила эту точку.
                </p>
            </div>

            <button
                class="admin-btn"
                onclick="confirmRoute()"
            >
                ✓ ПОДТВЕРДИТЬ ТОЧКУ
            </button>

            <button
                class="admin-btn secondary"
                onclick="rejectPending()"
            >
                ✕ НЕ ПОДТВЕРЖДАТЬ
            </button>
        `;
    }

    if (pending.type === "memory") {
        return `
            <div class="operator-action">
                <h3>Башня памяти</h3>

                <p>
                    Игрок утверждает,
                    что справилась.
                </p>
            </div>

            <button
                class="admin-btn"
                onclick="confirmMemory()"
            >
                ✓ ПОДТВЕРДИТЬ
            </button>

            <button
                class="admin-btn secondary"
                onclick="rejectPending()"
            >
                ✕ НЕ ПОДТВЕРЖДАТЬ
            </button>
        `;
    }

    if (pending.type === "timer") {
        return `
            <div class="operator-action">
                <h3>Отчёт игрока</h3>

                <p>
                    Игрок завершила
                    испытание на скорость.
                </p>
            </div>
        `;
    }

    return `
        <div class="operator-action">
            <h3>Игрок ждёт подтверждения</h3>

            <p>
                ${stage.title}
            </p>
        </div>

        <button
            class="admin-btn"
            onclick="operatorNext()"
        >
            ✓ ПОДТВЕРДИТЬ ПЕРЕХОД
        </button>

        <button
            class="admin-btn secondary"
            onclick="rejectPending()"
        >
            ✕ ОТКАЗАТЬ
        </button>
    `;
}


function getOperatorActionContent(pending, stage) {

    /* PENALTY ASSIGNED */
    if (pending.type === "penaltyAssigned") {
        return `
            <div class="operator-action">
                <h3>Штраф назначен</h3>
                <div class="success-box">
                    ${state.penalty}
                </div>
                <p>Ожидается выполнение штрафа игроком.</p>
            </div>
        `;
    }

    /* PENALTY COMPLETED */
    if (pending.type === "penaltyCompleted") {
        return `
            <div class="operator-action">
                <h3>Штраф выполнен</h3>
                <div class="success-box">
                    ${state.penalty}
                </div>
            </div>
            <button class="admin-btn" onclick="confirmPenalty()">
                ✓ ПОДТВЕРДИТЬ ШТРАФ
            </button>
        `;
    }

    /* ADULT */
    if (pending.type === "adult") {
        return `
            <div class="operator-action">
                <h3>Тест на взрослость завершён</h3>
                <p>Результат: <b>${state.adultScore}/3</b></p>
                <div class="success-box">
                    ${Math.round(state.adultScore / 3 * 100)}%
                </div>
            </div>
            ${state.penalty ? "" : renderPenaltySelector()}
            ${
                state.penalty
                ? `
                <button class="admin-btn" onclick="sendPenalty()">
                    НАЗНАЧИТЬ ШТРАФ
                </button>
                <button class="admin-btn secondary" onclick="skipPenaltyAndContinue()">
                    ПРОПУСТИТЬ ШТРАФ
                </button>
                `
                : ""
            }
        `;
    }

    /* ROUTE */
    if (pending.type === "route") {
        return `
            <div class="operator-action">
                <h3>Точка ${pending.step + 1}</h3>
                <p>Игрок утверждает, что выполнила эту точку.</p>
            </div>
            <button class="admin-btn" onclick="confirmRoute()">
                ✓ ПОДТВЕРДИТЬ ТОЧКУ
            </button>
            <button class="admin-btn secondary" onclick="rejectPending()">
                ✕ НЕ ПОДТВЕРЖДАТЬ
            </button>
        `;
    }

    /* MEMORY */
    if (pending.type === "memory") {
        return `
            <div class="operator-action">
                <h3>Башня памяти</h3>
                <p>Игрок утверждает, что справилась.</p>
            </div>
            <button class="admin-btn" onclick="confirmMemory()">
                ✓ ПОДТВЕРДИТЬ
            </button>
            <button class="admin-btn secondary" onclick="rejectPending()">
                ✕ НЕ ПОДТВЕРЖДАТЬ
            </button>
        `;
    }

    /* NORMAL */
    return `
        <div class="operator-action">
            <h3>Игрок ждёт подтверждения</h3>
            <p>${stage.title}</p>
        </div>
        <button class="admin-btn" onclick="operatorNext()">
            ✓ ПОДТВЕРДИТЬ ПЕРЕХОД
        </button>
        <button class="admin-btn secondary" onclick="rejectPending()">
            ✕ ОТКАЗАТЬ
        </button>
    `;
}

/* =====================================================
   PENALTY
===================================================== */

// Переменная, чтобы отслеживать, открыт ли выбор штрафа
let isManualPenaltyOpen = false;
let selectedPenaltyText = "";

function openManualPenalty() {
    const customInput = document.getElementById("customPenalty");
    const customText = customInput ? customInput.value.trim() : "";
    const finalPenalty = customText !== "" ? customText : selectedPenaltyText;

    if (!finalPenalty) {
        alert("Выберите вариант наказания или введите своё!");
        return;
    }

    state.penalty = finalPenalty;
    state.penaltyCompleted = false;
    state.pendingOperator = {
        stage: state.currentStage,
        type: "penaltyAssigned"
    };

    if (typeof addLog === "function") {
        addLog(`Оператор выдал наказание: ${state.penalty}`);
    }

    if (typeof saveState === "function") {
        saveState();
    }

    if (typeof renderOperator === "function") {
        renderOperator();
    }

    if (typeof renderPlayer === "function") {
        renderPlayer();
    }

    closePenaltyModal();
}

function closeManualPenalty() {
    isManualPenaltyOpen = false;
    state.penalty = null;
    renderOperator();
}



function renderPenaltySelector() {

    const penalties = [

        "5 приседаний",
        "10 приседаний",
        "20 секунд стоять как статуя",
        "Сказать торжественную клятву",
        "Спеть 10 секунд любой песни",
        "Сделать смешное селфи",
        "Изобразить робота 15 секунд"

    ];

    return `
        <div class="operator-action">

            <h3>
                ШТРАФ
            </h3>

            <p>
                Выберите наказание.
            </p>

            <div class="penalty-list">

                ${penalties.map(p => `

                    <button
                        class="
                            penalty-option
                            ${
                                state.penalty === p
                                    ? "selected"
                                    : ""
                            }
                        "
                        onclick="selectPenalty('${escapeAttribute(p)}')"
                    >
                        ${p}
                    </button>

                `).join("")}

            </div>

        </div>
    `;
}

function selectPenalty(text) {

    // Сохраняем выбранный штраф
    selectedPenaltyText = text;

    // Сохраняем в общем состоянии игры
    state.penalty = text;

    // Обновляем выделение кнопок
    const buttons =
        document.querySelectorAll(".penalty-option");

    buttons.forEach(btn => {

        if (!btn) return;

        const btnText =
            btn.textContent
                ? btn.textContent.trim()
                : "";

        if (btnText.includes(text)) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });

    // Очищаем поле собственного штрафа
    const customInput =
        document.getElementById("customPenalty");

    if (customInput) {
        customInput.value = "";
    }

    // Сохраняем состояние
    saveState();

    // Обновляем интерфейс оператора
    renderOperator();
}

// Отправка выбранного штрафа игроку
function executeManualPenalty() {
    if (!state.penalty) {
        alert("Выберите наказание из списка.");
        return;
    }

    state.penaltyCompleted = false;
    state.pendingOperator = {
        stage: state.currentStage,
        type: "penaltyAssigned"
    };

    addLog(`Оператор выдал наказание: ${state.penalty}`);
    
    isPenaltyModalOpen = false;
    saveState();
    
    renderOperator();
    renderPlayer();
}

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}




function sendPenalty() {

    // Если готовый штраф выбран
    let penalty = state.penalty;

    // Если оператор ввёл свой штраф
    const customInput =
        document.getElementById("customPenalty");

    if (
        customInput &&
        customInput.value.trim()
    ) {
        penalty =
            customInput.value.trim();

        state.penalty =
            penalty;
    }

    if (!penalty) {

        alert(
            "Сначала выберите или введите наказание."
        );

        return;
    }

    state.penaltyCompleted = false;

    state.pendingOperator = {

        stage:
            state.currentStage,

        type:
            "penaltyAssigned"
    };

    addLog(
        `Назначен штраф: ${penalty}`
    );

    saveState();

    // Обновляем обе стороны
    renderOperator();
    renderPlayer();
}


/* =====================================================
   PLAYER PENALTY
===================================================== */

function renderPenaltyPlayer() {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    if (!state.penalty) {
        return;
    }

    const oldPenaltyCard =
        document.getElementById("playerPenaltyCard");

    if (oldPenaltyCard) {
        oldPenaltyCard.remove();
    }

    const penaltyCard =
        document.createElement("div");

    penaltyCard.id =
        "playerPenaltyCard";

    penaltyCard.className =
        "card";

    penaltyCard.innerHTML = `

        <div class="card-label">
            ⚠ SECURITY PROTOCOL // PENALTY
        </div>

        <div class="reveal">

            <div class="huge">
                ⚡
            </div>

            <h2>
                НАЗНАЧЕН ШТРАФ ОПЕРАТОРОМ
            </h2>

            <div class="instruction">

                <div style="
                    font-size:12px;
                    opacity:.6;
                    margin-bottom:6px;
                ">
                    УСЛОВИЕ НАКАЗАНИЯ:
                </div>

                <b>
                    ${state.penalty}
                </b>

            </div>

            ${
                state.penaltyCompleted

                ?

                `
                <div class="success-box">

                    <b>
                        🟢 Выполнение отправлено оператору
                    </b>

                    <br>

                    <span style="opacity:.65;">
                        Ожидается подтверждение администратора...
                    </span>

                </div>
                `

                :

                `
                <button
                    class="main-button"
                    type="button"
                    onclick="penaltyDone()"
                >
                    ✓ Я ВЫПОЛНИЛА
                </button>
                `
            }

        </div>

    `;

    box.appendChild(penaltyCard);
}


function penaltyDone() {
    if (!state.penalty) {
        return;
    }

    state.penaltyCompleted = true;

    state.pendingOperator = {
        stage: state.currentStage,
        type: "penaltyAssigned"
    };

    addLog(
        "Игрок отметила выполнение штрафа"
    );

    saveState();

    renderPlayer();
    renderOperator();
}

function restartStageAfterPenalty() {

    const id = state.currentStage;

    if (!state.penaltyCompleted) {
        alert("Игрок ещё не выполнила штраф.");
        return;
    }

    // Этап не должен считаться завершённым
    state.completed = state.completed.filter(
        stageId => stageId !== id
    );

    // Сбрасываем состояние текущего этапа
    resetCurrentStageAfterPenalty(id);

    // Сбрасываем штраф
    state.penalty = null;
    state.penaltyCompleted = false;
    state.pendingOperator = null;

    addLog(
        `Штраф выполнен. Этап ${id} начинается заново`
    );

    saveState();

    renderPlayer();
    renderOperator();
}


function resetCurrentStageAfterPenalty(stageId) {

    if (stageId === 7) {
        state.adultIndex = 0;
        state.adultScore = 0;
        state.adultFinished = false;
    }

    if (stageId === 8) {
        state.routeStep = 0;
        state.routeConfirmed = [];
    }

    if (stageId === 9) {
        resetTimerStateOnly();
    }

    if (stageId === 12) {
        state.rpsPlayer = null;
        state.rpsOperator = null;
    }

    if (stageId === 14) {
        state.guessNumber = null;
    }

    if (stageId === 15) {
        state.sequenceGame = null;
    }

    if (stageId === 16) {
        state.reactionGame = null;
    }

    if (stageId === 17) {
        state.cardsGameFinished = false;
    }
}

/* =====================================================
   PENALTY CONFIRM
===================================================== */
function confirmPenalty() {
    const id = state.currentStage;

    // Сбрасываем состояние штрафа
    state.pendingOperator = null;
    state.penalty = null;
    state.penaltyCompleted = false;

    // Этап НЕ завершаем.
    // Вместо этого запускаем его заново.
    resetStagesAfter(id);

    // Удаляем этот этап из завершённых,
    // если он каким-то образом туда попал.
    state.completed = state.completed.filter(
        stageId => stageId !== id
    );

    addLog(
        `Штраф выполнен. Этап ${id} начат заново`
    );

    saveState();

    renderOperator();
    renderPlayer();
}


function skipPenaltyAndContinue() {

    const id =
        state.currentStage;

    state.pendingOperator = null;

    state.penalty = null;

    state.penaltyCompleted = false;

    addLog(
        `Штраф этапа ${id} пропущен`
    );

    completeStage(id);
}


/* =====================================================
   ROUTE CONFIRM
===================================================== */

function confirmRoute() {

    const step =
        state.pendingOperator.step;

    state.routeConfirmed[step] =
        true;

    state.pendingOperator =
        null;

    if (
        step <
        stages[7].steps.length - 1
    ) {

        state.routeStep++;

        saveState();

        renderOperator();

        return;
    }

    completeStage(8);

    renderOperator();
}


/* =====================================================
   TIMER DECISION
===================================================== */

function timerDecision(success) {

    state.timerOperatorResult =
        success
            ? "УСПЕЛА"
            : "НЕ УСПЕЛА";

    state.pendingOperator = null;

    addLog(
        `Этап 9: ${state.timerOperatorResult}`
    );

    completeStage(9);
    renderOperator();
}


/* =====================================================
   MEMORY CONFIRM
===================================================== */

function confirmMemory() {

    if (
        !state.pendingOperator ||
        state.pendingOperator.type !== "memory"
    ) {
        return;
    }

    state.pendingOperator = null;

    addLog(
        "Оператор подтвердил этап памяти"
    );

    completeStage(13);
}


/* =====================================================
   RPS OPERATOR
===================================================== */

function operatorRPS(value) {

    // Игрок ещё не выбрала
    if (!state.rpsPlayer) {
        alert("Сначала дождитесь хода игрока.");
        return;
    }

    // Оператор уже выбрал
    if (state.rpsOperator) {
        return;
    }

    state.rpsOperator = value;

    addLog(
        `Оператор выбрал: ${rpsName(value)}`
    );

    saveState();

    renderPlayer();
    renderOperator();
}

function rpsIcon(value) {

    if (value === "rock") {
        return "✊";
    }

    if (value === "scissors") {
        return "✌️";
    }

    if (value === "paper") {
        return "✋";
    }

    return "—";
}

function renderRPSPlayer() {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    // Игрок уже выбрала
    if (state.rpsPlayer && !state.rpsOperator) {

        box.innerHTML = `
            <div class="card rps-card">

                <div class="card-label">
                    BATTLE PROTOCOL // TRANSMITTED
                </div>

                <div class="rps-header">
                    <div class="rps-icon">
                        ${rpsIcon(state.rpsPlayer)}
                    </div>

                    <div>
                        <h2>
                            ХОД ОТПРАВЛЕН
                        </h2>

                        <p class="muted">
                            Твой выбор:
                            <strong>
                                ${rpsName(state.rpsPlayer)}
                            </strong>
                        </p>
                    </div>
                </div>

                <div class="rps-waiting">
                    <span class="status-dot"></span>

                    <div>
                        <strong>
                            ОЖИДАНИЕ ОПЕРАТОРА
                        </strong>

                        <small>
                            Оператор видит твой ход
                            и сейчас делает свой выбор.
                        </small>
                    </div>
                </div>

            </div>
        `;

        return;
    }

    // Оба сделали ход
    if (state.rpsPlayer && state.rpsOperator) {

        const result =
            rpsWinner(
                state.rpsPlayer,
                state.rpsOperator
            );

        box.innerHTML = `
            <div class="card rps-card">

                <div class="card-label">
                    BATTLE PROTOCOL // RESULT
                </div>

                <h2>
                    ДУЭЛЬ ЗАВЕРШЕНА
                </h2>

                <div class="rps-versus">

                    <div class="rps-choice">
                        <div class="rps-big-icon">
                            ${rpsIcon(state.rpsPlayer)}
                        </div>

                        <span>
                            ТВОЙ ХОД
                        </span>

                        <strong>
                            ${rpsName(state.rpsPlayer)}
                        </strong>
                    </div>

                    <div class="rps-vs">
                        VS
                    </div>

                    <div class="rps-choice">
                        <div class="rps-big-icon">
                            ${rpsIcon(state.rpsOperator)}
                        </div>

                        <span>
                            ОПЕРАТОР
                        </span>

                        <strong>
                            ${rpsName(state.rpsOperator)}
                        </strong>
                    </div>

                </div>

                <div class="rps-result">
                    ${result}
                </div>

                <div class="success-box">
                    ✓ Результат передан оператору.
                </div>

            </div>
        `;

        return;
    }

    // Начальное состояние
    box.innerHTML = `
        <div class="card rps-card">

            <div class="card-label">
                BATTLE PROTOCOL
            </div>

            <h2>
                КАМЕНЬ • НОЖНИЦЫ • БУМАГА
            </h2>

            <p class="muted">
                Сделай свой ход.
                <br>
                Оператор увидит его,
                но пока не покажет свой.
            </p>

            <div class="choice-grid rps-choice-grid">

                <button
                    class="choice rps-button"
                    type="button"
                    onclick="rpsPlayer('rock')"
                >
                    <span class="rps-button-icon">✊</span>
                    <span>КАМЕНЬ</span>
                </button>

                <button
                    class="choice rps-button"
                    type="button"
                    onclick="rpsPlayer('scissors')"
                >
                    <span class="rps-button-icon">✌️</span>
                    <span>НОЖНИЦЫ</span>
                </button>

                <button
                    class="choice rps-button"
                    type="button"
                    onclick="rpsPlayer('paper')"
                >
                    <span class="rps-button-icon">✋</span>
                    <span>БУМАГА</span>
                </button>

            </div>

        </div>
    `;
}

/* =====================================================
   OPERATOR NEXT
===================================================== */

async function operatorNext() {

    if (currentRole !== "operator") {
        console.warn(
            "⚠️ operatorNext вызван не оператором"
        );
        return;
    }


    if (!operatorPlayerState) {
        console.warn(
            "⚠️ Состояние игрока ещё не получено"
        );
        return;
    }


    const currentStage =
        operatorPlayerState.currentStage || 1;


    // Меняем состояние игрока
    operatorPlayerState.pendingOperator = null;

    operatorPlayerState.currentStage =
        currentStage + 1;


    // Синхронизируем локальный state оператора
    state = {
        ...operatorPlayerState
    };


    // Сохраняем локально
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(operatorPlayerState)
    );


    console.log(
        `✓ Этап ${currentStage} → ${operatorPlayerState.currentStage}`
    );


    // Отправляем игроку
    sendOperatorState(
        operatorPlayerState
    );


    // Сразу обновляем интерфейс оператора
    if (typeof renderOperator === "function") {
        renderOperator();
    }
}

/* =====================================================
   PREVIOUS
===================================================== */

function operatorPrevious() {

    if (
        state.currentStage <= 1
    ) {
        return;
    }

    const current =
        state.currentStage;

    const previous =
        current - 1;

    state.currentStage =
        previous;

    state.pendingOperator =
        null;


    /*
       Не позволяем оставить
       предыдущий этап завершённым.
    */

    state.completed =
        state.completed.filter(
            id =>
                id < previous
        );


    /* Сброс специальных игр */

    if (previous === 7) {

        state.adultIndex =
            0;

        state.adultScore =
            0;

        state.adultFinished =
            false;
    }


    if (previous === 8) {

        state.routeStep =
            0;

        state.routeConfirmed =
            [];
    }


    if (previous === 9) {

        resetTimerStateOnly();
    }


    if (previous === 12) {

        state.rpsPlayer =
            null;

        state.rpsOperator =
            null;
    }


    if (previous === 14) {

        state.guessNumber =
            null;
    }


    if (previous === 15) {

        state.sequenceGame =
            null;
    }


    if (previous === 16) {

        state.reactionGame =
            null;
    }


    if (previous === 17) {

        state.cardsGameFinished =
            false;
    }


    addLog(
        `Оператор вернул игру с этапа ${current} на этап ${previous}`
    );

    saveState();

    renderOperator();
}



function resetStagesAfter(stageId) {
    if (stageId <= 7) {
        state.adultIndex = 0;
        state.adultScore = 0;
        state.adultFinished = false;
    }

    if (stageId <= 8) {
        state.routeStep = 0;
        state.routeConfirmed = [];
    }

    if (stageId <= 9) {
        resetTimerStateOnly();
    }

    if (stageId <= 12) {
        state.rpsPlayer = null;
        state.rpsOperator = null;
    }

    if (stageId <= 14) {
        state.guessNumber = null;
    }

    if (stageId <= 15) {
        state.sequenceGame = null;
    }

    if (stageId <= 16) {
        state.reactionGame = null;
    }

    if (stageId <= 17) {
        state.cardsGameFinished = false;
    }
}

/* =====================================================
   TIMER RESET
===================================================== */

function resetTimerStateOnly() {

    clearInterval(
        timerInterval
    );

    state.timerTask =
        null;

    state.timerSelected =
        false;

    state.timerReady =
        false;

    state.timerRunning =
        false;

    state.timerFinished =
        false;

    state.timerStartedAt =
        null;

    state.timerOperatorResult =
        null;

    state.timerReport =
        null;
}


/* =====================================================
   REJECT
===================================================== */

function rejectPending() {

    const stageId = state.currentStage;

    // Убираем ожидание оператора
    state.pendingOperator = null;

    // Сбрасываем штраф
    state.penalty = null;
    state.penaltyCompleted = false;

    // =========================================
    // ПОЛНЫЙ СБРОС ИГР
    // =========================================

    state.guessNumber = null;

    state.sequenceGame = null;

    state.reactionGame = null;

    state.rpsPlayer = null;
    state.rpsOperator = null;

    state.cardsGameFinished = false;
    state.finalCardGame = null;

    // Сброс общих игровых состояний
    state.gameStarted = false;
    state.gameFinished = false;
    state.timerStarted = false;
    state.timerFinished = false;

    addLog(
        `Этап ${stageId}: оператор отказал — этап перезапущен`
    );

    // ВАЖНО:
    // currentStage НЕ меняем

    saveState();

    renderPlayer();
    renderOperator();
}


function initFinalCardGame() {

    if (!state.finalCardGame) {

        state.finalCardGame = {

            correctCard:
                Math.floor(Math.random() * 3) + 1,

            attempts: 0,

            finished: false

        };

        saveState();
    }
}

/* =====================================================
   STAGE LIST
===================================================== */

function renderStageList() {

    const box =
        document.getElementById(
            "stageList"
        );

    if (!box) return;

    box.innerHTML =
        stages.map(
            stage => {

                const active =
                    stage.id ===
                    state.currentStage;

                const done =
                    state.completed.includes(
                        stage.id
                    );

                return `

                    <div class="
                        stage-list-item
                        ${active ? "active" : ""}
                        ${done ? "done" : ""}
                    ">

                        <span>

                            ${String(
                                stage.id
                            ).padStart(
                                2,
                                "0"
                            )}

                            —

                            ${stage.title}

                        </span>

                        <span>

                            ${
                                done
                                    ? "✓"
                                    : active
                                        ? "●"
                                        : ""
                            }

                        </span>

                    </div>
                `;
            }
        ).join("");
}


/* =====================================================
   OPERATOR LOG
===================================================== */

function renderOperatorLog() {

    const box =
        document.getElementById(
            "operatorLog"
        );

    if (!box) return;

    if (!state.logs.length) {

        box.innerHTML = `

            <div class="log-item">
                Система готова.
            </div>
        `;

        return;
    }

    box.innerHTML =
        state.logs.map(
            item => `

                <div class="log-item">

                    <b>
                        ${item.time}
                    </b>

                    —

                    ${item.text}

                </div>
            `
        ).join("");
}


/* =====================================================
   RESET
===================================================== */

function operatorReset() {

    if (
        !confirm(
            "Сбросить весь прогресс дела №18?"
        )
    ) {

        return;
    }

    localStorage.removeItem(
        STORAGE_KEY
    );

    location.reload();
}


/* =====================================================
   FINAL
===================================================== */

function showFinal() {

    clearInterval(
        timerInterval
    );

    document
        .querySelectorAll(".screen")
        .forEach(
            x =>
                x.classList.remove(
                    "active"
                )
        );

    const final =
        document.getElementById(
            "finalScreen"
        );

    if (final) {

        final.classList.add(
            "active"
        );
    }

    launchConfetti();
}


/* =====================================================
   CONFETTI
===================================================== */

function launchConfetti() {

    const canvas =
        document.getElementById(
            "confetti"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext(
            "2d"
        );

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    const colors = [

        "#c51cff",

        "#ff4fd8",

        "#55ffb0",

        "#ffd43b",

        "#ffffff"
    ];

    const pieces =
        Array.from(
            {
                length: 150
            },
            () => ({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    -Math.random() *
                    canvas.height,

                size:
                    4 +
                    Math.random() * 7,

                speed:
                    2 +
                    Math.random() * 4,

                color:
                    colors[
                        Math.floor(
                            Math.random() *
                            colors.length
                        )
                    ],

                rotation:
                    Math.random() * 360,

                rotationSpeed:
                    -5 +
                    Math.random() * 10
            })
        );

    function frame() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        pieces.forEach(
            p => {

                p.y +=
                    p.speed;

                p.rotation +=
                    p.rotationSpeed;

                ctx.save();

                ctx.translate(
                    p.x,
                    p.y
                );

                ctx.rotate(
                    p.rotation *
                    Math.PI /
                    180
                );

                ctx.fillStyle =
                    p.color;

                ctx.fillRect(
                    -p.size / 2,
                    -p.size / 2,
                    p.size,
                    p.size * 1.7
                );

                ctx.restore();
            }
        );

        requestAnimationFrame(
            frame
        );
    }

    frame();
}


/* =====================================================
   PARTICLES
===================================================== */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );

    if (!container) return;

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.className =
            "particle";

        particle.style.left =
            Math.random() *
            100 +
            "%";

        particle.style.animationDuration =
            8 +
            Math.random() *
            14 +
            "s";

        particle.style.animationDelay =
            -Math.random() *
            15 +
            "s";

        particle.style.opacity =
            .15 +
            Math.random() *
            .45;

        container.appendChild(
            particle
        );
    }
}


/* =====================================================
   STORAGE SYNC
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key !==
            STORAGE_KEY
        ) {
            return;
        }

        loadState();

        const player =
            document.getElementById(
                "playerScreen"
            );

        const operator =
            document.getElementById(
                "operatorScreen"
            );

        const playerVisible =
            player &&
            player.classList.contains(
                "active"
            );

        const operatorVisible =
            operator &&
            operator.classList.contains(
                "active"
            );

        if (playerVisible) {

            renderPlayer();
        }

        if (operatorVisible) {

            renderOperator();
        }
    }
);


function setGuessNumber() {

    const input =
        document.getElementById("operatorGuessNumber");

    if (!input) return;

    const value = Number(input.value);

    if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 18
    ) {
        alert("Введите число от 1 до 18");
        return;
    }

    state.guessNumber = {
        secret: value,
        attempts: 0,
        finished: false,
        won: false,
        lastGuess: null,
        message: ""
    };

    addLog(`Оператор загадал число: ${value}`);

    saveState();

    // ВОТ ЭТО ОБЯЗАТЕЛЬНО
    renderPlayer();
    renderOperator();
}



let memoryTimerInterval = null;
let memoryTimeLeft = 10;


function startMemoryTest() {

    const intro =
        document.getElementById("memoryIntro");

    const test =
        document.getElementById("memoryTest");

    const timer =
        document.getElementById("memoryTimer");

    const status =
        document.getElementById("memoryStatus");

    const card =
        document.querySelector(".memory-card");

    if (!intro || !test || !timer) return;

    clearInterval(memoryTimerInterval);

    let time = 10;

    intro.style.display = "none";
    test.style.display = "block";

    if (status) {
        status.textContent = "ТЕСТ ИДЁТ";
    }

    timer.textContent = time;

    memoryTimerInterval = setInterval(() => {

        time--;

        timer.textContent = time;

        if (time <= 3) {

            card?.classList.add(
                "memory-danger"
            );

        }

        if (time <= 0) {

            clearInterval(
                memoryTimerInterval
            );

            if (status) {
                status.textContent =
                    "ВРЕМЯ ВЫШЛО";
            }

            timer.textContent = "0";

            const finished =
                document.getElementById(
                    "memoryFinished"
                );

            if (finished) {
                finished.style.display =
                    "block";
            }
        }

    }, 1000);
}
function renderReactionStage() {

    const box =
        document.getElementById("stageContent");

    if (!box) return;

    box.innerHTML = `
        <div class="reaction-card">

            <!-- сюда HTML реакции,
                 который я дал выше -->

        </div>
    `;
}



/* =====================================================
   INIT
===================================================== */

loadState();

createParticles();



