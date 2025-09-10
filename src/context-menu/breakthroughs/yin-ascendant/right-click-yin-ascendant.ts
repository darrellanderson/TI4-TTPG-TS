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

  _getUnusedAllianceCard(): Card | undefined {
    const inUseNsids: Set<string> = new Set(this._getInUseAllianceCardNsids());

    let deck: Card | undefined =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.alliance:");

    const cardUtil: CardUtil = new CardUtil();
    deck = cardUtil.filterCards(deck, (nsid: string): boolean => {
      return !inUseNsids.has(nsid);
    });

    if (deck) {
      if (deck.getStackSize() === 1) {
        return deck;
      }
      deck.shuffle();
      const card: Card | undefined = deck.takeCards(1);
      DeletedItemsContainer.destroyWithoutCopying(deck);
      return card;
    }
  }

  _yinAscendant(object: GameObject, player: Player): void {
    const card: Card | undefined = this._getUnusedAllianceCard();
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
