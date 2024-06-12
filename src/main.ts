import {
  WIDTH,
  HEIGHT,
  SPEED_FACTOR,
  BACK,
  POINT,
  assetsLoaded,
  LANE_1,
  LANE_3,
  CAR_CREATION_INTERVAL,
  FONT_SIZE,
  INIT_BACKGROUND_SPEED,
} from "./constant";
import { Car } from "./car";

const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let updatecar: Car[] = [];
let counter = 0;
let init = 0;
let backgroundSpeed = INIT_BACKGROUND_SPEED;
let animationFrameId: number | undefined;


// start game after spacebar is pressed
function showSplashScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.font = "bold 30px Verdana";
  ctx.fillStyle = "#00FFFF";
  ctx.fillText("CAR GAME", WIDTH / 2, HEIGHT / 3);

  ctx.font = "bold 20px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText("Press SPACE to Start", WIDTH / 2, HEIGHT / 2);
}

function startGame() {
  document.removeEventListener("keydown", spacebarListener);

  ctx.drawImage(BACK, 0, 0, WIDTH, HEIGHT);
  ctx.lineDashOffset = +backgroundSpeed;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.textAlign = "left";
  const player1 = new Car("player");
  updatecar.push(player1);

  let lastCarCreationTime = 0;
  let gameOverFlag = false;

  function creation() {
    const car = new Car();
    updatecar.push(car);
  }


// game engine
  function gameLoop(timestamp: number) {
    if (!lastCarCreationTime) lastCarCreationTime = timestamp;
    const elapsed = timestamp - lastCarCreationTime;

    if (elapsed > CAR_CREATION_INTERVAL) {
      creation();
      lastCarCreationTime = timestamp;
    }

    setter();
    if (!gameOverFlag) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  }

  function setter() {
    clearCanvas();

    updatecar.forEach((value, index) => {
      value.moveCar(counter);
      value.drawCar();
      if (index !== 0) {
        if (value.y >= HEIGHT) {
          updatecar.splice(index, 1);
          counter++;
          POINT.currentTime = 0;
          POINT.play().catch((error) => {
            console.error("Error playing point sound:", error);
          });
          if (counter % 10 === 0) {
            backgroundSpeed *= SPEED_FACTOR;
          }
        }
        value.carCollision(player1, gameOver);
      }
    });

    init += backgroundSpeed;
  }

  function initialiser() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.drawImage(BACK, 0, init, canvas.width, canvas.height);
    ctx.drawImage(BACK, 0, init - 500, canvas.width, canvas.height);
    ctx.textAlign = "left";
  }
// repaint the screem
  function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.drawImage(BACK, 0, init, canvas.width, canvas.height);
    ctx.drawImage(BACK, 0, init - 500, canvas.width, canvas.height);
    if (init >= 500) {
      init = 0;
    }

    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.fillText(`SCORE: ${counter}`, 10, 50);
  }

  function gameOver() {
    gameOverFlag = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    let highScore = parseInt(localStorage.getItem("highScores1") || "0");
    if (counter >= highScore) {
      localStorage.setItem("highScores1", counter.toString());
      highScore = counter;
    }
    drawGameOverScreen(highScore);
  }

  function drawGameOverScreen(highScore: number) {
    updatecar.splice(1);
    setTimeout(() => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "black";

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "40px Verdana";
      ctx.fillStyle = "#00FFFF";
      ctx.textAlign = "center";
      ctx.fillText("GAMEOVER", WIDTH / 2, 100);
      ctx.font = "30px Verdana";
      ctx.fillStyle = "white";
      ctx.fillText("Your Score", WIDTH / 2, 200);
      ctx.fillStyle = "#fca048";
      ctx.fillText(counter.toString(), WIDTH / 2, 275);
      ctx.font = "30px Verdana";
      ctx.fillStyle = "white";
      ctx.fillText("HighScore", WIDTH / 2, 350);
      ctx.fillStyle = "#fca048";
      ctx.fillText(highScore.toString(), WIDTH / 2, 425);
      ctx.font = "20px Verdana";
      ctx.fillStyle = "white";
      ctx.fillText("Press R to play again", WIDTH / 2, 460);

      counter = 0;
    }, 1000);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
      initialiser();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      counter = 0;
      backgroundSpeed = INIT_BACKGROUND_SPEED;
      updatecar = [player1];
      gameOverFlag = false;
      gameLoop(0);
    }
  });

  function keyPress() {
    document.addEventListener("keydown", (e) => {
      if ((e.key === "a" || e.key === "A") && player1.position != LANE_1) {
        player1.position--;
      }
      if ((e.key === "d" || e.key === "D") && player1.position != LANE_3) {
        player1.position++;
      }
    });
  }

  keyPress();
  gameLoop(0);
}

assetsLoaded.then(showSplashScreen);

document.addEventListener("keydown", spacebarListener);

function spacebarListener(e: KeyboardEvent) {
  if (e.code === "Space") {
    startGame();
  }
}
