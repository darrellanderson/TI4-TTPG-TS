import { Card, SnapPoint, StaticObject } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

export class AvailableVotes {
  static _isRepresentativeGovernment(): boolean {
    const nsids: Array<string> = [
      "card.agenda:base/representative-government",
      "card.agenda:pok/representative-government",
    ];

    const find: Find = new Find();
    const cardUtil: CardUtil = new CardUtil();

    for (const nsid of nsids) {
      const playerSlot: number | undefined = undefined;
      const skipContained: boolean = true;
      const card: Card | undefined = find.findCard(
        nsid,
        playerSlot,
        skipContained
      );
      if (!card) {
        continue;
      }

      // Active agenda?
      const snappedTo: SnapPoint | undefined = card.getSnappedToPoint();
      if (snappedTo) {
        const snappedToGameObject: StaticObject | undefined =
          snappedTo.getParentObject();
        if (snappedToGameObject) {
          const nsid: string = NSID.get(snappedToGameObject);
          const snapPointIndex: number = snappedTo.getIndex();
          if (nsid === "mat:base/agenda-laws" && snapPointIndex === 0) {
            return false; // currently being voted on
          }
        }
      }

      // Face up, not in the discard pile.
      const allowFaceDown: boolean = false;
      const rejectSnapPointTags: Array<string> = ["discard-agenda"];
      if (cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)) {
        return true;
      }
    }

    return false;
  }
}
