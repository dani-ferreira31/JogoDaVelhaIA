const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('#status');
const restartBtn = document.querySelector('#restartBtn');
const scoreXElement = document.querySelector('#scoreX');
const scoreOElement = document.querySelector('#scoreO');
const drawsElement = document.querySelector('#draws');
const trainBtn = document.querySelector('#trainBtn');
const difficultySelect = document.querySelector('#difficulty');

const trainingModal = document.querySelector('#trainingModal');
const progressBar = document.querySelector('#progressBar');
const progressText = document.querySelector('#progressText');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let scores = { X: 0, O: 0, draws: 0 };

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// ==========================================
// IA (Q-LEARNING)
// ==========================================
class TicTacToeAI {
    constructor() {
        this.qTable = {};
        this.learningRate = 0.3;
        this.discountFactor = 0.95;
        this.epsilon = 1.0;
    }

    getState(board) {
        return board.map(v => v === '' ? '-' : v).join('');
    }

    getQValues(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = new Array(9).fill(0);
        }
        return this.qTable[state];
    }

    chooseAction(board) {
        const state = this.getState(board);
        const qValues = this.getQValues(state);

        const available = board
            .map((v, i) => v === '' ? i : null)
            .filter(v => v !== null);

        if (available.length === 0) return null;

        if (Math.random() < this.epsilon) {
            return available[Math.floor(Math.random() * available.length)];
        }

        let maxQ = -Infinity;
        let bestMoves = [];

        for (let move of available) {
            let val = qValues[move];
            if (val > maxQ) {
                maxQ = val;
                bestMoves = [move];
            } else if (val === maxQ) {
                bestMoves.push(move);
            }
        }

        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    setDifficulty(level) {
        if (level === 'easy') this.epsilon = 0.8;
        if (level === 'medium') this.epsilon = 0.2;
        if (level === 'hard') this.epsilon = 0.0;
    }
}

const ai = new TicTacToeAI();

// ==========================================
// MINIMAX (IMBATÍVEL)
// ==========================================
function findBestMoveMinimax(board) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMax) {
    let result = checkWinner(board);

    if (result !== null) {
        if (result === 'O') return 10 - depth;
        if (result === 'X') return depth - 10;
        return 0;
    }

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return best;
    }
}

// ==========================================
// JOGO
// ==========================================
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
difficultySelect.addEventListener('change', (e) => ai.setDifficulty(e.target.value));

function handleCellClick(e) {
    const index = parseInt(e.target.getAttribute('data-index'));

    if (board[index] !== '' || !isGameActive || currentPlayer !== 'X') return;

    playMove(index, 'X');

    if (isGameActive) {
        currentPlayer = 'O';
        statusDisplay.innerHTML = "IA calculando...";
        setTimeout(makeAIMove, 200);
    }
}

// 🔴 NOVA LÓGICA HÍBRIDA
function makeAIMove() {
    if (!isGameActive) return;

    let move;

    if (difficultySelect.value === 'easy') {
        move = ai.chooseAction(board);

    } else if (difficultySelect.value === 'medium') {
        move =
            findWinningMove(board, 'O') ||
            findWinningMove(board, 'X') ||
            ai.chooseAction(board);

    } else {
        // HARD = IMPOSSÍVEL
        move =
            findWinningMove(board, 'O') ||
            findWinningMove(board, 'X') ||
            findBestMoveMinimax(board);
    }

    if (move !== null) playMove(move, 'O');

    if (isGameActive) {
        currentPlayer = 'X';
        statusDisplay.innerHTML = "Sua vez, Jogador X!";
    }
}

function playMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.innerHTML = player;
    cell.className = `cell ${player.toLowerCase()}`;
    checkGameEnd();
}

function checkWinner(b) {
    for (let cond of winningConditions) {
        const [a,b1,c] = cond;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            return b[a];
        }
    }
    return b.includes('') ? null : 'Empate';
}

function checkGameEnd() {
    const result = checkWinner(board);
    if (result) {
        isGameActive = false;

        if (result === 'Empate') {
            statusDisplay.innerHTML = 'Empate!';
            updateScore('draw');
        } else {
            statusDisplay.innerHTML = `Jogador ${result} venceu!`;
            updateScore(result);
        }
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        scores.X++;
        scoreXElement.innerHTML = scores.X;
    } else if (winner === 'O') {
        scores.O++;
        scoreOElement.innerHTML = scores.O;
    } else {
        scores.draws++;
        drawsElement.innerHTML = scores.draws;
    }
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusDisplay.innerHTML = "Sua vez, Jogador X!";

    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.className = 'cell';
    });
}

// ==========================================
// TREINAMENTO (mantido, mas ajustado)
// ==========================================
trainBtn.addEventListener('click', () => {
    ai.qTable = {};
    trainingModal.classList.remove('hidden');
    trainBtn.disabled = true;

    let total = 200000;
    let current = 0;

    let startTime = performance.now();

    function trainChunk() {
        let chunkStart = performance.now();

        for (let i = 0; i < 5000 && current < total; i++) {
            simulateGameForTraining();
            current++;
        }

        let progress = Math.floor((current / total) * 100);
        progressBar.style.width = progress + "%";
        progressText.innerText = progress + "%";

        // ⏱️ TEMPO ESTIMADO
        let now = performance.now();
        let elapsed = now - startTime;

        let avgPerGame = elapsed / current;
        let remaining = (total - current) * avgPerGame;

        let seconds = Math.floor(remaining / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        document.getElementById("timeEstimate").innerText =
            `Tempo restante: ${minutes}m ${seconds}s`;

        if (current < total) {
            setTimeout(trainChunk, 0);
        } else {
            trainingModal.classList.add('hidden');
            trainBtn.disabled = false;
            restartGame();
        }
    }

    trainChunk();
});

function simulateGameForTraining() {
    let sim = ['', '', '', '', '', '', '', '', ''];
    let turn = Math.random() > 0.5 ? 'X' : 'O';

    while (true) {
        let available = sim.map((v,i)=>v===''?i:null).filter(v=>v!==null);
        if (available.length === 0) break;

        let move;

        if (turn === 'X') {
            move =
                findWinningMove(sim,'X') ||
                findWinningMove(sim,'O') ||
                available[Math.floor(Math.random()*available.length)];
            sim[move] = 'X';

        } else {
            move = ai.chooseAction(sim);
            sim[move] = 'O';
        }

        let res = checkWinner(sim);
        if (res) break;

        turn = turn === 'X' ? 'O' : 'X';
    }
}

function findWinningMove(b, player) {
    for (let cond of winningConditions) {
        let [a,b1,c] = cond;
        let vals = [b[a], b[b1], b[c]];
        if (vals.filter(v=>v===player).length===2 && vals.includes('')) {
            return [a,b1,c][vals.indexOf('')];
        }
    }
    return null;
}

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

ai.setDifficulty(difficultySelect.value);