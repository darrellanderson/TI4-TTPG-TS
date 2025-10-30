import { Card, GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

export class Splice {
  splice(deck: Card, count: number): void {
    const find: Find = new Find();

    const matNsid: string = "mat.deck:twilights-fall/twilights-fall";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained = true;
    const mat: GameObject | undefined = find.findGameObject(
      matNsid,
      owningPlayerSlot,
      skipContained
    );

    if (mat) {
      const matExtent: Vector = mat.getExtent(false, false);
      const deckExtent: Vector = deck.getExtent(false, false);

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

      count = cards.length; // potentially less than count

      const center: Vector = mat.getPosition();
      center.x -= matExtent.x + deckExtent.x + 2;

      const cardWidth: number = deckExtent.y * 2;
      const maxWidth: number = cardWidth * 6;
      const width: number = Math.min(count * cardWidth, maxWidth);
      const left: number = center.y - width / 2 + deckExtent.y;
      const dY: number = width / Math.max(count, 1);
      const z: number = world.getTableHeight() + 10;

      cards.forEach((card: Card, index: number): void => {
        const pos: Vector = new Vector(center.x, left + index * dY, z);
        card.setPosition(pos);
        card.setRotation([0, 0, 180]);
        card.snapToGround();

        let tokenNsid: string | undefined = undefined;
        const nsid: string = NSID.get(card);
        if (nsid === "card.tf-ability:twilights-fall/telepathic") {
          tokenNsid = "token:base/naalu-zero";
        } else if (nsid === "card.tf-paradigm:twilights-fall/awakening") {
          tokenNsid = "token.attachment.planet:pok/geoform";
        }

        if (tokenNsid !== undefined) {
          const tokenPos: Vector = card.getPosition().add([0, 0, 10]);
          const token: GameObject | undefined = TI4.spawn.spawn(
            tokenNsid,
            tokenPos
          );
          if (token) {
            token.snapToGround();
          }
        }
      });
    }
  }
}
