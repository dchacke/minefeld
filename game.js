let $tiles = document.getElementById('tiles');

let createTiles = () => {
  let rows = 9;
  let columns = 9;

  for (let i = 0; i < rows; i++) {
    let $row = document.createElement('div');

    $tiles.appendChild($row);

    for (let j = 0; j < columns; j++) {
      let $tile = document.createElement('div');

      $tile.classList.add('tile');

      let isMine = Math.random() > 0.9;

      $tile.dataset.isMine = isMine;

      if (isMine) {
        $tile.innerHTML = 'x';
      }

      $row.appendChild($tile);
    }
  }
}

createTiles();
