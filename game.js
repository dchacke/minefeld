let $tiles = document.getElementById('tiles');
let $newGame = document.getElementById('new-game');
let $seconds = document.getElementById('seconds');

let rows = 9;
let columns = 9;

let getSurrounding = $tile => {
  let row = Number($tile.dataset.row);
  let column = Number($tile.dataset.column);

  let min = 0;
  let maxRow = rows - 1;
  let maxColumn = columns - 1;

  let affectedRows = Array.from(new Set([Math.max(min, row - 1), row, Math.min(maxRow, row + 1)]));
  let affectedColumns = Array.from(new Set([Math.max(min, column - 1), column, Math.min(maxColumn, column + 1)]));

  return affectedRows
    .map(i => {
      return affectedColumns
        // .filter(j => i != row && j != column)
        .map(j => document.getElementById(`tile_${i}_${j}`));
    }).flat();
};

let createTiles = () => {
  for (let i = 0; i < rows; i++) {
    let $row = document.createElement('div');

    $tiles.appendChild($row);

    for (let j = 0; j < columns; j++) {
      let $tile = document.createElement('div');

      $tile.classList.add('tile');
      $tile.id = `tile_${i}_${j}`;

      let isMine = Math.random() > 0.9;

      $tile.dataset.isMine = isMine;
      $tile.dataset.row = i;
      $tile.dataset.column = j;

      if (isMine) {
        $tile.innerHTML = 'x';
        $tile.onclick = e => {
          alert('Game over. You hit a mine!');
        }
      }

      $tile.onmouseenter = e => {
        $tile.classList.add('hovered');

        getSurrounding($tile).forEach($t => $t.classList.add('surrounding'));
      };

      $tile.onmouseleave = e => {
        $tile.classList.remove('hovered');

        getSurrounding($tile).forEach($t => $t.classList.remove('surrounding'));
      };

      $row.appendChild($tile);
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let $tile = document.getElementById(`tile_${i}_${j}`);

      if ($tile.dataset.isMine === 'false') {
        let count = getSurrounding($tile)
          .filter($el => $el.dataset.isMine === 'true')
          .length;

        $tile.innerHTML = count;
      }
    }
  }
};

let interval;

let countTime = () => {
  interval = setInterval(() => {
    $seconds.innerText = Number($seconds.innerText) + 1;
  }, 1000);
};

let reset = () => {
  clearInterval(interval);
  $tiles.innerHTML = '';
  $seconds.innerText = '0';
};

let restart = () => {
  reset();
  createTiles();
  countTime();
};

$newGame.onclick = restart;

restart();
