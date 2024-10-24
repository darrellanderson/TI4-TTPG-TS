import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { CardUtil, Find, Spawn } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { RemoveByNsidOrSource } from "lib/remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";

export class UnpackLeaders extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();
  private readonly _removeByNsidOrSource: RemoveByNsidOrSource;

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);

    const sources: Array<string> = TI4.config.sources;
    this._removeByNsidOrSource =
      RemoveByNsidOrSource.createFromRegistry(sources);
  }

  unpack(): void {
    const leaderSheet: GameObject = this._findLeaderSheetOrThrow();
    const snapPoints: Array<SnapPoint> = leaderSheet.getAllSnapPoints();
    if (snapPoints.length !== 4) {
      throw new Error("Unexpected number of snap points");
    }

    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string) => {
        nsid.startsWith("card.leader");
      }
    );
    const deck: Card = Spawn.spawnMergeDecksOrThrow(deckNsids);

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
    throw new Error("Method not implemented.");
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
    if (!leaders || leaders.getStackSize() !== leaderNsidsAsSet.size) {
      throw new Error("Unexpected number of leaders");
    }
  }
}
