'use strict'

const PACMAN = '😀'
var gPacman

function createPacman(board) {
  // initialize gPacman...
  gPacman = {
    location: {
      i: 7,
      j: 7,
    },
    isSuper: false,
  }

  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
  if (!gGame.isOn) return
  // use getNextLocation(), nextCell

  var nextLocation = getNextLocation(ev)

  if (!nextLocation) return

  var nextCell = gBoard[nextLocation.i][nextLocation.j]

  // return if cannot moveK
  if (nextCell === WALL) return
  if (nextCell === SUPER_FOOD && gPacman.isSuper) return

  // hitting a ghost? call gameOver
  if (nextCell === GHOST && gPacman.isSuper) {
    var ghostIndex = findGhostTheHasBeenEaten(nextLocation)
    gDeadGhosts.push(gGhosts.splice(ghostIndex, 1))
  } else if (nextCell === GHOST) {
    gameOver()
    return
  }

  if (nextCell === FOOD) {
    // hitting food? update score
    gBoard[nextLocation.i][nextLocation.j] = EMPTY
    updateScore(1)
    checkVictory()
  }

  if (nextCell === CHERRY) {
    // hitting cherry? update score
    gBoard[nextLocation.i][nextLocation.j] = EMPTY
    updateScore(10)
  }

  //hitting superfood
  if (nextCell === SUPER_FOOD) {
    gPacman.isSuper = true
    setTimeout(() => {
      gPacman.isSuper = false
      reviveGhosts()
    }, 5000)
  }

  // moving from current location:
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

  // update the DOM
  renderCell(gPacman.location, EMPTY)

  // Move the pacman to new location:
  // update the model
  gBoard[nextLocation.i][nextLocation.j] = PACMAN
  gPacman.location = nextLocation

  // update the DOM
  renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
  // console.log('eventKeyboard:', eventKeyboard)

  // figure out nextLocation
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  }

  switch (eventKeyboard.code) {
    case 'ArrowUp':
      nextLocation.i--
      break
    case 'ArrowDown':
      nextLocation.i++
      break
    case 'ArrowRight':
      nextLocation.j++
      break
    case 'ArrowLeft':
      nextLocation.j--
      break
    default:
      return null
  }

  return nextLocation
}

function checkVictory() {
  if (isThereFoodLeft()) return
  changeTextModal('You Win!')
  document.querySelector('.modal').hidden = false
}

function findGhostTheHasBeenEaten(nextLocation) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (
      nextLocation.i === gGhosts[i].location.i &&
      nextLocation.j === gGhosts[i].location.j
    )
      return i
  }
}
