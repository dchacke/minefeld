let $tiles = document.getElementById('tiles');
let $newGame = document.getElementById('new-game');
let $seconds = document.getElementById('seconds');
let $mineCount = document.getElementById('mine-count');
let $status = document.getElementById('status');
let $image = document.getElementById('image');

let rows = 9;
let columns = 9;
let mines = 0;
let flagged = 0;
let revealed = 0;

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
        .map(j => document.getElementById(`tile_${i}_${j}`));
    }).flat();
};

let reveal = ($tile, done = new Set()) => {
  if (done.has($tile.id)) {
    return;
  }

  $tile.dataset.revealed = true;

  if ($tile.dataset.flagged === 'true') {
    $tile.dataset.flagged = false;
    updateMineCountDisplay(flagged - 1);
  }

  done.add($tile.id);
  revealed++;

  if ($tile.dataset.isMine === 'true') {
    $tile.innerText = 'x';
  } else if ($tile.dataset.count != '0') {
    $tile.innerText = $tile.dataset.count;
  }

  if (revealed === rows * columns - flagged && mines - flagged === 0) {
    $image.src = './happy.gif';
    $status.innerText = 'Congrats! You beat the game!';
  } else if (Number($tile.dataset.count) === 0) {
    getSurrounding($tile)
      .filter($t => $t.dataset.isMine === 'false' && $t.dataset.revealed === 'false')
      .forEach($t => reveal($t, done));
  }
};

let createTiles = () => {
  for (let i = 0; i < rows; i++) {
    let $row = document.createElement('div');

    $tiles.appendChild($row);

    for (let j = 0; j < columns; j++) {
      let $tile = document.createElement('div');

      $tile.classList.add('tile');
      $tile.id = `tile_${i}_${j}`;
      $tile.innerHTML = '&nbsp;';

      let isMine = Math.random() > 0.9;

      $tile.dataset.isMine = isMine;
      $tile.dataset.revealed = false;
      $tile.dataset.row = i;
      $tile.dataset.column = j;

      if (isMine) {
        mines++;

        $tile.onclick = e => {
          // TODO: Reveal ONLY this one tile, no surrounding
          reveal($tile);
          $image.src = './lost.gif';
          $status.innerText = 'Game over. You hit a mine! Newman is pleased...';
        }
      }

      $tile.oncontextmenu = e => {
        if ($tile.dataset.flagged === 'true') {
          $tile.dataset.flagged = false;
          updateMineCountDisplay(flagged - 1);
        } else if ($tile.dataset.revealed != 'true') {
          $tile.dataset.flagged = true;
          updateMineCountDisplay(flagged + 1);
        }

        e.preventDefault();
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

  updateMineCountDisplay(flagged);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let $tile = document.getElementById(`tile_${i}_${j}`);

      if ($tile.dataset.isMine === 'false') {
        let count = getSurrounding($tile)
          .filter($el => $el.dataset.isMine === 'true')
          .length;

        $tile.dataset.count = count;

        if ($tile.dataset.revealed === 'false') {
          $tile.onclick = e => {
            reveal($tile);
          };
        }
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

let updateMineCountDisplay = count => {
  flagged = count;
  $mineCount.innerText = mines - flagged;
};

let reset = () => {
  clearInterval(interval);
  updateMineCountDisplay(0);
  revealed = 0;
  flagged = 0;
  mines = 0;
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
