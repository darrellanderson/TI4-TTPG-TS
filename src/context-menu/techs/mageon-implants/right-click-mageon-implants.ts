import {
  Card,
  CardHolder,
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  Find,
  NSID,
  PlayerSlot,
} from "ttpg-darrell";

export const MAGEON_IMPLANTS_NSID: string =
  "card.technology.green:base/mageon-implants";
export const MAGEON_IMPLANTS_ACTION: string =
  "*Tell Owning Player My Action Cards";

/**
 * Mageon Implants "card.technology.green:base/mageon-implants":
 * "ACTION: Exhaust this card to look at another player's hand of action cards.
 * Choose 1 of those cards and add it to your hand."
 */
export class RightClickMageonImplants extends AbstractRightClickCard {
  private readonly _find: Find = new Find();

  constructor() {
    const onCustomAction = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === MAGEON_IMPLANTS_ACTION) {
        const ownerPos: Vector = object.getPosition();
        const ownerSlot: PlayerSlot =
          this._find.closestOwnedCardHolderOwner(ownerPos);
        const clickingPlayerSlot: PlayerSlot = player.getSlot();
        const actionCardNames: string[] =
          this.getActionCardNames(clickingPlayerSlot);
        this.reportActionCardNames(
          clickingPlayerSlot,
          ownerSlot,
          actionCardNames
        );
      }
    };
    super(MAGEON_IMPLANTS_NSID, MAGEON_IMPLANTS_ACTION, onCustomAction);
  }

  getActionCardNames(playerSlot: PlayerSlot): string[] {
    const actionCardNames: string[] = [];

    const cardHolder: CardHolder | undefined =
      this._find.findCardHolderBySlot(playerSlot);
    if (cardHolder) {
      cardHolder.getCards().forEach((card: Card) => {
        const nsid: string = NSID.get(card);
        if (nsid.startsWith("card.action:")) {
          const cardDetails = card.getCardDetails();
          actionCardNames.push(cardDetails.name);
        }
      });
    }
    return actionCardNames;
  }

  reportActionCardNames(
    clickingPlayerSlot: PlayerSlot,
    reportToPlayerSlot: PlayerSlot,
    actionCardNames: string[]
  ): void {
    const clickingPlayerName: string =
      TI4.playerName.getBySlot(clickingPlayerSlot);
    const clickingColor: Color = world.getSlotColor(clickingPlayerSlot);
    const reportToPlayerName: string =
      TI4.playerName.getBySlot(reportToPlayerSlot);

    const globalMsg: string = `Mageon Implants: ${clickingPlayerName} told ${reportToPlayerName} their action cards`;
    Broadcast.broadcastAll(globalMsg, clickingColor);

    const reportToPlayer: Player | undefined =
      world.getPlayerBySlot(reportToPlayerSlot);
    const msg: string = `Mageon Implants: ${clickingPlayerName} reports action cards: ${actionCardNames.join(", ")}`;
    if (reportToPlayer) {
      Broadcast.chatOne(reportToPlayer, msg, clickingColor);
    }
  }
}
