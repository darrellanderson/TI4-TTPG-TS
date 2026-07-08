import {
  Card,
  CardHolder,
  Color,
  GameObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NSID } from "ttpg-darrell";

/**
 * Handle requests to fetch planet cards to the player planet board.
 */
export class OnFetchPlanetCardRequest implements IGlobal {
  private readonly _onFetchPlanetCardRequestHandler = (
    card: Card,
    playerSlot: number,
  ): void => {
    const success: boolean = this._fetch(card, playerSlot);
    if (success) {
      this._reportFetch(card, playerSlot);
    }
  };

  init(): void {
    TI4.events.onFetchPlanetCardRequest.add(
      this._onFetchPlanetCardRequestHandler,
    );
  }

  _reportFetch(card: Card, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const cardName: string = card.getCardDetails().name;
    const msg: string = `${playerName} fetched planet card "${cardName}"`;
    const color: Color = world.getSlotColor(playerSlot);
    Broadcast.chatAll(msg, color);
  }

  _fetch(card: Card, playerSlot: number): boolean {
    this._prepareCardForMove(card);

    const dst: Vector | undefined = this._getCardDestination(playerSlot);
    if (!dst) {
      return false;
    }
    dst.z = world.getTableHeight() + 10;

    card.setPosition(dst);
    card.snapToGround();
    card.snap(); // attach to snap point (if any)
    return true;
  }

  _prepareCardForMove(card: Card): void {
    // Remove from card holder.
    const holder: CardHolder | undefined = card.getHolder();
    if (holder) {
      const index: number = holder.getCards().indexOf(card);
      if (index >= 0) {
        holder.removeAt(index);
      }
    }

    // Remove if held by a player.
    if (card.isHeld()) {
      card.release();
    }
  }

  _getCardDestination(playerSlot: number): Vector | undefined {
    // Get planet board.
    let planetBoard: GameObject | undefined = undefined;
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === "mat.player:base/planet" &&
        obj.getOwningPlayerSlot() === playerSlot
      ) {
        planetBoard = obj;
        break;
      }
    }
    if (!planetBoard) {
      return undefined;
    }

    // Get first open snap point.
    for (const snapPoint of planetBoard.getAllSnapPoints()) {
      if (snapPoint.getSnappedObject() === undefined) {
        return snapPoint.getGlobalPosition();
      }
    }

    // No open snap points, return center of board.
    return planetBoard.getPosition();
  }
}
