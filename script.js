const boxes = document.querySelectorAll('.ttbox');
const newGameBtn = document.getElementById('new-game');
const resultOutput = document.getElementById('game-result');

const gameboard = (function() {
    const updateBox = function(box, player) {
        box.innerText = player.symbol;
        box.classList.add(player.style);
    };

    const resetBoard = function() {
        for (let box of boxes) {
            box.innerText = '';
            box.classList.remove('xstyle', 'ostyle');
        };
    }

    return {
        updateBox,
        resetBoard
    }
})();

const gameState = (function() {
    let player1Wins = 0;
    let player2Wins = 0; 
    let draws = 0;
    const getP1Wins = () => player1Wins;
    const getDraws = () => draws;
    const getP2Wins = () => player2Wins;
    const p1Victory = () => player1Wins++;
    const drawResult = () => draws++;
    const p2Victory = () => player2Wins++;
    return {
        getP1Wins,
        getDraws,
        getP2Wins,
        p1Victory,
        drawResult,
        p2Victory
    }
})();

function Game(p1, p2) {
    const p1WinDisplay = document.getElementById('player1-score');
    const p2WinDisplay = document.getElementById('player2-score');
    const drawDisplay = document.getElementById('draws');
    let activePlayer = p1;
    let clicks = 0;
    const winStates = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal (top-left to bottom-right)
        [2, 4, 6]  // Diagonal (top-right to bottom-left)
    ];

    function checkWinner() {
        const board = Array.from(boxes).map(box => box.innerText); // Get current state of the board
    
        for (const winState of winStates) {
            const [a, b, c] = winState;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    const handleBoxClick = (box) => {
        if (!box.innerText) {
            clicks++;
            gameboard.updateBox(box, activePlayer);
            const winner = checkWinner();
            if (winner) {
                resultOutput.innerText = `${activePlayer.name} wins!`
                disableAllBoxes();
                (activePlayer === p1) ? gameState.p1Victory() : gameState.p2Victory();
                updateDisplays();
            } else if (clicks > 8) {
                resultOutput.innerText = `The game is a draw!`
                disableAllBoxes();
                gameState.drawResult();
                updateDisplays();
            } else {
                activePlayer = (activePlayer === p1) ? p2 : p1;
            }
        }
    };

    const updateDisplays = () => {
        p1WinDisplay.innerText = gameState.getP1Wins();
        p2WinDisplay.innerText = gameState.getP2Wins();
        drawDisplay.innerText = gameState.getDraws();
    }

    const disableAllBoxes = () => {
        boxes.forEach(box => {
            box.removeEventListener("click", box.handleClick);
        });
    };

    newGameBtn.addEventListener("click", resetGame);

    function resetGame() {
        gameboard.resetBoard();
        clicks = 0;
        activePlayer = p1;
        boxes.forEach(box => {
            box.addEventListener("click", box.handleClick);
        });
    }

    for (let box of boxes) {
        box.handleClick = () => handleBoxClick(box);
        box.addEventListener("click", box.handleClick);
    }
}

function Player(name, symbol, style) {
    this.name = name;
    this.symbol = symbol;
    this.style = style;
}

const player1 = new Player("Player 1", "X", "xstyle");
const player2 = new Player("Player 2", "0", "ostyle");
let game = new Game(player1, player2);