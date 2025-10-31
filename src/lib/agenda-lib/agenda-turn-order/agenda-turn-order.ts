import { Card, GameObject, Vector } from "@tabletop-playground/api";
import { CardUtil, Find, PlayerSlot } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";

export class AgendaTurnOrder {
  private readonly _find: Find = new Find();
  private readonly _cardUtil: CardUtil = new CardUtil();

  public _getSpeakerTokenOrThrow(): GameObject {
    const nsid: string = "token:base/speaker";
    const playerSlot = undefined;
    const skipContained = true;
    const speakerToken = this._find.findGameObject(
      nsid,
      playerSlot,
      skipContained
    );
    if (!speakerToken) {
      throw new Error("missing speaker token");
    }
    return speakerToken;
  }

  public _getSpeakerTokenSeatIndexOrThrow(): number {
    const speakerToken: GameObject = this._getSpeakerTokenOrThrow();
    const pos: Vector = speakerToken.getPosition();
    const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
    const seatIndex: number = TI4.playerSeats
      .getAllSeats()
      .findIndex((seat) => seat.playerSlot === playerSlot);
    if (seatIndex === -1) {
      throw new Error("missing speaker token seat index");
    }
    return seatIndex;
  }

  public _getZealPlayerSlots(): Array<PlayerSlot> {
    const zealPlayerSlots: Array<PlayerSlot> = [];

    const playerSlotToFaction: Map<PlayerSlot, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();
    for (const [playerSlot, faction] of playerSlotToFaction) {
      if (faction.getAbilityNsids().includes("faction-ability:pok/zeal")) {
        zealPlayerSlots.push(playerSlot);
      }
    }
    return zealPlayerSlots;
  }

  /**
   * "When" and "after" resolve order.
   *
   * [2.9] Players take turns resolving action cards starting with the
   * speaker and proceeding clockwise.
   *
   * @returns {Array.{PlayerDesk}}
   */
  public getWhensOrAftersOrder(): Array<PlayerSlot> {
    const speakerSeatIndex: number = this._getSpeakerTokenSeatIndexOrThrow();
    const seatPlayerSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);
    const order: Array<PlayerSlot> = [
      ...seatPlayerSlots.slice(speakerSeatIndex),
      ...seatPlayerSlots.slice(0, speakerSeatIndex),
    ];
    return order;
  }

  /**
   * [8.2] Each player, starting with the player to the left of the
   * speaker and continuing clockwise, can cast votes for an outcome
   * of the current agenda.
   */
  public getVotingOrder(): Array<PlayerSlot> {
    const seatPlayerSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);
    const speakerSeatIndex: number = this._getSpeakerTokenSeatIndexOrThrow();
    const firstVoterIndex: number =
      (speakerSeatIndex + 1) % seatPlayerSlots.length;

    const order: Array<PlayerSlot> = [];
    for (let i = 0; i < seatPlayerSlots.length; i++) {
      const index: number =
        (firstVoterIndex + i + seatPlayerSlots.length) % seatPlayerSlots.length;
      const playerSlot: number | undefined = seatPlayerSlots[index];
      if (playerSlot !== undefined) {
        order.push(playerSlot);
      }
    }

    // If "Zeal" (Argent) is in game, they always vote first.
    // Allow more than one, preserving order.
    const zealPlayerSlots: Array<PlayerSlot> = this._getZealPlayerSlots();
    for (const zealPlayerSlot of zealPlayerSlots) {
      const index: number = order.indexOf(zealPlayerSlot);
      if (index !== -1) {
        order.splice(index, 1);
      }
    }
    for (const zealPlayerSlot of zealPlayerSlots) {
      order.unshift(zealPlayerSlot);
    }

    // If "Hack Election" is in game, that player votes last.
    const hackElectionNsid: string = "card.action:codex.ordinian/hack-election";
    const hackElectionCard: Card | undefined = this._find.findCard(
      hackElectionNsid,
      undefined,
      true
    );
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = ["discard-action"];
    if (
      hackElectionCard &&
      this._cardUtil.isLooseCard(
        hackElectionCard,
        allowFaceDown,
        rejectSnapPointTags
      )
    ) {
      const pos: Vector = hackElectionCard.getPosition();
      const hackElectionPlayerSlot: PlayerSlot =
        this._find.closestOwnedCardHolderOwner(pos);
      const index: number = order.indexOf(hackElectionPlayerSlot);
      if (index !== -1) {
        order.splice(index, 1);
        order.push(hackElectionPlayerSlot);
      }
    }

    return order;
  }
}
