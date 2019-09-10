let context;
let canvas;
let maze;
let mazeHeight;
let mazeWidth;
let playerIcon;

class PlayerIcon {
  constructor() {
    this.column = 0;
    this.row = 0;
  }
}

class MazeCell {
  constructor(column, row) {
    this.column = column;
    this.row = row;

    this.rightWall = true;
    this.topWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.visited = false;
  }
}

class Maze {
  constructor(columns, rows, cellSize) {
    this.backgroundColor = "#ffffff";
    this.endColor = "#00ff00";
    this.mazeColor = "#000000";
    this.playerColor = "#ff0000";
    this.rows = rows;
    this.columns = columns;
    this.cellSize = cellSize;

    this.cells = [];

    this.isGameStarted = false;

    this.totalSeconds = 0;

    this.generateMaze()
  }

  generateMaze() {
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.columns * this.cellSize;

    canvas.height = mazeHeight;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    playerIcon.column = 0;
    playerIcon.row = 0;

    for (let column = 0; column < this.columns; column++) {
      this.cells[column] = [];
      for (let row = 0; row < this.rows; row++) {
        this.cells[column][row] = new MazeCell(column, row);
      }
    }

    let randomColumn = Math.floor(Math.random() * this.columns);
    let randomRow = Math.floor(Math.random() * this.rows);

    let stack = [];
    stack.push(this.cells[randomColumn][randomRow]);

    let currentCell;
    let nextCell;
    let directory;
    let foundNeighbor;

    while (this.hasUntouched(this.cells)) {
      currentCell = stack[stack.length - 1];
      currentCell.visited = true;
      if (this.hasUntouchedNeighbor(currentCell)) {
        nextCell = null;
        foundNeighbor = false;
        do {
          directory = Math.floor(Math.random() * 4);
          switch (directory) {
            case 0:
              if (currentCell.column !== (this.columns - 1) && !this.cells[currentCell.column + 1][currentCell.row].visited) {
                currentCell.rightWall = false;
                nextCell = this.cells[currentCell.column + 1][currentCell.row];
                nextCell.leftWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currentCell.row !== 0 && !this.cells[currentCell.column][currentCell.row - 1].visited) {
                currentCell.topWall = false;
                nextCell = this.cells[currentCell.column][currentCell.row - 1];
                nextCell.bottomWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currentCell.row !== (this.rows - 1) && !this.cells[currentCell.column][currentCell.row + 1].visited) {
                currentCell.bottomWall = false;
                nextCell = this.cells[currentCell.column][currentCell.row + 1];
                nextCell.topWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currentCell.column !== 0 && !this.cells[currentCell.column - 1][currentCell.row].visited) {
                currentCell.leftWall = false;
                nextCell = this.cells[currentCell.column - 1][currentCell.row];
                nextCell.rightWall = false;
                foundNeighbor = true;
              }
              break;
          }
          if (foundNeighbor) {
            stack.push(nextCell);
          }
        } while (!foundNeighbor)
      } else {
        currentCell = stack.pop();
      }
    }
    this.redraw();
  }

  hasUntouched() {
    for (let column = 0; column < this.columns; column++) {
      for (let row = 0; row < this.rows; row++) {
        if (!this.cells[column][row].visited) {
          return true;
        }
      }
    }
    return false;
  }

  hasUntouchedNeighbor(mazeCell) {
    return (
        (mazeCell.column !== 0 && !this.cells[mazeCell.column - 1][mazeCell.row].visited) ||
        (mazeCell.column !== (this.columns - 1) && !this.cells[mazeCell.column + 1][mazeCell.row].visited) ||
        (mazeCell.row !== 0 && !this.cells[mazeCell.column][mazeCell.row - 1].visited) ||
        (mazeCell.row !== (this.rows - 1) && !this.cells[mazeCell.column][mazeCell.row + 1].visited)
      );
  }

