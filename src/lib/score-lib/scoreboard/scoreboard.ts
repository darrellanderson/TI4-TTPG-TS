import {
  Color,
  DrawingLine,
  GameObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Atop, Facing, Find, NSID } from "ttpg-darrell";

import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

const SCOREBOARD_LOCAL_WIDTH = 43;

export class Scoreboard {
  private readonly _find: Find = new Find();

  applyGamePoints(gamePoints: number): this {
    const faceUp: boolean = gamePoints <= 10;
    const srcScore: number = gamePoints;
    const dstScore: number = faceUp ? 10 : 14;
    const src: Vector | undefined = this._getLocalCenter(srcScore + 0.6);
    const dst: Vector | undefined = this._getLocalCenter(dstScore + 0.4);
    const scoreboard: GameObject | undefined = this.getScoreboard();

    if (scoreboard && src && dst && srcScore < dstScore) {
      // Remove any existing line.
      for (const line of scoreboard.getDrawingLines()) {
        scoreboard.removeDrawingLineObject(line);
      }

      // Draw a line.
      const z: number = faceUp ? 0.2 : -0.2;
      src.z = z;
      dst.z = z;
      const normal: Vector = new Vector(0, 0, faceUp ? 1 : -1);

      const line: DrawingLine = new DrawingLine();
      line.color = new Color(0, 0, 0, 1);
      line.normals = [normal];
      line.points = [src, dst];
      line.rounded = false;
      line.thickness = 4;
      scoreboard.addDrawingLine(line);
    }

    return this;
  }

  _getLocalCenter(score: number): Vector | undefined {
    const scoreboard: GameObject | undefined = this.getScoreboard();
    if (!scoreboard) {
      return undefined;
    }

    let dir: number = -1;
    let slotCount: number = 15;
    if (Facing.isFaceUp(scoreboard)) {
      dir = 1;
      slotCount = 11;
    }

    // Tweak values very slighly for more precise centers, accounting
    // for one side of the scoreboard extending slightly.
    const slotWidth: number = (SCOREBOARD_LOCAL_WIDTH - 0.5) / slotCount;
    let mid: number = (slotCount - 1) / 2;
    mid -= 0.03;

    const dLeft: number = (score - mid) * slotWidth * dir;
    return new Vector(0.2, dLeft, 0);
  }

  /**
   * Get all control tokens on the scoreboard (normally just one).
   *
   * @returns
   */
  _getPlayerSlotToAtopControlTokens(): Map<number, Array<GameObject>> {
    const playerSlotToControlTokens: Map<number, Array<GameObject>> = new Map();

    const scoreboard: GameObject | undefined = this.getScoreboard();
    if (scoreboard) {
      const atop: Atop = new Atop(scoreboard);
      const skipContained: boolean = true;
      for (const obj of world.getAllObjects(skipContained)) {
        const nsid: string = NSID.get(obj);
        const pos: Vector = obj.getPosition();
        if (nsid.startsWith("token.control:") && atop.isAtop(pos)) {
          const playerSlot: number = obj.getOwningPlayerSlot();
          let controlTokens: Array<GameObject> | undefined =
            playerSlotToControlTokens.get(playerSlot);
          if (!controlTokens) {
            controlTokens = [];
            playerSlotToControlTokens.set(playerSlot, controlTokens);
          }
          controlTokens.push(obj);
        }
      }
    }

    return playerSlotToControlTokens;
  }

