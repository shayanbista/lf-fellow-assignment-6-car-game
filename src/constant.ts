export const WIDTH = 300;
export const HEIGHT = 500;
export const SPEED_FACTOR = 1.1;

export const BACK = new Image();
BACK.src = "assets/images/road.png";

export const CAR1 = new Image();
CAR1.src = "./assets/images/car2.gif";

export const CAR2 = new Image();
CAR2.src = "./assets/images/car1.gif";

export const POINT = new Audio("assets/sound/point.wav");
export const HIT = new Audio("assets/sound/die.wav");

export const assetsLoaded = new Promise<void>((resolve) => {
  const assetsToLoad = [BACK, CAR1, CAR2, POINT, HIT];
  let loadedAssets = 0;

  assetsToLoad.forEach((asset) => {
    asset.addEventListener("canplaythrough", () => {
      loadedAssets++;
      if (loadedAssets === assetsToLoad.length) {
        resolve();
      }
    });
    asset.addEventListener("load", () => {
      loadedAssets++;
      if (loadedAssets === assetsToLoad.length) {
        resolve();
      }
    });
  });
});

export const PLAYER_HEIGHT = 60;
export const PLAYER_WIDTH = 60;
export const GAME_OVER_DELAY = 1000;

export const LANE_1 = 1;
export const LANE_2 = 2;
export const LANE_3 = 3;
export const CAR_CREATION_INTERVAL = 2000;
export const FONT_SIZE = 25;
export const INIT_BACKGROUND_SPEED = 3;
export const INIT_CAR_START_OFFSET = -80;
export const INIT_CAR_SPEED = 4;
