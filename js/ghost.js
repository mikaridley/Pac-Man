'use strict'

const GHOST = '&#9781'
var gGhosts
var gDeadGhosts = []
var gIntervalGhosts

function createGhost(board) {
  var ghost = {
    location: {
      i: 3,
      j: 3,
    },
    currCellContent: FOOD,
    color: getRandomColor(),
  }

  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
  // empty the gGhosts array, create 3 ghosts
  gGhosts = []

  for (var i = 0; i < 3; i++) {
    createGhost(board)
  }
  // run the interval to move them
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
  // loop through ghosts
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]

    moveGhost(ghost) // {location , currCellContent}
  }
}

function moveGhost(ghost) {
  // console.log('ghost:', ghost)
  // figure out moveDiff, nextLocation, nextCell

  var moveDiff = getMoveDiff()

  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  // console.log('nextLocation:', nextLocation) // {i,j}

  var nextCell = gBoard[nextLocation.i][nextLocation.j] // '.'
  // console.log('nextCell:', nextCell)

  // return if cannot move
  if (nextCell === WALL || nextCell === GHOST || nextCell === CHERRY) return

  // hitting a pacman? call gameOver
  if (nextCell === PACMAN) {
    gameOver()
  }

  // moving from current location (restore prev cell contents):
  // update the model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
  // update the DOM
  renderCell(ghost.location, ghost.currCellContent)
  paintCell(ghost.location, '#ffffff')

  // Move the ghost to new location (save cell contents):
  // update the model
  gBoard[nextLocation.i][nextLocation.j] = GHOST
  ghost.location = nextLocation
  ghost.currCellContent = nextCell

  // update the DOM

  if (gPacman.isSuper) paintCell(ghost.location, '#fd0101')
  else paintCell(ghost.location, ghost.color)
  renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 }
    case 2:
      return { i: 1, j: 0 }
    case 3:
      return { i: 0, j: -1 }
    case 4:
      return { i: -1, j: 0 }
  }
}

function getGhostHTML(ghost) {
  return `<span>${GHOST}</span>`
}

function getRandomColor() {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
  return randomColor
}

function paintCell(location, color) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.style.color = color
}

function reviveGhosts() {
  for (var i = 0; i < gDeadGhosts.length; i++) {
    gGhosts.push(gDeadGhosts[i][0])
  }
  gDeadGhosts = []
}
