// SELECTORS
const squares = document.getElementsByClassName('game__square');
const resetButton = document.querySelector('.reset');

window.addEventListener('DOMContentLoaded', () => insert2([...squares], 2));
resetButton.addEventListener('click', (event) => handleReset([...squares]));
document.addEventListener('keydown', (event) => handleBoardMove(event));

function handleBoardMove(event) {
  switch (event.key) {
    case 'ArrowUp':
      console.log('hello');
      shiftUp();
      break;
    case 'ArrowDown':
      break;
    case 'ArrowLeft':
      break;
    case 'ArrowRight':
      break;
    default:
      break;
  }
}

function shiftUp() {
  for (const square of squares) {
    if (square.textContent !== '') {
      const row = square.parentNode;
      const column = square.dataSet.column;
      if (!row === 1) {
        const newSquare = document.querySelector(
          `[data-row="${row - 1}] :nth-child(${column})`
        );
        newSquare.textContent = 2;
      }
    }
  }
}

function insert2(arr, count = 1) {
  const index = Math.floor(Math.random() * arr.length);
  arr[index].textContent = '2';
  count--;
  if (count > 0) {
    arr.splice(index, 1);
    insert2(arr, count);
  }
}

function handleReset(squares) {
  squares.forEach((square) => {
    square.textContent = '';
  });
  insert2(squares, 2);
}