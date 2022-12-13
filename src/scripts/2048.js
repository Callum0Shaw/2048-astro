// SELECTORS
const squares = document.getElementsByClassName('game__square');
const resetButton = document.querySelector('.reset');
const tileGrid = document.querySelector('.tile__grid');
const tiles = document.getElementsByClassName('tile');

document.addEventListener('DOMContentLoaded', () => insert2([...squares], 2));
document.addEventListener('keydown', (event) => handleBoardMove(event));
resetButton.addEventListener('click', (event) => handleReset([...squares]));

// STATE
let rows = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];
let columns = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

async function handleBoardMove(event) {
  switch (event.key) {
    case 'ArrowUp':
      for (const [index, column] of columns.entries()) {
        let newCol = [...column];
        for (const [i, tile] of column.entries()) {
          console.log(newCol);
          if (i === 0) {
            continue;
          }
          let moveCount;
          if (tile !== '') {
            console.log(tile, moveCount, newCol[i - moveCount]);
            moveCount = calculateMoveOfTile(tile, newCol.slice(0, i).reverse());
            newCol[i] = '';
            newCol[i - moveCount] =
              newCol[i - moveCount] === ''
                ? tile
                : await merge(tile, newCol[i - moveCount]);
          }
          if (moveCount) moveTile(tile, moveCount, 'up');
        }
        columns[index] = newCol;
      }

      break;
    case 'ArrowDown':
      for (const t of tiles) {
      }

      break;
    case 'ArrowLeft':
      for (const t of tiles) {
      }
      break;
    case 'ArrowRight':
      for (const t of tiles) {
      }
      break;
    default:
      break;
  }
}
async function merge(tileA, tileB) {
  tileA.textContent = parseInt(tileA.textContent) + parseInt(tileB.textContent);
  await setTimeout(() => {
    tileB.remove();
  }, 300);
  return tileA;
}

function moveTile(tile, move, dir) {
  const { transform } = getComputedStyle(tile);
  const numbers = transform.match(/\d+(?:\.\d+)?/g).map(Number);
  const currX = numbers[4];
  const currY = numbers[5];

  let matrix = calculateNewMatrix(dir, move, currX, currY);
  tile.style.transform = matrix;
}
function calculateNewMatrix(dir, move, currX, currY) {
  let matrix = '';
  let moveInPx = 0;
  if (dir === 'up' || dir === 'down') {
    moveInPx = dir === 'up' ? -100 * move : 100 * move;
    const newY = currY + moveInPx;
    matrix = `matrix(1, 0, 0, 1, ${currX}, ${newY})`;
  }
  if (dir === 'left' || dir === 'right') {
    moveInPx = dir === 'left' ? -100 * move : 100 * move;
    const newX = currX + moveInPx;
    matrix = `matrix(1, 0, 0, 1, ${currY}, ${newX})`;
  }
  return matrix;
}

function calculateMoveOfTile(tile, array) {
  let move = 0;
  for (const prev of array) {
    if (prev === '') move++;
    else if (tile.textContent === prev.textContent) {
      return move + 1;
    } else return move;
  }
  return move;
}
function insert2(arr, count = 1) {
  for (let i = 0; i < count; i++) {
    const [x, y] = generateUniqueCoordinates();
    const tile = document.createElement('span');
    tile.className = `tile tile${x}-${y}`;
    tile.dataset.y = y;
    tile.dataset.x = x;
    tile.textContent = '2';
    const newTile = tileGrid.appendChild(tile);
    rows[y - 1][x - 1] = newTile;
    columns[x - 1][y - 1] = newTile;
  }
}
function generateUniqueCoordinates() {
  const x = Math.floor(Math.random() * 4 + 1);
  const y = Math.floor(Math.random() * 4 + 1);
  const existingTile = document.querySelector(`.tile${x}-${y}`);
  if (existingTile) return generateUniqueCoordinates();
  return [x, y];
}

function handleReset(squares) {
  [...tiles].forEach((t) => t.remove());
  resetRowsAndColumns();
  squares.forEach((square) => {
    square.textContent = '';
  });
  insert2(squares, 8);
}

function resetRowsAndColumns() {
  rows = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  columns = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
}
