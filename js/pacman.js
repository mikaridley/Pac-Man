'use strict'

const PACMAN = '<img src="../img/pac-man.png" alt="pac-man" />'
var gPacman

function createPacman(board) {
  // initialize gPacman...
  gPacman = {
    location: {
      i: ROW_NUMBERS - 5,
      j: COL_NUMBERS - 3,
    },
    isSuper: false,
    rotation: 'scaleX(-1)',
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
  if (nextCell === GHOSTS && gPacman.isSuper) {
    var sound = new Audio('../sound/pacman_eatghost.wav')
    sound.play()
    var ghostIndex = findGhostTheHasBeenEaten(nextLocation)
    gDeadGhosts.push(gGhosts.splice(ghostIndex, 1))
  } else if (nextCell === GHOSTS) {
    var sound = new Audio('../sound/pacman_death.wav')
    sound.play()
    gameOver()
    return
  }

  if (nextCell === FOOD) {
    var sound = new Audio('../sound/pacman_chomp.wav')
    sound.play()
    // hitting food? update score
    gBoard[nextLocation.i][nextLocation.j] = EMPTY
    updateScore(1)
    checkVictory()
  }

  if (nextCell === CHERRY) {
    var sound = new Audio('../sound/pacman_eatfruit.wav')
    sound.play()
    // hitting cherry? update score
    gBoard[nextLocation.i][nextLocation.j] = EMPTY
    updateScore(10)
  }

  //hitting superfood
  if (nextCell === SUPER_FOOD) {
    var sound = new Audio('../sound/pacman_eatfruit.wav')
    sound.play()
    for (var i = 0; i < gGhosts.length; i++) {
      var cuttGhost = gGhosts[i]
      renderCell(cuttGhost.location, getGhostHTML(SICK_GHOST))
    }
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
  var img = document.querySelector("[alt='pac-man']")
  img.style.transform = gPacman.rotation
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
      gPacman.rotation = 'rotate(90deg)'
      nextLocation.i--
      break
    case 'ArrowDown':
      gPacman.rotation = 'rotate(-90deg)'
      nextLocation.i++
      break
    case 'ArrowRight':
      gPacman.rotation = 'scaleX(-1)'
      nextLocation.j++
      break
    case 'ArrowLeft':
      gPacman.rotation = 'scaleX(1)'
      nextLocation.j--
      break
    default:
      return null
  }

  return nextLocation
}

function checkVictory() {
  if (isThereFoodLeft()) return
  var sound = new Audio('../sound/win.mp3')
  sound.play()
  clearInterval(gIntervalGhosts)
  clearInterval(gCherryIntervalId)
  changeTextModal('You Win!')
  document.querySelector('.modal').hidden = false
  gGame.isOn = false
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
