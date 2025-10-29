import {
  Card,
  CardHolder,
  Container,
  GameObject,
  world,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, NSID } from "ttpg-darrell";

export class TFSetupPrune {
  setup(): void {
    const deleteList: Array<GameObject> = [];
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      if (this._shouldPrune(obj)) {
        deleteList.push(obj);
      }
    }

    for (const obj of deleteList) {
      if (obj instanceof Card) {
        const holder: CardHolder | undefined = obj.getHolder();
        if (holder) {
          holder.removeAt(holder.getCards().indexOf(obj));
        }
      }

      const container: Container | undefined = obj.getContainer();
      if (container) {
        container.remove(obj);
      }

      DeletedItemsContainer.destroyWithoutCopying(obj);
    }

    this._removeSpecificCards();
  }

  _shouldPrune(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);

    if (
      nsid.startsWith("card.promissory") ||
      nsid === "token.attachment.system:thunders-edge/thunders-edge"
    ) {
      return true;
    }

    return false;
  }

  _removeSpecificCards(): void {
    const nsids: Array<string> = [
      "card.relic:pok/maw-of-worlds",
      "card.relic:pok/the-prophets-tears",
      "card.relic:thunders-edge/the-quantumcore",
      "card.objective.secret:pok/betray-a-friend",
      "card.objective.secret:pok/dictate-policy",
      "card.objective.secret:pok/drive-the-debate",
      "card.objective.secret:pok/strengthen-bonds",
    ];

    const cardUtil: CardUtil = new CardUtil();
    for (const nsid of nsids) {
      const card: Card | undefined = cardUtil.fetchCard(nsid);
      if (card) {
        DeletedItemsContainer.destroyWithoutCopying(card);
      }
    }
  }
}
