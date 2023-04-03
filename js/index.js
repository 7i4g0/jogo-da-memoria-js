/* 
 * Variables
 */
let gameover = false;
let cards = [];
let firstCard = 0;
let secondCard = 0;
let matches = 0;
let maxScore = window.localStorage.getItem('gm_max_score');

const gameStatus = {
  level: 4,
  time: 0,
  score: 0,
  paused: false,
  music: false
}

const gameLevel = {
  4: 'Fácil',
  6: 'Normal',
  8: 'Difícil',
  16: 'Eita!'
}
const gameBoard = document.querySelector('#cards');

const statusLevel = document.querySelector('#level');
const statusTime = document.querySelector('#time');
const statusScore = document.querySelector('#pontuation');
const newRecord = document.querySelector('#newRecord');

const btnMute = document.querySelector('#btn_mute');
const btnPause = document.querySelector('#btn_pause');
const btnHome = document.querySelector('#btn_home');
const btnExit = document.querySelector('#btn_exit');

var timer = new Timer(function () {
  gameStatus.time++;
}, 1000);

btnMute.addEventListener('click', toggleMusic)

btnPause.addEventListener('click', (e) => {
  if (gameStatus.paused) {
    const pauseOverlay = document.querySelector('#pause_overlay');
    pauseOverlay?.remove();
    resumeGame();
  } else {
    mainMusic.pause();
    btnPause.setAttribute('src', './images/btn-play.png');
    timer.pause()
    const pauseOverlay = document.createElement('div');
    pauseOverlay.classList.add('pause-overlay');
    pauseOverlay.setAttribute('id', 'pause_overlay');
    gameBoard.appendChild(pauseOverlay);
  }
  gameStatus.paused = !gameStatus.paused;
});

btnExit.addEventListener('click', () => showScreen('menu'));
btnHome.addEventListener('click', () => showScreen('menu'));

/* 
 * Methods
 */

function resetGame() {
  gameover = false;
  cards = [];
  matches = 0;
  gameStatus.time = 0;
  gameStatus.score = 0;
  newRecord.classList.remove('show');
}

function initialSetup() {
  showScreen('menu')
  const btnStart = document.querySelector('#btn_start')
  btnStart.addEventListener('click', startGame)
}

function showScreen(screen) {
  const views = document.querySelectorAll('.view')
  
  views.forEach(view => {
    if (view.id === screen) {
      view.classList.add('show')
    } else {
      view.classList.remove('show')
    }
  })
}

function startGame() {
  resetGame();

  gameStatus.level = document.querySelector('input[name="level_select"]:checked').value;
  document.querySelector('#level').innerHTML = gameLevel[`${gameStatus.level}`]

  showScreen('board');
  for (let index = 1; index <= gameStatus.level; index++) {
    cards.push(index)
    cards.push(index)
  }

  shuffle(cards)
  console.log('cards', cards)

  createGameBoard();

  resumeGame();
}

function resumeGame() {
  btnPause.setAttribute('src', './images/btn-pause.png');
  mainMusic.play();
  timer.resume();
}

function toggleMusic() {
  if(gameStatus.music) {
    gameStatus.music = false;
    btnMute.classList.add('filter');
    mainMusic.pause();
  } else {
    gameStatus.music = true;
    btnMute.classList.remove('filter');
    mainMusic.play();

  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function convertToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function calcPontuation() {
  const score = Math.floor((matches * gameStatus.level / gameStatus.time) * 100);
  if (score)
    gameStatus.score += score;
  
}

function createGameBoard() {
  clearGameBoard();

  cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.setAttribute('data-value', card);
      
      const cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');
      
      const cardInnerFront = document.createElement('div');
      cardInnerFront.classList.add('card-front');
      
      const cardInnerBack = document.createElement('div');
      cardInnerBack.classList.add('card-back');
      
      const cardImage = document.createElement('img');
      cardImage.setAttribute('src', `./images/${card}.jpg`);
      
      cardInnerBack.appendChild(cardImage);
      cardInner.appendChild(cardInnerFront);
      cardInner.appendChild(cardInnerBack);
      cardElement.appendChild(cardInner);
      
      cardElement.addEventListener("click", handleCardClick);
      gameBoard.appendChild(cardElement);
  })
}

function handleCardClick(event) {
  const cardClicked = event.target.parentElement.parentElement;
  if (cardClicked.classList.contains('card') && !cardClicked.classList.contains('active')) {
    cardClicked.classList.add('active');
    flipAudio.play();
    
    if (firstCard === 0) {
      firstCard = cardClicked;
    } else if (secondCard === 0) {
      secondCard = cardClicked;

      const activedCards = document.querySelectorAll('.active');

      if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
        matches++;
        calcPontuation();
        firstCard.classList.add('done');
        secondCard.classList.add('done');
        
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
        
      } else {
        setTimeout(() => {
          activedCards.forEach(item => {
            if (!item.classList.contains('done')) {
              item.classList.remove('active');
            }
          });
        }, 1000);
      }

      firstCard = 0;
      secondCard = 0;
    }
  }
}

function gameOver() {
  gameover = true;
  timer.pause();
  if (gameStatus.score > maxScore) {
    newRecord.classList.add('show');
    window.localStorage.setItem('gm_max_score', gameStatus.score)
  }
  showScreen('gameover');
  const gameOverScoreCurrent = document.querySelector('#scoreCurrent');
  const gameOverScoreMax = document.querySelector('#scoreMax');

  gameOverScoreCurrent.innerHTML = gameStatus.score;
  gameOverScoreMax.innerHTML = maxScore;

  const btnRestart = document.querySelector('#btn_restart');
  btnRestart.addEventListener('click', startGame);
}

function clearGameBoard() {
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild)
  }
  return true;
}

initialSetup()

/**
 * Audio
 */
const flipAudio = document.createElement("audio");
flipAudio.src = '../audios/flipcard.mp3';

const mainMusic = document.createElement("audio");
mainMusic.src = '../audios/IcelandicArpeggios-DivKid.mp3';


/* 
 * Gameloop
 */
;(function () {
  function main() {
    window.requestAnimationFrame( main );
      
    // calcPontuation()

    // Your main loop contents.
    statusScore.innerHTML = gameStatus.score
    statusTime.innerHTML = convertToTime(gameStatus.time);

    if (matches === gameStatus.level) {
      gameOver();
    }
  }

  main(); // Start the cycle
})();