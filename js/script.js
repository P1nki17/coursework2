import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

document.querySelector('.record').textContent = localStorage.getItem('record');
const gameBoard = document.getElementById("game-board");

const popup = document.querySelector(".popup");
const reloadBtn = document.querySelector(".btn__reload");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

const reload = () => {
  location.reload()
}

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
  window.addEventListener("touchstart", function (e) { TouchStart(e); });
  window.addEventListener("touchmove", function (e) { TouchMove(e); });
  window.addEventListener("touchend", function (e) { TouchEnd(e); });
}

async function handleInput(event) {
  switch (event.keyCode) {
    case 38:
    case 87:
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case 40:
    case 83:
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case 37:
    case 65:
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case 39:
    case 68:
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      setupInputOnce();
      return;
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd()
    popup.classList.add("is-active");
    reloadBtn.addEventListener("click", reload);
    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles()
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}

var touchStart = null;
var touchPosition = null;

function TouchStart(e) {

  touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  touchPosition = { x: touchStart.x, y: touchStart.y };
}

function TouchMove(e) {

  touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
}

function TouchEnd(e) {
  CheckAction();
  touchStart = null;
  touchPosition = null;
}

async function CheckAction() {

  const sensitivity = 20;

  var d =
  {
    x: touchStart.x - touchPosition.x,
    y: touchStart.y - touchPosition.y
  };

  if (Math.abs(d.x) > Math.abs(d.y)) {
    if (Math.abs(d.x) > sensitivity) {
      if (d.x > 0) {
        if (!canMoveLeft()) {
          setupInputOnce();
          return;
        }
        await moveLeft();
      }
      else {
        if (!canMoveRight()) {
          setupInputOnce();
          return;
        }
        await moveRight();
      }
      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);

      if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        popup.classList.add("is-active");
        reloadBtn.addEventListener("click", reload);
        return;
      }
    }
  }
  else {
    if (Math.abs(d.y) > sensitivity) {
      if (d.y > 0) {
        if (!canMoveUp()) {
          setupInputOnce();
          return;
        }
        await moveUp();
      }
      else {
        if (!canMoveDown()) {
          setupInputOnce();
          return;
        }
        await moveDown();
      }
      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);

      if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        popup.classList.add("is-active");
        reloadBtn.addEventListener("click", reload);
        return;
      }
    }
  }

}