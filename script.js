document.addEventListener('DOMContentLoaded', function () {
    let board = document.getElementById('board');
    let scoreElement = document.getElementById('score');
    let currentPlayer = 0;
    let boardArray = Array.from({ length: 8 }, () => Array(8).fill(''));
    let playerNames = ['', '']; // Noms des joueurs

    initializePlayers();
    initializeBoard();

    function initializePlayers() {
        playerNames[0] = prompt("Entrez le nom du joueur Noir :") || 'Black';
        playerNames[1] = prompt("Entrez le nom du joueur vert :") || 'green';
        updateScore(); // Mettre à jour les noms des joueurs dès le début
    }

    function restartGame() {
        setTimeout(() => {
            location.replace(location.href);
        }, 3000);
        
    }
    

    function initializeBoard() {
        // Ajoute deux cases de chaque joueur au centre
        boardArray[3][3] = 'Black';
        boardArray[3][4] = 'Black';
        boardArray[4][3] = 'White';
        boardArray[4][4] = 'White';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Place les pièces diagonalement au centre
                if ((row === 3 && col === 3) || (row === 4 && col === 4)) {
                    boardArray[row][col] = 'Black';
                } else if ((row === 3 && col === 4) || (row === 4 && col === 3)) {
                    boardArray[row][col] = 'White';
                }
    
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => onCellClick(row, col));
                board.appendChild(cell);
            }
        }
        updateBoard();
        updateScore();
    }

    function onCellClick(row, col) {
        if (boardArray[row][col] === '' && isAdjacentCellSelected(row, col) && isDirectlyConnected(row, col)) {
            boardArray[row][col] = currentPlayer === 0 ? 'Black' : 'White';
            currentPlayer = 1 - currentPlayer; // Switch player
            updateBoard();
            let winner = checkWinner();
            console.log(winner)
            if (winner !== null) {
                showBootstrapAlert(`Le joueur ${playerNames[winner]} a gagné!`, 'success');
                restartGame();
            } else if (isBoardFull()) {
                showBootstrapAlert("Match nul!", 'warning');
                restartGame();
            }
        } else {
            showBootstrapAlert("Erreur : action impossible", 'danger');
        }
    }

    function isAdjacentCellSelected(row, col) {
        // Vérifie si une cellule adjacente a déjà été sélectionnée
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && !(i === row && j === col) && boardArray[i][j] !== '') {
                    return true;
                }
            }
        }
        return false;
    }

    function isDirectlyConnected(row, col) {
        // Vérifie si la cellule est directement connectée à une cellule sélectionnée
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && !(i === row && j === col) && boardArray[i][j] !== '' && isCellConnected(row, col, i, j)) {
                    return true;
                }
            }
        }
        return false;
    }

    function isCellConnected(row1, col1, row2, col2) {
        // Vérifie si deux cellules sont directement connectées
        return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
    }

    function updateBoard() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            cell.textContent = boardArray[row][col];
            cell.classList.remove('black', 'white');
            if (boardArray[row][col] === 'Black') {
                cell.classList.add('black');
            } else if (boardArray[row][col] === 'White') {
                cell.classList.add('white');
            }
        });
        updateScore();
    }

    function updateScore() {
        let scorePlayer1 = boardArray.flat().filter(color => color === 'Black').length;
        let scorePlayer2 = boardArray.flat().filter(color => color === 'White').length;
        scoreElement.textContent = `${playerNames[0]}: ${scorePlayer1} | ${playerNames[1]}: ${scorePlayer2}`;
    }

    function checkWinner() {
        // Check rows, columns, and diagonals for a winner
        if (checkLinesForWinner(boardArray) || checkColumnsForWinner(boardArray) || checkDiagonalsForWinner(boardArray)) {
            return currentPlayer === 0 ? 1 : 0;
        }
        return null;
    }

    function checkLinesForWinner(board) {
        for (let row = 0; row < 8; row++) {
            if (checkConsecutiveElements(board[row])) {
                return true; // Il y a un gagnant
            }
        }
        return false;
    }

    function checkColumnsForWinner(board) {
        for (let col = 0; col < 8; col++) {
            let column = [];
            for (let row = 0; row < 8; row++) {
                column.push(board[row][col]);
            }
            if (checkConsecutiveElements(column)) {
                return true; // Il y a un gagnant
            }
        }
        return false;
    }

    function checkDiagonalsForWinner(board) {
        for (let i = 0; i < 8; i++) {
            let diagonal1 = [];
            let diagonal2 = [];
            for (let j = 0; j < 8 - i; j++) {
                diagonal1.push(board[j][i + j]);
                diagonal2.push(board[j][7 - i - j]);
            }
            if (checkConsecutiveElements(diagonal1) || checkConsecutiveElements(diagonal2)) {
                return true; // Il y a un gagnant
            }
        }
        return false;
    }
    function checkConsecutiveElements(line) {
        let consecutiveCount = 0;
        let currentColor = '';
    
        for (let i = 0; i < line.length; i++) {
            if (line[i] !== '') {
                if (line[i] === currentColor) {
                    consecutiveCount++;
                } else {
                    currentColor = line[i];
                    consecutiveCount = 1;
                }
    
                if (consecutiveCount === 8) {
                    return true; // Il y a un gagnant
                }
            } else {
                consecutiveCount = 0; // Réinitialise le compteur si une case vide est rencontrée
            }
        }
        return false;
    }



    function isBoardFull() {
        return boardArray.flat().every(cell => cell !== '');
    }

    function showBootstrapAlert(message, type) {
        // Create a Bootstrap alert element
        let alertElement = document.createElement('div');
        alertElement.classList.add('alert', `alert-${type}`);
        alertElement.role = 'alert';
        alertElement.innerHTML = `
        <strong>${message}</strong>
        `;

        // Append the alert to the container
        let container = document.querySelector('.container');
        container.appendChild(alertElement);

        // Automatically dismiss the alert after 3 seconds (adjust as needed)
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
});
