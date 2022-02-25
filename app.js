// Data Layer //
const GAME_STATE = {};
function resetGame(GAME_STATE) {
    GAME_STATE.player = 1,
    GAME_STATE.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    return GAME_STATE;
}

function switchPlayer(GAME_STATE, player) {
    GAME_STATE.player = player;
    return GAME_STATE;
}

function nextPlayer(GAME_STATE) {
    return switchPlayer(GAME_STATE,GAME_STATE.player === 1 ? 0 : 1);
}

function play(GAME_STATE, x, y) {
    if(isGameOver(GAME_STATE)) {
        return GAME_STATE;
    }
    const { player } = GAME_STATE; // Object Destructing / or this use same const player = GAME_STATE.player;
    if(GAME_STATE.board[y][x] !== null)
        return GAME_STATE;
    GAME_STATE.board[y][x] = player === 1 ? 'X' : 'O';
    return isGameOver(GAME_STATE) ? GAME_STATE : nextPlayer(GAME_STATE);
}

function checkWinner(GAME_STATE) {
    const { board } = GAME_STATE;
    const allSame = line =>
        line.every(cell => cell === 'X') ||
        line.every(cell => cell === 'O')
    const lineCheck = (board) => board.some(allSame);
    const crossCheck = (board) =>
        allSame([board[0][2], board[1][1], board[2][0]]) ||
        allSame([board[0][0], board[1][1], board[2][2]])

    const transposedBoard = board[0].map((col, i) => board.map(row => row[i]));
    return lineCheck(board) || lineCheck(transposedBoard) || crossCheck(board);
}

function isGameOver(GAME_STATE) {
    if(checkWinner(GAME_STATE)) {
        return true;
    }
    return GAME_STATE.board.every(line => line.every(cell => cell !== null));
}

function checkDraw(GAME_STATE) {
    if(!isGameOver(GAME_STATE) || checkWinner(GAME_STATE)) {
        return false;
    }
    return true;
}

function whoWin(GAME_STATE) {
    if (checkDraw(GAME_STATE)) {
        return -1;
    }
    if(!checkWinner(GAME_STATE)) {
        return false;
    }
    return GAME_STATE.player;
}
resetGame(GAME_STATE);

// View Layer //
var cells  = document.querySelectorAll('td');
cells.forEach(cell => cell.addEventListener('click', e => {
    const {x, y} = e.target.dataset;
    play(GAME_STATE, parseInt(x), parseInt(y));
    drawBoard(GAME_STATE);
}))

function drawBoard(GAME_STATE) {
    var player = document.querySelector('#player');
    var winner = document.querySelector('#winner');
    var board = document.querySelector('#xox');
    board.classList.remove('finished');

    const winnerPlayer = whoWin(GAME_STATE);
    GAME_STATE.board.forEach((line, y) => line.forEach((cell,x) => {
        const cellDom = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        cellDom.innerText = cell;
        if(cell !== null) {
            cellDom.classList.add(cell);
        } else {
            cellDom.classList.remove('X', 'O');
        }
    }));
    player.innerText = GAME_STATE.player === 1 ? 'X' : 'O';
    if(winnerPlayer === false) {
        winner.innerText = '...';
    } else {
        board.classList.add('finished');
        if(winnerPlayer === -1 ) {
            winner.innerText = 'BERABERE';
        } else {
            winner.innerText = winnerPlayer === 1 ? 'X' : 'O';
        }
    }
}
document.querySelector('#restart',).addEventListener('click', () => {
    drawBoard(resetGame(GAME_STATE));
});
drawBoard(GAME_STATE);