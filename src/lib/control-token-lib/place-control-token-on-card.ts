import { Card, Container, GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

/**
 * Use a deterministic layout following player seating.
 */
export class PlaceControlTokenOnCard {
  private readonly _find: Find = new Find();

  _getControlToken(playerSlot: number): GameObject | undefined {
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      "container.token.control:base/generic",
      playerSlot,
      skipContained
    );
    if (container && container.getNumItems() > 0) {
      const item: GameObject | undefined = container.getItems()[0];
      if (item) {
        const pos: Vector = container.getPosition().add([10, 0, 10]);
        const showAnimation: boolean = true;
        const keep: boolean = true; // XXX keep causes wacky animation
        if (container.take(item, pos, showAnimation, keep)) {
          return item;
        }
      }
    }
    return undefined;
  }

  place(card: Card, playerSlot: number): void {
    const controlToken: GameObject | undefined =
      this._getControlToken(playerSlot);
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
    }
  }
}
