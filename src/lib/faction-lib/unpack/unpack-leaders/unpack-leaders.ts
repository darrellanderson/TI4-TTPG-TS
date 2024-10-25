import {
  Card,
  GameObject,
  SnapPoint,
  Vector,
  world,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { RemoveByNsidOrSource } from "lib/remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";

export class UnpackLeaders extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();
  private readonly _removeByNsidOrSource: RemoveByNsidOrSource;

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);

    this._removeByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
  }

  unpack(): void {
    const leaderSheet: GameObject = this._findLeaderSheetOrThrow();
    const snapPoints: Array<SnapPoint> = leaderSheet.getAllSnapPoints();
    if (snapPoints.length !== 4) {
      throw new Error("Unexpected number of snap points");
    }

    const deck: Card = this.spawnDeckAndFilterSourcesOrThrow("card.leader:");

    let nsids: Array<string>;
    let snapPoint: SnapPoint | undefined;

    nsids = this.getFaction().getAgentNsids();
    snapPoint = snapPoints[3];
    if (snapPoint) {
      this._unpackLeaders(deck, nsids, snapPoint);
    }

    nsids = this.getFaction().getCommanderNsids();
    snapPoint = snapPoints[2];
    if (snapPoint) {
      this._unpackLeaders(deck, nsids, snapPoint);
    }

    nsids = this.getFaction().getHeroNsids();
    snapPoint = snapPoints[1];
    if (snapPoint) {
      this._unpackLeaders(deck, nsids, snapPoint);
    }

    nsids = this.getFaction().getMechNsids();
    snapPoint = snapPoints[0];
    if (snapPoint) {
      this._unpackLeaders(deck, nsids, snapPoint);
    }
  }

  remove(): void {
    const nsids: Array<string> = [
      ...this.getFaction().getAgentNsids(),
      ...this.getFaction().getCommanderNsids(),
      ...this.getFaction().getHeroNsids(),
      ...this.getFaction().getMechNsids(),
    ];
    const nsidSet: Set<string> = new Set(nsids);
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsidSet.has(nsid)) {
        const pos: Vector = obj.getPosition();
        const closest: number = this._find.closestOwnedCardHolderOwner(pos);
        if (closest === this.getPlayerSlot()) {
          DeletedItemsContainer.destroyWithoutCopying(obj);
        }
      }
    }
  }

  _findLeaderSheetOrThrow(): GameObject {
    const nsid: string = "sheet:pok/leader";
    const skipContained: boolean = true;
    const leaderSheet: GameObject | undefined = this._find.findGameObject(
      nsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!leaderSheet) {
      throw new Error("Leader sheet not found");
    }
    return leaderSheet;
  }

  _unpackLeaders(
    deck: Card,
    leaderNsids: Array<string>,
    snapPoint: SnapPoint
  ): void {
    const leaderNsidsAsSet: Set<string> = new Set(leaderNsids);
    const leaders: Card | undefined = this._cardUtil.filterCards(
      deck,
      (nsid: string): boolean => leaderNsidsAsSet.has(nsid)
    );
    if (leaderNsids.length > 0) {
      if (!leaders) {
        throw new Error("Leaders not found");
      }
      if (leaders.getStackSize() !== leaderNsidsAsSet.size) {
        throw new Error(
          `Unexpected number of leaders: have ${leaders.getStackSize()}, want ${leaderNsidsAsSet.size}`
        );
      }

      const above: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);
      const leadersCards: Array<Card> = this._cardUtil.separateDeck(leaders);
      for (const leaderCard of leadersCards) {
        leaderCard.setPosition(above);
        leaderCard.snapToGround();
        above.y -= 2;
      }
    }
  }
}
