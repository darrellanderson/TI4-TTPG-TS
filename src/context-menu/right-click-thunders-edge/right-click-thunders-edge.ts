import {
  Card,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { CardUtil, IGlobal, NSID } from "ttpg-darrell";

const ACTION_FETCH: string = "*Fetch Planet Cards";

export class RightClickThundersEdge implements IGlobal {
  private readonly _onObjectCreated = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_FETCH) {
      this._fetchPlanetCard(object, player);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenu(obj);
    }
  }

  _maybeAddContextMenu(obj: GameObject): void {
    const thundersEdgeNsid: string =
      "token.attachment.system:thunders-edge/thunders-edge";
    const nsid: string = NSID.get(obj);
    if (nsid === thundersEdgeNsid) {
      obj.removeCustomAction(ACTION_FETCH);
      obj.addCustomAction(ACTION_FETCH);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  _fetchPlanetCard(obj: GameObject, _player: Player): void {
    const cardUtil: CardUtil = new CardUtil();
    const pos = obj.getPosition().add([0, 0, 10]);

    const nsids: Array<string> = [
      "card.planet:thunders-edge/thunders-edge",
      "card.legendary-planet:thunders-edge/jupiter-brain",
    ];

    nsids.forEach((nsid) => {
      const card: Card | undefined = cardUtil.fetchCard(nsid);
      if (card) {
        card.setPosition(pos);
        card.snapToGround();
      }
    });
  }
}
