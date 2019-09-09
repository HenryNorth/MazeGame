let context;
let canvas;
let maze;
let mazeHeight;
let mazeWidth;
let playerIcon;

class Player {
  constructor() {
    this.col = 0;
    this.row = 0;
  }
}

class MazeCell {
  constructor(col, row) {
    this.col = col;
    this.row = row;

    this.rightWall = true;
    this.topWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.visited = false;
  }
}

class Maze {
  constructor(cols, rows, cellSize) {
    this.backgroundColor = "#ffffff";
    this.endColor = "#00ff00";
    this.mazeColor = "#000000";
    this.playerColor = "#ff0000";
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;

    this.cells = [];

    this.generate()
  }

  generate() {
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.cols * this.cellSize;

    canvas.height = mazeHeight;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    for (let col = 0; col < this.cols; col++) {
      this.cells[col] = [];
      for (let row = 0; row < this.rows; row++) {
        this.cells[col][row] = new MazeCell(col, row);
      }
    }

    let randomCol = Math.floor(Math.random() * this.cols);
    let randomRow = Math.floor(Math.random() * this.rows);

    let stack = [];
    stack.push(this.cells[randomCol][randomRow]);

    let currentCell;
    let nextCell;
    let dir;
    let foundNeighbor;

    while (this.hasUntouched(this.cells)) {
      currentCell = stack[stack.length - 1];
      currentCell.visited = true;
      if (this.hasUntouchedNeighbor(currentCell)) {
        nextCell = null;
        foundNeighbor = false;
        do {
          dir = Math.floor(Math.random() * 4);
          switch (dir) {
            case 0:
              if (currentCell.col !== (this.cols - 1) && !this.cells[currentCell.col + 1][currentCell.row].visited) {
                currentCell.rightWall = false;
                nextCell = this.cells[currentCell.col + 1][currentCell.row];
                nextCell.leftWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currentCell.row !== 0 && !this.cells[currentCell.col][currentCell.row - 1].visited) {
                currentCell.topWall = false;
                nextCell = this.cells[currentCell.col][currentCell.row - 1];
                nextCell.bottomWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currentCell.row !== (this.rows - 1) && !this.cells[currentCell.col][currentCell.row + 1].visited) {
                currentCell.bottomWall = false;
                nextCell = this.cells[currentCell.col][currentCell.row + 1];
                nextCell.topWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currentCell.col !== 0 && !this.cells[currentCell.col - 1][currentCell.row].visited) {
                currentCell.leftWall = false;
                nextCell = this.cells[currentCell.col - 1][currentCell.row];
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
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (!this.cells[col][row].visited) {
          return true;
        }
      }
    }
    return false;
  }

  hasUntouchedNeighbor(mazeCell) {
    return (
        (mazeCell.col !== 0               && !this.cells[mazeCell.col - 1][mazeCell.row].visited) ||
        (mazeCell.col !== (this.cols - 1) && !this.cells[mazeCell.col + 1][mazeCell.row].visited) ||
        (mazeCell.row !== 0               && !this.cells[mazeCell.col][mazeCell.row - 1].visited) ||
        (mazeCell.row !== (this.rows - 1) && !this.cells[mazeCell.col][mazeCell.row + 1].visited)
      );
  }

  redraw() {
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, mazeHeight, mazeWidth);

    context.fillStyle = this.endColor;
    context.fillRect((this.cols - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize);

    context.strokeStyle = this.mazeColor;
    context.strokeRect(0, 0, mazeHeight, mazeWidth);

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.cells[col][row].rightWall) {
          context.beginPath();
          context.moveTo((col + 1) * this.cellSize, row * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].topWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, row * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, row * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].bottomWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, (row + 1) * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].leftWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, row * this.cellSize);
          context.lineTo(col * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
      }
    }
    context.fillStyle = this.playerColor;
    context.fillRect((player.col * this.cellSize) + 2, (player.row * this.cellSize) + 2, this.cellSize - 4, this.cellSize - 4);
  }
}

onGenerate = () => {
  maze.cols = document.getElementById("cols").value;
  maze.rows = document.getElementById("rows").value;
  maze.generate();
}

onKeyDown = (event) => {
  switch (event.keyCode) {
    case 37:
      if (!maze.cells[player.col][player.row].leftWall) {
        player.col = player.col - 1;
      }
      break;
    case 39:
      if (!maze.cells[player.col][player.row].rightWall) {
        player.col = player.col + 1;
      }
      break;
    case 40:
      if (!maze.cells[player.col][player.row].bottomWall) {
        player.row = player.row + 1;
      }
      break;
    case 38:
      if (!maze.cells[player.col][player.row].topWall) {
        player.row = player.row - 1;
      }
      break;
    default:
      break;
  }
  maze.redraw();
}

onLoad = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  player = new Player();
  maze = new Maze(20, 20, 25);

  document.addEventListener("keydown", onKeyDown);
  document.getElementById("generate").addEventListener("click", onGenerate);
}
