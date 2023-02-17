let $tiles = document.getElementById('tiles');

let createTiles = () => {
  let rows = 9;
  let columns = 9;
  let mines = 10;

  if (mines > rows * columns) {
    return alert('Cannot have more mines than tiles.');
  }

  for (let i = 0; i < rows; i++) {
    let $row = document.createElement('div');

    $tiles.appendChild($row);

    for (let j = 0; j < columns; j++) {
      let $tile = document.createElement('div');

      $tile.classList.add('tile');
      $tile.innerHTML = 'x';
      $row.appendChild($tile);
    }
  }
}

createTiles();
