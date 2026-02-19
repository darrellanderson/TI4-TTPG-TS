import {
  Card,
  GameObject,
  ObjectType,
  refObject,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import { Faction } from "../lib/faction-lib/faction/faction";
import { CardUtil, DeletedItemsContainer } from "ttpg-darrell";

/**
 * Spawn a new faction reference card on the mat for each unpacked faction.
 */
class ChosenFactionMat {
  private readonly _obj: GameObject;
  private readonly _onFactionChanged = (playerSlot: number): void => {
    this._update(playerSlot);
  };

  constructor(obj: GameObject) {
    this._obj = obj;

    TI4.events.onFactionChanged.remove(this._onFactionChanged);
    TI4.events.onFactionChanged.add(this._onFactionChanged);

    obj.onDestroyed.add(() => {
      TI4.events.onFactionChanged.remove(this._onFactionChanged);
    });
  }

  _getActiveSnapPoints(): Array<SnapPoint> {
    // Mat has snap points for 8 players, only use the ones for active players.
    const topCount: number = Math.floor(TI4.config.playerCount / 2);
    const bottomCount: number = TI4.config.playerCount - topCount;

    const allSnapPoints: Array<SnapPoint> = this._obj.getAllSnapPoints();
    const halfCount: number = Math.floor(allSnapPoints.length / 2);
    const topSnapPoints: Array<SnapPoint> = allSnapPoints.slice(0, halfCount);
    const bottomSnapPoints: Array<SnapPoint> = allSnapPoints.slice(halfCount);

    // Seat index is from bottom right then clockwise.
    return [
      ...bottomSnapPoints.slice(0, bottomCount).reverse(),
      ...topSnapPoints.slice(0, topCount),
    ];
  }

  _getSnapPoint(playerSlot: number): SnapPoint {
    const snapPoints: Array<SnapPoint> = this._getActiveSnapPoints();
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlotOrThrow(playerSlot);
    const snapPoint: SnapPoint | undefined = snapPoints[seatIndex];
    if (!snapPoint) {
      throw new Error(
        `No snap point for seat index ${seatIndex} on chosen faction mat`
      );
    }
    return snapPoint;
  }

  _getCardPos(playerSlot: number): Vector {
    const snapPoint: SnapPoint = this._getSnapPoint(playerSlot);
    return snapPoint.getGlobalPosition();
  }

  _getCard(playerSlot: number): Card | undefined {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (!faction) {
      return undefined;
    }

    const refCardNsid: string = faction.getFactionReferenceCardNsid();

    // Spawn a fresh card.
    const pos: Vector = this._obj.getPosition().add([0, 0, 10]);
    const deck: Card = TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow(
      "card.faction-reference",
      pos
    );

    const cardUtil: CardUtil = new CardUtil();
    const card: Card | undefined = cardUtil.filterCards(
      deck,
      (nsid: string): boolean => {
        return nsid === refCardNsid;
      }
    );
    DeletedItemsContainer.destroyWithoutCopying(deck);

    return card;
  }

  _update(playerSlot: number): void {
    // Remove any existing card in this position.
    const snapPoint: SnapPoint = this._getSnapPoint(playerSlot);
    const existingCard: GameObject | undefined = snapPoint.getSnappedObject();
    if (existingCard) {
      DeletedItemsContainer.destroyWithoutCopying(existingCard);
    }

    // Place card.
    const card: Card | undefined = this._getCard(playerSlot);
    const pos: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);
    if (card) {
      card.setPosition(pos);
      card.setRotation([0, 0, 180]);
      card.snapToGround();
      card.snap();
      card.setObjectType(ObjectType.Ground);
    }
  }
}

new ChosenFactionMat(refObject);
