import {
  Card,
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
  NSID,
  Spawn,
} from "ttpg-darrell";

export const ACTION_YIN_ASCENDANT: string = "*Draw unused alliance";

/**
 * "When you gain this card or score a public objective,
 * gain the alliance ability of a random, unused faction"
 */
export class RightClickYinAscendant extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_YIN_ASCENDANT) {
        this._yinAscendant(object, player);
      }
    };
    super(
      "card.breakthrough:thunders-edge/yin-ascendant",
      ACTION_YIN_ASCENDANT,
      customActionHandler
    );
  }

  _yinAscendant(object: GameObject, player: Player): void {
    const inUseNsids: Set<string> = new Set(this._getInUseAllianceCardNsids());

    const deck: Card =
      Spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.alliance:");
    const availableNsids: Array<string> = NSID.getDeck(deck).filter(
      (nsid: string) => {
        return !inUseNsids.has(nsid);
      }
    );
    const index: number = Math.floor(Math.random() * availableNsids.length);
    const choiceNsid: string | undefined = availableNsids[index];
    if (choiceNsid) {
      const cardUtil: CardUtil = new CardUtil();
      const card: Card | undefined = cardUtil.filterCards(
        deck,
        (nsid: string): boolean => {
          return nsid === choiceNsid;
        }
      );

      if (card) {
        const above: Vector = object.getPosition().add([0, 0, 10]);
        card.setPosition(above);
        card.snapToGround();

        const playerName: string = TI4.playerName.getByPlayer(player);
        const allianeName: string = card.getCardDetails().name;
        const msg: string = `${playerName} has gained the alliance ability ${allianeName}`;
        const color: Color = world.getSlotColor(player.getSlot());
        Broadcast.chatAll(msg, color);
      }
    }

    DeletedItemsContainer.destroyWithoutCopying(deck);
  }

  _getInUseAllianceCardNsids(): Array<string> {
    const nsids: Array<string> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("card.alliance:")) {
        nsids.push(nsid);
      }
    }
    return nsids;
  }
}