  redraw() {
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, mazeHeight, mazeWidth);

    context.fillStyle = this.endColor;
    context.fillRect((this.columns - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize);

    context.strokeStyle = this.mazeColor;
    context.strokeRect(0, 0, mazeHeight, mazeWidth);

    for (let column = 0; column < this.columns; column++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.cells[column][row].rightWall) {
          context.beginPath();
          context.moveTo((column + 1) * this.cellSize, row * this.cellSize);
          context.lineTo((column + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[column][row].topWall) {
          context.beginPath();
          context.moveTo(column * this.cellSize, row * this.cellSize);
          context.lineTo((column + 1) * this.cellSize, row * this.cellSize);
          context.stroke();
        }
        if (this.cells[column][row].bottomWall) {
          context.beginPath();
          context.moveTo(column * this.cellSize, (row + 1) * this.cellSize);
          context.lineTo((column + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[column][row].leftWall) {
          context.beginPath();
          context.moveTo(column * this.cellSize, row * this.cellSize);
          context.lineTo(column * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
      }
    }
    context.fillStyle = this.playerColor;
    context.fillRect((playerIcon.column * this.cellSize) + 2, (playerIcon.row * this.cellSize) + 2, this.cellSize - 4, this.cellSize - 4);
  }
}

onGenerateMazeClick = () => {
  mazeSize = document.getElementById("mazeSize").value;

  minMaxSizeWarning = document.getElementById("minMaxSizeWarning");

  if (mazeSize > 30) {
    minMaxSizeWarning.innerHTML = "Maximium maze size is 30";
  }
  else if (mazeSize < 5) {
    minMaxSizeWarning.innerHTML = "Minimium maze size is 5";
  }
  else {
    maze.columns = mazeSize;
    maze.rows = mazeSize;
    minMaxSizeWarning.innerHTML = "";
    maze.generateMaze();
  }
}

onStartButtonClick = () => {
  maze.isGameStarted = true;

  startTimer = setInterval(startTimerCount, 1000);
  document.getElementById("startButton").disabled = true;
  document.getElementById("stopButton").disabled = false;
}

onStopButtonClick = () => {
  maze.isGameStarted = false;
  maze.totalSeconds = 0;

  clearInterval(startTimer);
  document.getElementById("timer").innerHTML = maze.totalSeconds + " Seconds";
  document.getElementById("startButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
}

startTimerCount = (totalSeconds) => {
  maze.totalSeconds++;

  document.getElementById("timer").innerHTML = maze.totalSeconds + " Seconds";
}

onKeyDown = (event) => {
  if (maze.isGameStarted === true) {
    switch (event.keyCode) {
      case 37:
        if (!maze.cells[playerIcon.column][playerIcon.row].leftWall) {
          playerIcon.column = playerIcon.column - 1;
        }
        break;
      case 39:
        if (!maze.cells[playerIcon.column][playerIcon.row].rightWall) {
          playerIcon.column = playerIcon.column + 1;
        }
        break;
      case 38:
        if (!maze.cells[playerIcon.column][playerIcon.row].topWall) {
          playerIcon.row = playerIcon.row - 1;
        }
        break;
      case 40:
        if (!maze.cells[playerIcon.column][playerIcon.row].bottomWall) {
          playerIcon.row = playerIcon.row + 1;
        }
        break;
      default:
        break;
    }
    maze.redraw();
  }
  else if (maze.isGameStarted === false) {
    return false;
  }
}

onLoad = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  playerIcon = new PlayerIcon();
  maze = new Maze(20, 20, 25);

  document.addEventListener("keydown", onKeyDown);
  document.getElementById("generate").addEventListener("click", onGenerateMazeClick);
  document.getElementById("startButton").addEventListener("click", onStartButtonClick);
  document.getElementById("stopButton").addEventListener("click", onStopButtonClick);
  document.getElementById("stopButton").disabled = true;
}
