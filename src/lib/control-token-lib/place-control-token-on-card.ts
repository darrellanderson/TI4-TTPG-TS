import { Card, GameObject, Vector } from "@tabletop-playground/api";
import { SpawnControlToken } from "./spawn-control-token";

/**
 * Use a deterministic layout following player seating.
 */
export class PlaceControlTokenOnCard {
  _spawnControlToken: SpawnControlToken = new SpawnControlToken();

  place(card: Card, playerSlot: number): boolean {
    const controlToken: GameObject | undefined =
      this._spawnControlToken.spawnControlToken(playerSlot);
    if (controlToken) {
      // Random scatter for now to test.
      const controlTokenExtent: Vector = controlToken.getExtent(false, false);
      const cardExtent: Vector = card.getExtent(false, false);
      const controlD: number = Math.max(
        controlTokenExtent.x,
        controlTokenExtent.y
      );
      const cardD: number = Math.max(cardExtent.x, cardExtent.y);
      const d: number = cardD - controlD;
      const dst: Vector = card
        .getPosition()
        .add([0, 0, 10])
        .add([Math.random() * d, Math.random() * d, 0]);
      controlToken.setPosition(dst);
      controlToken.snapToGround();
      return true;
    }
    return false;
  }
}
