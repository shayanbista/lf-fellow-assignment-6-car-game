import {
  WIDTH,
  HEIGHT,
  SPEED_FACTOR,
  CAR1,
  CAR2,
  HIT,
  LANE_2,
  INIT_CAR_START_OFFSET,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  INIT_CAR_SPEED,
} from "./constant";

import { randomInt } from "./utils";
import { ctx } from "./main";

export class Car {
  isplayer: string | boolean;
  height: number;
  width: number;
  y: number;
  speed: number;
  position: number;
  health: number | undefined;
  lanewidth: number | undefined;

  constructor(player?: string) {
    this.isplayer = player || false;
    this.height = PLAYER_HEIGHT;
    this.width = PLAYER_WIDTH;
    this.y =
      this.isplayer === "player" ? HEIGHT - this.height : INIT_CAR_START_OFFSET;
    this.speed = INIT_CAR_SPEED;
    this.position = this.isplayer === "player" ? LANE_2 : randomInt(1, 4);
    this.drawCar();
  }

  drawCar() {
    this.lanewidth = WIDTH / 3;
    if (this.isplayer === "player") {
      ctx.drawImage(
        CAR1,
        this.position * this.lanewidth - (this.lanewidth + this.width) / 2,
        this.y
      );
    } else {
      ctx.drawImage(
        CAR2,
        this.position * this.lanewidth - (this.lanewidth + this.width) / 2,
        this.y
      );
    }
  }

  moveCar(counter: number) {
    if (!this.isplayer) {
      this.y += this.speed * (Math.floor(counter / 10) * SPEED_FACTOR + 1);
    }
  }

  carCollision(playered: Car, gameOverCallBack: () => void) {
    if (
      this.position === playered.position &&
      this.height + this.y >= HEIGHT - this.height
    ) {
      HIT.play();
      gameOverCallBack();
    }
  }
}
