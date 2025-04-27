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
  Broadcast,
  Find,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
  PlayerSlot,
} from "ttpg-darrell";

export const MAGEON_IMPLANTS_NSID: string =
  "card.technology.green:base/mageon-implants";
export const MAGEON_IMPLANTS_ACTION_PREFIX: string = "*Mageon Implants ";

/**
 * Mageon Implants "card.technology.green:base/mageon-implants":
 * "ACTION: Exhaust this card to look at another player's hand of action cards.
 * Choose 1 of those cards and add it to your hand."
 */
export class RightClickMageonImplants implements IGlobal {
  private readonly _mageonImplantsObjectIds: Array<string> = [];
  private readonly _actionNameToPlayerSlot: Map<string, PlayerSlot> = new Map();
  private readonly _find: Find = new Find();

  private readonly _onPlayerChangedColor = (): void => {
    this._updateContextMenus();
  };

  private readonly _onSingletonCardCreated = (
    card: Card,
    _player?: Player
  ): void => {
    const nsid: string = NSID.get(card);
    if (nsid === MAGEON_IMPLANTS_NSID) {
      card.onCustomAction.remove(this._onCustomAction);
      card.onCustomAction.add(this._onCustomAction);

      // Custom action names can change if players change colors,
      // add them via a helper that resets on color change.
      this._mageonImplantsObjectIds.push(card.getId());
      this._updateContextMenus();
    }
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    const targetPlayerSlot: PlayerSlot | undefined =
      this._actionNameToPlayerSlot.get(identifier);
    const reportToPlayer: Player = player;
    if (targetPlayerSlot) {
      const actionCardNames: string[] =
        this.getActionCardNames(targetPlayerSlot);
      this.reportActionCardNames(
        object,
        reportToPlayer,
        targetPlayerSlot,
        actionCardNames
      );
    }
  };

  constructor() {}

  init(): void {
    TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColor);
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onSingletonCardCreated
    );
  }

  _updateContextMenus(): void {
    // Remove old context menus.
    for (const objectId of this._mageonImplantsObjectIds) {
      const object: GameObject | undefined = world.getObjectById(objectId);
      if (object) {
        for (const actionName of this._actionNameToPlayerSlot.keys()) {
          object.removeCustomAction(actionName);
        }
      }
    }

    // Reset context menu action names.
    this._actionNameToPlayerSlot.clear();
    for (
      let seatIndex: number = 0;
      seatIndex < TI4.config.playerCount;
      seatIndex++
    ) {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      const colorName: string | undefined =
        TI4.playerColor.getSlotColorName(playerSlot);
      const actionName: string = MAGEON_IMPLANTS_ACTION_PREFIX + colorName;
      this._actionNameToPlayerSlot.set(actionName, playerSlot);
    }

    // Reapply context menus.
    for (const objectId of this._mageonImplantsObjectIds) {
      const object: GameObject | undefined = world.getObjectById(objectId);
      if (object) {
        for (const actionName of this._actionNameToPlayerSlot.keys()) {
          object.addCustomAction(actionName);
        }
      }
    }
  }

  getActionCardNames(clickingPlayerSlot: PlayerSlot): string[] {
    const actionCardNames: string[] = [];

    const cardHolder: CardHolder | undefined =
      this._find.findCardHolderBySlot(clickingPlayerSlot);
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
    mageonObj: GameObject,
    clickingPlayer: Player,
    targetPlayerSlot: PlayerSlot,
    actionCardNames: string[]
  ): void {
    const clickingPlayerSlot: PlayerSlot = clickingPlayer.getSlot();
    const clickingPlayerName: string =
      TI4.playerName.getBySlot(clickingPlayerSlot);
    const clickingColor: Color = world.getSlotColor(clickingPlayerSlot);

    const pos: Vector = mageonObj.getPosition();
    const mageonOwnerSlot: PlayerSlot =
      this._find.closestOwnedCardHolderOwner(pos);

    const targetPlayerName: string = TI4.playerName.getBySlot(targetPlayerSlot);
    const globalMsg: string = `${clickingPlayerName} used Mageon Implants on ${targetPlayerName}`;
    Broadcast.broadcastAll(globalMsg, clickingColor);

    if (mageonOwnerSlot) {
      let msg: string;
      if (mageonOwnerSlot !== clickingPlayerSlot) {
        msg = `Mageon Implants: You are not the owner of this card`;
      } else {
        msg = `Mageon Implants: ${clickingPlayerName} reports action cards: ${actionCardNames.join(", ")}`;
      }
      Broadcast.chatOne(clickingPlayer, msg, clickingColor);
    }
  }
}
