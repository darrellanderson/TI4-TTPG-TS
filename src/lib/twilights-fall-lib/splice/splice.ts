import { Card, GameObject, SnapPoint, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class Splice {
  splice(deck: Card, count: number): void {
    const find: Find = new Find();

    const matNsid: string = "mat.deck:twilights-fall/twilights-fall";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained = true;
    const mat: GameObject | undefined = find.findGameObject(
      matNsid,
      owningPlayerSlot,
      skipContained,
    );
    if (!mat) {
      throw new Error(`splice: cannot find mat with nsid ${matNsid}`);
    }

    const splicePositions: Array<Vector> = mat
      .getAllSnapPoints()
      .filter((snapPoint: SnapPoint): boolean => {
        return snapPoint.getTags().includes("splice-target");
      })
      .map((snapPoint: SnapPoint): Vector => snapPoint.getGlobalPosition());

    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      if (deck.getStackSize() === 1) {
        cards.push(deck);
        break;
      } else {
        const card: Card | undefined = deck.takeCards(1);
        if (card) {
          cards.push(card);
        }
      }
    }

    if (count > splicePositions.length) {
      throw new Error(
        `splice: not enough splice positions on mat for count ${count}`,
      );
    }

    cards.forEach((card: Card, index: number): void => {
      const pos: Vector | undefined = splicePositions[index];
      if (!pos) {
        throw new Error(
          `splice: cannot find splice position for index ${index}`,
        );
      }
      card.setPosition(pos.add([0, 0, 10]));
      card.setRotation([0, 0, 180]);
      card.snapToGround();
      card.snap();
    });
  }
}