  /**
   * Get player slot to leading control token on the scoreboard (highest score).
   *
   * @returns
   */
  getPlayerSlotToLeadControlToken(): Map<number, GameObject> {
    const playerSlotToToken: Map<number, GameObject> = new Map();

    const playerSlotToControlTokens: Map<
      number,
      Array<GameObject>
    > = this._getPlayerSlotToAtopControlTokens();
    for (const [
      playerSlot,
      controlTokens,
    ] of playerSlotToControlTokens.entries()) {
      for (const controlToken of controlTokens) {
        const existingToken: GameObject | undefined =
          playerSlotToToken.get(playerSlot);

        let useNewToken: boolean = true;
        if (existingToken) {
          const existingPos: Vector = existingToken.getPosition();
          const existingScore: number | undefined =
            this.posToScore(existingPos);

          const newPos: Vector = controlToken.getPosition();
          const newScore: number | undefined = this.posToScore(newPos);

          if (
            existingScore !== undefined &&
            newScore !== undefined &&
            newScore < existingScore
          ) {
            useNewToken = false;
          }
        }

        if (useNewToken) {
          playerSlotToToken.set(playerSlot, controlToken);
        }
      }
    }
    return playerSlotToToken;
  }

  getLeadControlToken(playerSlot: number): GameObject | undefined {
    const playerSlotToToken: Map<number, GameObject> =
      this.getPlayerSlotToLeadControlToken();
    return playerSlotToToken.get(playerSlot);
  }

  getPlayerSlotToScore(): Map<number, number> {
    const playerSlotToScore: Map<number, number> = new Map();
    const playerSlotToToken: Map<number, GameObject> =
      this.getPlayerSlotToLeadControlToken();
    for (const [playerSlot, controlToken] of playerSlotToToken.entries()) {
      const pos: Vector = controlToken.getPosition();
      const score: number | undefined = this.posToScore(pos);
      if (score !== undefined) {
        playerSlotToScore.set(playerSlot, score);
      }
    }
    return playerSlotToScore;
  }

  getControlTokenRotation(): Rotator | undefined {
    const scoreboard: GameObject | undefined = this.getScoreboard();
    if (!scoreboard) {
      return undefined;
    }

    return new Rotator(0, 0, 0).compose(scoreboard.getRotation());
  }

  getScoreboard(): GameObject | undefined {
    const playerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    return this._find.findGameObject(
      "token:base/scoreboard",
      playerSlot,
      skipContained
    );
  }

  posToScore(pos: Vector): number | undefined {
    const scoreboard: GameObject | undefined = this.getScoreboard();
    if (!scoreboard) {
      return undefined;
    }

    let dir: number = -1;
    let slotCount: number = 15;
    if (Facing.isFaceUp(scoreboard)) {
      dir = 1;
      slotCount = 11;
    }

    const slotWidth: number = SCOREBOARD_LOCAL_WIDTH / slotCount;
    const localPos: Vector = scoreboard.worldPositionToLocal(pos);
    const leftOffset: number = localPos.y * dir + SCOREBOARD_LOCAL_WIDTH / 2;
    let score: number = Math.floor(leftOffset / slotWidth);
    score = Math.max(score, 0);
    score = Math.min(score, slotCount - 1); // clamp
    return score;
  }

  scoreToPos(score: number, playerSlot: number): Vector | undefined {
    const scoreboard: GameObject | undefined = this.getScoreboard();
    const localCenter: Vector | undefined = this._getLocalCenter(score);
    if (!scoreboard || !localCenter) {
      return undefined;
    }

    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const playerIndex: number = playerSeats.findIndex((playerSeat) => {
      return playerSeat.playerSlot === playerSlot;
    });
    if (playerIndex === -1) {
      // Unknown player, use the center position.
      return scoreboard.localPositionToWorld(localCenter);
    }

    const playerCount = playerSeats.length;
    const numRows = Math.ceil(playerCount / 2);
    let col: number = 0;
    let row: number = numRows - 1 - playerIndex;
    if (row < 0) {
      row = numRows - 1 - (numRows + row); // swap order
      col = 1;
    }

    // Fix for face down.
    if (!Facing.isFaceUp(scoreboard)) {
      col = 1 - col;
    }

    // Make relative to center of score slot.
    row -= (numRows - 1) / 2;
    col -= 0.5;

    const y: number = localCenter.y - col * 1.5;
    const x: number = localCenter.x - row * 2.3;
    const localPos: Vector = new Vector(x, y, 0);

    return scoreboard.localPositionToWorld(localPos);
  }
}
