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
      playerWins();
      return true;
    }

    // check LEFT diagonals
    if (
      values[row][col] === values[0][2] &&
      values[row][col] === values[1][1] &&
      values[row][col] === values[2][0]
    ) {
      playerWins();
      return true;
    }

    // check ROWS
    if (values[row].every((value) => value === activePlayer.token)) {
      playerWins();
      return true;
    }
    // check COLs
    const columns = [values[0][col], values[1][col], values[2][col]];
    if (columns.every((value) => value === activePlayer.token)) {
      playerWins();
      return true;
    }
    //check TIE
    if (values.every((row) => row.every((value) => value !== ""))) {
      console.log("Tie Game, no winners");
      gameboard.printBoard();
      isGameOver = true;
    }
    return false;
  };
  return { playRound };
}

const game = GameController();
