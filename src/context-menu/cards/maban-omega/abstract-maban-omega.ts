import {
  Card,
  CardDetails,
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

export const MABAN_OMEGA_ACTION_NAME: string = "*Maban Omega";

/**
 * Naalu commander omega "card.leader.commander:codex.vigil/maban.omega"
 * (and "card.alliance:codex.vigil/naalu.omega"):
 * "At any time: You may look at your neighbors' hands of promissory notes
 * and the top and bottom card of the agenda deck"
 */
export abstract class AbstractMabanOmega extends AbstractRightClickCard {
  private readonly _find: Find = new Find();

  constructor(cardNsid: string) {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === MABAN_OMEGA_ACTION_NAME) {
        this.doMabanOmegaAction(object, player);
      }
    };
    super(cardNsid, MABAN_OMEGA_ACTION_NAME, customActionHandler);
  }

  isCommanderActive(): boolean {
    const nsid: string = "card.leader.commander:codex.vigil/maban.omega";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = false;
    const commander: Card | undefined = this._find.findCard(
      nsid,
      owningPlayerSlot,
      skipContained
    );
    return commander === undefined || commander.isFaceUp();
  }

  isOwningPlayer(object: GameObject, player: Player): boolean {
    const pos: Vector = object.getPosition();
    const closest: PlayerSlot = this._find.closestOwnedCardHolderOwner(pos);
    return closest === player.getSlot();
  }

  getNeighboringPlayerSlots(player: Player): Array<PlayerSlot> {
    const playerSlot: PlayerSlot = player.getSlot();
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlotOrThrow(playerSlot);
    const leftSeatIndex: number =
      (seatIndex + TI4.config.playerCount - 1) % TI4.config.playerCount;
    const rightSeatIndex: number = (seatIndex + 1) % TI4.config.playerCount;
    const leftPlayerSlot: PlayerSlot =
      TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(leftSeatIndex);
    const rightPlayerSlot: PlayerSlot =
      TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(rightSeatIndex);
    return [leftPlayerSlot, rightPlayerSlot];
  }

  getPromissoryNotes(playerSlot: PlayerSlot): Array<string> {
    const promissoryNotes: Array<string> = [];

    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolderBySlot(
      playerSlot,
      skipContained
    );

    if (cardHolder !== undefined) {
      const cards: Array<Card> = cardHolder.getCards();
      for (const card of cards) {
        const nsid: string = NSID.get(card);
        if (nsid.startsWith("card.promissory")) {
          const cardDetails: CardDetails = card.getCardDetails();
          promissoryNotes.push(cardDetails.name);
        }
      }
    }

    return promissoryNotes;
  }

  getAgendaDeckTopBottom(): { top: string; bottom: string } | undefined {
    let result: { top: string; bottom: string } | undefined = undefined;

    const deckSnapPointTag: string = "deck-agenda";
    const agendaDeck: Card | undefined =
      this._find.findDeckOrDiscard(deckSnapPointTag);

    if (agendaDeck) {
      const allCardDetails: Array<CardDetails> = agendaDeck.getAllCardDetails();
      const top: CardDetails | undefined =
        allCardDetails[allCardDetails.length - 1];
      const bottom: CardDetails | undefined = allCardDetails[0];
      if (top && bottom) {
        result = {
          top: top.name,
          bottom: bottom.name,
        };
      }
    }

    return result;
  }

  doMabanOmegaAction(object: GameObject, player: Player): void {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const color: Color = world.getSlotColor(player.getSlot());
    if (!this.isOwningPlayer(object, player)) {
      const msg: string = `Maban: You are not the owner of this card.`;
      Broadcast.chatOne(player, msg, color);
      return;
    }
    if (!this.isCommanderActive()) {
      const msg: string = `Maban: Commander is not active.`;
      Broadcast.chatOne(player, msg, color);
      return;
    }

    const msgParts: Array<string> = [];

    const neighboringPlayerSlots: Array<PlayerSlot> =
      this.getNeighboringPlayerSlots(player);
    for (const neighboringPlayerSlot of neighboringPlayerSlots) {
      const neighborName: string = TI4.playerName.getBySlot(
        neighboringPlayerSlot
      );
      const promisssoryNotes: Array<string> = this.getPromissoryNotes(
        neighboringPlayerSlot
      );
      const msg: string = `Maban: ${neighborName} promissory notes: ${promisssoryNotes.join(
        ", "
      )}`;
      msgParts.push(msg);
    }

    const agendaDeckTopBottom: { top: string; bottom: string } | undefined =
      this.getAgendaDeckTopBottom();
    if (agendaDeckTopBottom) {
      const msg: string = `Maban: Agenda deck top: ${agendaDeckTopBottom.top}, bottom: ${agendaDeckTopBottom.bottom}`;
      msgParts.push(msg);
    }

    const globalMsg: string = `${playerName} used Maban Omega`;
    Broadcast.broadcastAll(globalMsg, color);

    const msg: string = msgParts.join("\n");
    Broadcast.chatOne(player, msg, color);
  }
}
