'use strict'

const WALL = '<img src="img/wall.png" alt="wall" />'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍔'
const CHERRY = '🍒'

const ROW_NUMBERS = 10
const COL_NUMBERS = 20

const gGame = {
  score: 0,
  isOn: false,
}
var gBoard
var gCherryIntervalId

function onInit() {
  gBoard = buildBoard()
  buildInsideWalls()
  createPacman(gBoard)
  createGhosts(gBoard)
  createCherry()
  console.table(gBoard)
  renderBoard(gBoard)
  gGame.isOn = true
  document.querySelector('.modal').hidden = true
}

function buildBoard() {
  const board = []

  for (var i = 0; i < ROW_NUMBERS; i++) {
    board.push([])

    for (var j = 0; j < COL_NUMBERS; j++) {
      board[i][j] = FOOD

      if (
        i === 0 ||
        i === ROW_NUMBERS - 1 ||
        j === 0 ||
        j === COL_NUMBERS - 1
      ) {
        board[i][j] = WALL
      }

      if (
        (i === 1 && j === 1) ||
        (i === ROW_NUMBERS - 2 && j === 1) ||
        (i === 1 && j === COL_NUMBERS - 2) ||
        (i === ROW_NUMBERS - 2 && j === COL_NUMBERS - 2)
      ) {
        board[i][j] = SUPER_FOOD
      }
    }
  }
  return board
}

function buildInsideWalls() {
  gBoard[3][4] = WALL
  gBoard[3][5] = WALL
  gBoard[4][4] = WALL
  gBoard[4][5] = WALL

  gBoard[6][14] = WALL
  gBoard[6][15] = WALL

  gBoard[2][12] = WALL
  gBoard[3][12] = WALL

  gBoard[4][8] = WALL
  gBoard[4][9] = WALL
  gBoard[5][9] = WALL
  gBoard[6][9] = WALL
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < ROW_NUMBERS; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < COL_NUMBERS; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">
                            ${cell}
                        </td>`
    }
    strHTML += '</tr>'
  }
  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function updateScore(diff) {
  // update both the model and the dom for the score
  gGame.score += diff
  document.querySelector('h2 span').innerText = gGame.score
}

function gameOver() {
  // todo
  console.log('Game Over')
  clearInterval(gIntervalGhosts)
  clearInterval(gCherryIntervalId)
  gGame.isOn = false
  renderCell(gPacman.location, EMPTY)
  changeTextModal('Game Over')
  document.querySelector('.modal').hidden = false
}

function changeTextModal(msg) {
  document.querySelector('.modal').innerHTML = msg
}

function isThereFoodLeft() {
  for (var i = 0; i < ROW_NUMBERS; i++) {
    for (var j = 0; j < COL_NUMBERS; j++) {
      if (gBoard[i][j] === FOOD) return true
    }
  }
  return false
}

function createCherry() {
  gCherryIntervalId = setInterval(() => {
    var freeSpace = getRandomFreeSpace(gBoard)
    if (!freeSpace) return
    gBoard[freeSpace.i][freeSpace.j] = CHERRY
    renderCell(freeSpace, CHERRY)
  }, 15000)
}

function getRandomFreeSpace(board = gBoard) {
  var freeSpaces = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j] === EMPTY) freeSpaces.push({ i, j })
    }
  }
  var randomIndex = getRandomIntInclusive(0, freeSpaces.length)
  if (freeSpaces.length === 0) return null
  return freeSpaces[randomIndex]
}
