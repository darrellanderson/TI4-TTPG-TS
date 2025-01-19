import {
  Card,
  SnapPoint,
  StaticObject,
  Vector,
} from "@tabletop-playground/api";
import { CardUtil, Find, NSID, PlayerSlot } from "ttpg-darrell";

export class AvailableVotes {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  _isRepresentativeGovernment(): boolean {
    const nsids: Array<string> = [
      "card.agenda:base/representative-government",
      "card.agenda:pok/representative-government",
    ];

    for (const nsid of nsids) {
      const playerSlot: number | undefined = undefined;
      const skipContained: boolean = true;
      const card: Card | undefined = this._find.findCard(
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
      if (
        this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
      ) {
        return true;
      }
    }

    return false;
  }

  _getPlayerSlotToPerPlanetBonus(): Map<number, number> {
    const playerSlotToPerPlanetBonus: Map<number, number> = new Map();

    const playerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    let commander: Card | undefined = this._find.findCard(
      "card.leader.commander.xxcha:pok/elder_qanoj",
      playerSlot,
      skipContained
    );

    const allowFaceDown: boolean = false;
    if (commander && !this._cardUtil.isLooseCard(commander, allowFaceDown)) {
      commander = undefined;
    }

    let alliance: Card | undefined = this._find.findCard(
      "card.alliance:pok/xxcha",
      playerSlot,
      skipContained
    );
    if (!commander) {
      alliance = undefined; // only counts if commander is in play
    }

    if (commander) {
      const pos: Vector = commander.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      playerSlotToPerPlanetBonus.set(playerSlot, 1);
    }

    if (alliance) {
      const pos: Vector = alliance.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      playerSlotToPerPlanetBonus.set(playerSlot, 1);
    }

    return playerSlotToPerPlanetBonus;
  }

  /**
   * Get which player (if any) has the unlocked xxcha hero.
   * The call signature allows more than one, but internally
   * only looks for the first.
   *
   * @returns
   */
  _getXxchaResInfVotes(): Set<PlayerSlot> {
    const result: Set<PlayerSlot> = new Set();

    const gromOmegaNsid: string =
      "card.leader.hero.xxcha:codex.vigil/xxekir_grom.omega";
    const playerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const gromOmega: Card | undefined = this._find.findCard(
      gromOmegaNsid,
      playerSlot,
      skipContained
    );

    const allowFaceDown: boolean = false;
    if (gromOmega && this._cardUtil.isLooseCard(gromOmega, allowFaceDown)) {
      const pos: Vector = gromOmega.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      result.add(playerSlot);
    }

    return result;
  }
}
