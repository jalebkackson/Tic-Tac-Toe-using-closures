function Cell() {
  let value = "";

  const getValue = () => {
    return value;
  };

  const placeToken = (token) => {
    if (value === "") {
      value = token;
      return true;
    } else {
      return false;
    }
  };

  return { getValue, placeToken };
}

function Gameboard() {
  const board = [];
  for (let i = 0; i <= 2; i++) {
    const row = [];
    for (let n = 0; n <= 2; n++) {
      row.push(Cell());
    }
    board.push(row);
  }
  const getBoardValues = () => {
    return board.map((eachRow) => {
      return eachRow.map((eachCell) => {
        return eachCell.getValue();
      });
    });
  };

  const printBoard = () => {
    console.log(getBoardValues());
  };

  const placeTokenAt = (row, col, token) => {
    return board[row][col].placeToken(token);
  };

  return { getBoardValues, printBoard, placeTokenAt };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const gameboard = Gameboard();
  let gameStatus = "playing";

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];
  console.log(`Start Game, ${activePlayer.name}s turn`);
  gameboard.printBoard();

  // returns activeplayer for use in domcontrol()
  const getActivePlayer = () => activePlayer;

  // returns nonActive player for use in domcontrol()
  const getNonActivePlayer = () => {
    return players.find((player) => player !== activePlayer);
  };

  const switchPlayerTurn = () => {
    if (activePlayer === players[0]) {
      activePlayer = players[1];
    } else {
      activePlayer = players[0];
    }
  };

  let isGameOver = false;

  const playRound = (row, col) => {
    if (isGameOver) {
      return;
    }

    // check invalid moves
    if (
      row < 0 ||
      row > 2 ||
      col < 0 ||
      col > 2 ||
      !Number.isInteger(row) ||
      !Number.isInteger(col)
    ) {
      console.log("Invalid Move Try again");
      return;
    }

    // place token and return a true false
    const moveWasSuccessful = gameboard.placeTokenAt(
      row,
      col,
      activePlayer.token
    );

    // check game over conditions before continuing
    if (moveWasSuccessful) {
      const hasWinner = checkWinner(row, col);
      if (hasWinner || isGameOver) {
        isGameOver = true;
        return;
      }
      switchPlayerTurn();
      console.log(`Move Successful, ${activePlayer.name}s turn`);
    } else {
      console.log("Cell is taken dumbass try again");
    }
    gameboard.printBoard();
    return;
  };

  const checkWinner = (row, col) => {
    const values = gameboard.getBoardValues();

    const playerWins = () => {
      console.log(`${activePlayer.name} wins`);
      gameboard.printBoard();
    };
    // spot for possible playerLoses function

    // check RIGHT diagonals
    if (
      values[row][col] === values[0][0] &&
      values[row][col] === values[1][1] &&
      values[row][col] === values[2][2]
    ) {
      gameStatus = "won";
      playerWins();
      return true;
    }

    // check LEFT diagonals
    if (
      values[row][col] === values[0][2] &&
      values[row][col] === values[1][1] &&
      values[row][col] === values[2][0]
    ) {
      gameStatus = "won";
      playerWins();
      return true;
    }

    // check ROWS
    if (values[row].every((value) => value === activePlayer.token)) {
      gameStatus = "won";
      playerWins();
      return true;
    }
    // check COLs
    const columns = [values[0][col], values[1][col], values[2][col]];
    if (columns.every((value) => value === activePlayer.token)) {
      gameStatus = "won";
      playerWins();
      return true;
    }
    //check TIE
    if (values.every((row) => row.every((value) => value !== ""))) {
      console.log("Tie Game, no winners");
      gameboard.printBoard();
      gameStatus = "tie";
      isGameOver = true;
    }
    return false;
  };

  const getGameStatus = () => gameStatus;

  return {
    playRound,
    getBoardValues: gameboard.getBoardValues,
    getActivePlayer,
    getNonActivePlayer,
    getGameStatus,
  };
}

function DomControl() {
  let game;
  const userBoard = document.querySelector("#gameboard");

  const startingDailog = document.querySelector("#start-dialog");
  const player1Input = document.querySelector("#player1");
  const player2Input = document.querySelector("#player2");
  const startGameForm = document.querySelector(".start-menu");

  const resetBtn = document.querySelector("#reset-btn");
  const message = document.querySelector(".control-message");
  const replayDialog = document.querySelector("#replay-dialog");
  const endGameMsg1 = document.querySelector("#end-message-1");
  const endGameMsg2 = document.querySelector("#end-message-2");
  const replayBtn = document.querySelector("#replay-btn");

  startingDailog.showModal();

  startGameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameOne = player1Input.value.trim();
    const nameTwo = player2Input.value.trim();
    startingDailog.close();
    message.hidden = false;
    resetBtn.hidden = false;
    gameboard.hidden = false;

    game = GameController(nameOne, nameTwo);
    message.textContent = `Start Game! ${game.getActivePlayer().name}'s turn: ${
      game.getActivePlayer().token
    }`;
    displayBoard();
  });

  const displayBoard = () => {
    userBoard.replaceChildren();

    const setStatusMessage = () => {
      if (game.getGameStatus() === "playing") {
        message.textContent = `${game.getActivePlayer().name}'s Turn: ${
          game.getActivePlayer().token
        }`;
      } else if (game.getGameStatus() === "won") {
        message.textContent = `${game.getActivePlayer().name} WINS!`;
        endGameMsg1.textContent = `${game.getActivePlayer().name} WINS!`;
        endGameMsg2.textContent = `${game.getNonActivePlayer().name} is gay`;
        replayDialog.showModal();
      } else if (game.getGameStatus() === "tie") {
        message.textContent = `No Winner, Tie Game`;
        replayDialog.showModal();
      }
    };

    const resetGame = () => {
      game = GameController(
        player1Input.value.trim(),
        player2Input.value.trim()
      );
      displayBoard();
      replayDialog.close();
      message.textContent = `${game.getActivePlayer().name}'s Turn: ${
        game.getActivePlayer().token
      }`;
    };

    replayBtn.addEventListener("click", (e) => {
      resetGame();
    });
    resetBtn.addEventListener("click", (e) => {
      resetGame();
    });

    game.getBoardValues().forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const cell = document.createElement("button");
        cell.textContent = col;
        userBoard.appendChild(cell);
        cell.classList.add("cell");
        // style X's and O's
        if (col === "X") {
          cell.classList.add("token-x");
        } else if (col === "O") {
          cell.classList.add("token-o");
        }
        cell.addEventListener("click", (e) => {
          game.playRound(rowIndex, colIndex);
          displayBoard();
          console.log(game.getGameStatus());
          setStatusMessage();
        });
      });
    });
  };

  const controlMessage = () => {};

  return { displayBoard, controlMessage };
}
const display = DomControl();
