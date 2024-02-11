const nbCols = 100;
const nbRows = 100;
const cellSize = 5;

const grid = Array.from(Array(nbRows), () =>
  Object.seal(new Array(nbCols).fill(0))
);

const container = document.getElementById("grid-container");

const cells = container.children;

document.documentElement.style.setProperty("--cols", nbCols);
document.documentElement.style.setProperty("--cellSize", cellSize + "px");

let h = 0;

const backgroundColor = "rgba(128, 128, 128, 0.301)";

let initialX = container.offsetLeft;
let initialY = container.offsetTop;

let width = nbCols * cellSize;
let height = nbRows * cellSize;

let endX = width + initialX;
let endY = height + initialY;

window.addEventListener("resize", () => {
  initialX = container.offsetLeft;
  initialY = container.offsetTop;
  endX = width + initialX;
  endY = height + initialY;
});

function createSand(i, j, color) {
  grid[i][j] = 1;
  cells[j + nbCols * i].style.backgroundColor = color;
}

function drawGrid() {
  let isHolding = false;

  for (let row = 0; row < nbRows; row++) {
    for (let col = 0; col < nbCols; col++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("grid-cell");

      cellElement.addEventListener("mousedown", () => {
        if (grid[row][col] == 0) {
          drawKernel(row, col);
          h = (h + 7) % 360;
        }

        isHolding = true;
        // moveSand(row, col);
        container.addEventListener("mousemove", (event) => {
          if (isHolding) {
            const deltaX = event.clientX;
            const deltaY = event.clientY;

            if (
              deltaX < initialX ||
              deltaX > endX ||
              deltaY < initialY ||
              deltaY > endY
            )
              return;
            let indexes = getCellFromPosition(deltaX, deltaY);
            if (grid[indexes[0]][indexes[1]] == 1) return;
            drawKernel(indexes[0], indexes[1]);
          }
        });

        container.addEventListener("mouseup", () => {
          isHolding = false;
        });
      });
      container.appendChild(cellElement);
    }
  }
}

let hcounter = 0;
function drawKernel(i, j) {
  let kernel = 3;
  let n = parseInt(kernel / 2);

  let top = -n,
    right = n,
    bottom = n,
    left = -n;

  if (i <= n - 1) {
    top = -i;
  }
  if (i >= nbRows - n) {
    bottom = nbRows - i - 1;
  }

  if (j <= n - 1) {
    left = -j;
  }

  if (j >= nbCols - n) {
    right = nbCols - j - 1;
  }

  for (let k = top; k <= bottom; k++) {
    for (let l = left; l <= right; l++) {
      createSand(i + k, j + l, `hsl(${h},100%,50%)`);
    }
  }
  if (hcounter == 2) h = (h + 1) % 360;

  hcounter = (hcounter + 1) % 3;
}

function getCellFromPosition(x, y) {
  let i = parseInt((y - initialY) / cellSize);
  let j = parseInt((x - initialX) / cellSize);
  return [i, j];
}

function moveSand(row, col) {
  if (grid[row + 1][col] == 0) {
    movedown(row, col);
  } else if (grid[row + 1][col + 1] == 0 && grid[row + 1][col - 1] == 0) {
    let r = Math.round(Math.random());
    if (r == 0) {
      moveLeft(row, col);
      col--;
    } else {
      moveRight(row, col);
      col++;
    }
  } else if (grid[row + 1][col + 1] == 0) {
    moveRight(row, col);
    col++;
  } else if (grid[row + 1][col - 1] == 0) {
    moveLeft(row, col);
    col--;
  }
}

function movedown(row, col) {
  grid[row][col] = 0;
  let cell = cells[col + nbCols * row];
  let color = cell.style.backgroundColor;
  cell.style.backgroundColor = backgroundColor;

  createSand(row + 1, col, color);
}

function moveRight(row, col) {
  grid[row][col] = 0;
  let cell = cells[col + nbCols * row];
  let color = cell.style.backgroundColor;
  cell.style.backgroundColor = backgroundColor;

  createSand(row + 1, col + 1, color);
}

function moveLeft(row, col) {
  grid[row][col] = 0;
  let cell = cells[col + nbCols * row];
  let color = cell.style.backgroundColor;
  cell.style.backgroundColor = backgroundColor;
  createSand(row + 1, col - 1, color);
}

drawGrid();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
whileLoop();
async function whileLoop() {
  while (true) {
    for (let i = nbRows - 1; i >= 0; i--) {
      for (let j = nbCols; j >= 0; j--) {
        if (grid[i][j] == 1 && i + 1 != nbRows) {
          moveSand(i, j);
        }
      }
    }
    await delay(5);
  }
}
