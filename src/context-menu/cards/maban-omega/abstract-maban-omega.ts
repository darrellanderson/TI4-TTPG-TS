import {
  Card,
  CardDetails,
  CardHolder,
  Color,
  GameObject,
  Player,
  world,
} from "@tabletop-playground/api";
import { AbstractRightClickCard, Find, NSID, PlayerSlot } from "ttpg-darrell";
import { Vector } from "ttpg-mock";

const ACTION_NAME: string = "*Maban Omega";

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
      if (identifier === ACTION_NAME) {
        //
      }
    };
    super(cardNsid, ACTION_NAME, customActionHandler);
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
    return commander !== undefined && commander.isFaceUp();
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

  getAgendaDeckTopBottom(): Array<string> {
    const agendaCardNames: Array<string> = [];

    const deckSnapPointTag: string = "deck-agenda";
    const agendaDeck: Card | undefined =
      this._find.findDeckOrDiscard(deckSnapPointTag);

    if (agendaDeck) {
      const allCardDetails: Array<CardDetails> = agendaDeck.getAllCardDetails();
      const top: CardDetails | undefined =
        allCardDetails[allCardDetails.length - 1];
      const bottom: CardDetails | undefined = allCardDetails[0];
      if (top && bottom) {
        agendaCardNames.push(top.name);
        agendaCardNames.push(bottom.name);
      }
    }

    return agendaCardNames;
  }

  doMabanOmegaAction(object: GameObject, player: Player): void {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const color: Color = world.getSlotColor(player.getSlot());
    if (!this.isOwningPlayer(object, player)) {
      return;
    }
    if (!this.isCommanderActive()) {
      return;
    }
  }
}
