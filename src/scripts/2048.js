// SELECTORS
const squares = document.getElementsByClassName('game__square');
const resetButton = document.querySelector('.reset');
const tileGrid = document.querySelector('.tile__grid');
const tiles = document.getElementsByClassName('tile');

document.addEventListener('DOMContentLoaded', () => insert2(2));
document.addEventListener('keydown', (event) => handleBoardMove(event));
resetButton.addEventListener('click', (event) => handleReset());

/*** STATE ***/

// the current state of the tile grid.
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

/*** EVENT HANDLERS ***/

async function handleBoardMove(event) {
  switch (event.key) {
    case 'ArrowUp':
      columns = await handleMove('up', columns);
      rows = updateRow(columns);
      break;
    case 'ArrowDown':
      columns = await handleMove(
        'down',
        columns.map((col) => col.reverse())
      );
      rows = updateRow(columns);
      break;
    case 'ArrowLeft':
      rows = await handleMove('left', rows);
      columns = updateColumn(rows);
      break;
    case 'ArrowRight':
      rows = await handleMove(
        'right',
        rows.map((row) => row.reverse())
      );
      columns = updateColumn(rows);
      break;
    default:
      break;
  }
  await setTimeout(() => {
    insert2(1);
  }, 350);
}
async function handleMove(dir, arr) {
  console.log(dir, arr);
  let newArr = [...arr];
  for (const [index, column] of arr.entries()) {
    let newCol = [...column];
    for (const [i, tile] of column.entries()) {
      // If at start of column, no need to move
      if (i === 0 || tile === '') continue;
      let moveCount;
      moveCount = calculateMoveOfTile(tile, newCol.slice(0, i).reverse());
      newCol[i] = '';
      // If new position is empty, move there. If occupied, merge.
      newCol[i - moveCount] =
        newCol[i - moveCount] === ''
          ? tile
          : await merge(tile, newCol[i - moveCount]);

      // Move the tile in the browser
      if (moveCount) moveTile(tile, moveCount, dir);
    }
    newArr[index] =
      dir === 'right' || dir === 'down' ? newCol.reverse() : newCol;
  }
  return newArr;
}

// Using async to ensure tiles are only removed after move animation is complete
async function merge(tileA, tileB) {
  tileA.textContent = parseInt(tileA.textContent) + parseInt(tileB.textContent);
  // Time set for same as move animation/transition
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

function insert2(count = 1) {
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
function handleReset() {
  [...tiles].forEach((t) => t.remove());
  resetRowsAndColumns();
  [...squares].forEach((square) => {
    square.textContent = '';
  });
  insert2(8);
}

/*** HELPER FUNCTIONS ***/

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
    matrix = `matrix(1, 0, 0, 1, ${newX}, ${currY})`;
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
function generateUniqueCoordinates() {
  const x = Math.floor(Math.random() * 4);
  const y = Math.floor(Math.random() * 4);
  const existingTile = columns[x][y] ;
  if (existingTile) return generateUniqueCoordinates();
  return [x + 1, y + 1];
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

function updateRow(cols) {
  let rows = [];
  for (const [i, col] of cols.entries()) {
    for (const [j, tile] of col.entries()) {
      if (!rows[j]) rows[j] = [];
      rows[j][i] = tile;
    }
  }
  return rows;
}
function updateColumn(r) {
  let cols = [];
  for (const [i, row] of r.entries()) {
    for (const [j, tile] of row.entries()) {
      if (!cols[j]) cols[j] = [];
      cols[j][i] = tile;
    }
  }
  return cols;
}
