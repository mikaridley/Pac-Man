'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍔'
const CHERRY = '🍒'

const ROW_NUMBER = 9
const COL_NUMBERS = 9

const gGame = {
  score: 0,
  isOn: false,
}
var gBoard
var gCherryIntervalId

function onInit() {
  gBoard = buildBoard()
  createPacman(gBoard)
  createGhosts(gBoard)
  isThereFoodLeft()
  createCherry()
  console.table(gBoard)
  renderBoard(gBoard)
  gGame.isOn = true
  document.querySelector('.modal').hidden = true
}

function buildBoard() {
  const board = []

  for (var i = 0; i < ROW_NUMBER; i++) {
    board.push([])

    for (var j = 0; j < COL_NUMBERS; j++) {
      board[i][j] = FOOD

      if (
        i === 0 ||
        i === ROW_NUMBER - 1 ||
        j === 0 ||
        j === COL_NUMBERS - 1 ||
        (j === 3 && i > 4 && i < ROW_NUMBER - 2)
      ) {
        board[i][j] = WALL
      }

      if (
        (i === 1 && j === 1) ||
        (i === ROW_NUMBER - 2 && j === 1) ||
        (i === 1 && j === COL_NUMBERS - 2) ||
        (i === ROW_NUMBER - 2 && j === COL_NUMBERS - 2)
      ) {
        board[i][j] = SUPER_FOOD
      }
    }
  }
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < ROW_NUMBER; i++) {
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
  gGame.isOn = false
  renderCell(gPacman.location, EMPTY)
  changeTextModal('Game Over')
  document.querySelector('.modal').hidden = false
}

function changeTextModal(msg) {
  document.querySelector('.modal').innerHTML = msg
}

function isThereFoodLeft() {
  for (var i = 0; i < ROW_NUMBER; i++) {
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
  }, 5000)
}

function getRandomFreeSpace(board) {
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
