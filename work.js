let boxes = document.querySelectorAll(".box");
let win = document.querySelector(".winner");
let scoreBoard = document.querySelector(".scoreboard");
let turnIndicator = document.querySelector(".turn-indicator"); // NEW

let player1Name = "";
let player2Name = "";
let rounds = 0;
let currentRound = 1;
let p1Score = 0;
let p2Score = 0;
let turn = true;
let gameStarted = false;

const patterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

function showSetup() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("setup-screen").style.display = "block";
}

function startGame() {
    player1Name = document.getElementById("player1").value || "Player 1";
    player2Name = document.getElementById("player2").value || "Player 2";
    rounds = parseInt(document.getElementById("rounds").value) || 1;
    currentRound = 1;
    p1Score = 0;
    p2Score = 0;
    gameStarted = true;
    turn = true;

    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    enableBoxes();
    updateScoreboard();
    updateTurnIndicator(); // NEW
}

function newGame() {
    location.reload();
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameStarted || box.innerText !== "") return;

        box.innerText = turn ? "O" : "X";
        box.disabled = true;

        checkWinner();
        turn = !turn;
        updateTurnIndicator(); // NEW
    });
});

function checkWinner() {
    for (let p of patterns) {
        let [a, b, c] = p;
        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            const symbol = boxes[a].innerText;
            if (symbol === "O") {
                p1Score++;
            } else {
                p2Score++;
            }
            disableBoxes();
            nextRound();
            return;
        }
    }

    if ([...boxes].every((b) => b.innerText !== "")) {
        nextRound(); // Draw
    }
}

function nextRound() {
    if (currentRound >= rounds) {
        updateScoreboard(); // FIX: ensure score updates before final message
        setTimeout(() => {
            declareFinalWinner();
        }, 1000);
    } else {
        currentRound++;
        setTimeout(() => {
            resetBoxes();
            updateScoreboard();
            updateTurnIndicator(); // NEW
        }, 800);
    }
}

function declareFinalWinner() {
    let msg = "";
    if (p1Score > p2Score) {
        msg = `🏆 ${player1Name} wins the game!`;
    } else if (p2Score > p1Score) {
        msg = `🏆 ${player2Name} wins the game!`;
    } else {
        msg = `🤝 It's a tie!`;
    }

    win.innerText = msg;
    turnIndicator.innerText = ""; // CLEAR TURN
    triggerConfetti();
    gameStarted = false;
}

function updateScoreboard() {
    scoreBoard.innerText = `${player1Name}: ${p1Score} | ${player2Name}: ${p2Score} | Round ${currentRound} of ${rounds}`;
    win.innerText = "";
}

function updateTurnIndicator() {
    if (!gameStarted) {
        turnIndicator.innerText = "";
        return;
    }
    const currentPlayer = turn ? player1Name : player2Name;
    const symbol = turn ? "O" : "X";
    turnIndicator.innerText = `🔄 ${currentPlayer}'s Turn (${symbol})`;
}

function disableBoxes() {
    boxes.forEach((box) => (box.disabled = true));
}

function enableBoxes() {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });
    win.innerText = "";
}

function resetBoxes() {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });
}

function triggerConfetti() {
    const container = document.getElementById("confetti-container");
    for (let i = 0; i < 30; i++) {
        const emoji = ["🎉", "✨", "🎊", "💥"][Math.floor(Math.random() * 4)];
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.innerText = emoji;
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "500px";
        confetti.style.color = getRandomColor();
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

function getRandomColor() {
    const colors = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
    return colors[Math.floor(Math.random() * colors.length)];
}
