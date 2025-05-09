import { Vector } from "@tabletop-playground/api";
import { HexType, NamespaceId, Shuffle } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
import { System } from "../../system-lib/system/system";
import { MapStringHex } from "../../map-string-lib/map-string/map-string-hex";
import { SystemTier } from "../../system-lib/system/system-tier";
import { DraftToMapString } from "../draft-to-map-string/draft-to-map-string";
import {
  MapStringEntry,
  MapStringParser,
} from "../../map-string-lib/map-string/map-string-parser";
import { MILTY_SLICE_SHAPE, MILTY_SLICE_SHAPE_ALT } from "./milty";

export const NUCLEUS_SLICE_SHAPE: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<1,0,-1>", // front
  "<0,1,-1>", // right
];

export const NUCLEUS_SLICE_SHAPE_ALT: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<2,0,-2>", // front (pushed forward)
  "<1,0,-1>", // right (pushed forward)
];

export const NUCLEUS_MAP_STRING: string =
  "1 1 1 1 1 1 -1 1 -1 1 -1 1 -1 1 -1 1 -1 1";

const NUM_WORMHOLES: Array<number> = [2, 3, 4];
const NUM_REDS: Array<number> = [5, 6];

export class NucleusDraft implements IDraft {
  public isEnabled(): boolean {
    return true;
  }

  getDraftName(): string {
    return "Nucleus Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    const generateSlicesParams: GenerateSlicesParams = {
      sliceMakeups: [
        ["high", "low", "red"],
        ["med", "med", "red"],
      ],
      sliceShape: NUCLEUS_SLICE_SHAPE,
      minAlphaWormholes: 2,
      minBetaWormholes: 2,
      minLegendary: 1,
    };
    return generateSlicesParams;
  }

  createEmptyDraftState(namespaceId: NamespaceId): DraftState {
    const draftState: DraftState = new DraftState(namespaceId)
      .setSpeakerIndex(0)
      .setSliceShape(NUCLEUS_SLICE_SHAPE);
    if (TI4.config.playerCount === 7) {
      draftState.overrideSliceShape(3, NUCLEUS_SLICE_SHAPE_ALT);
    } else if (TI4.config.playerCount === 8) {
      draftState.overrideSliceShape(3, NUCLEUS_SLICE_SHAPE_ALT);
      draftState.overrideSliceShape(7, NUCLEUS_SLICE_SHAPE_ALT);
    }

    // Get the indexes of the "1" entries.
    const mapStringIndexes: Array<number> = this._getNucleusMapStringIndexes();

    // Get the map string parts including the '-1's.
    const entries: Array<number> = [];
    mapStringIndexes.forEach((index: number): void => {
      entries[index] = 1;
    });
    for (let i: number = 0; i < entries.length; i++) {
      if (entries[i] !== 1) {
        entries[i] = -1;
      }
    }

    // Add wormholes.
    const numWormholes: number | undefined = new Shuffle<number>().choice(
      NUM_WORMHOLES
    );
    let numRedWormholes: number = 0;
    if (numWormholes) {
      const wormholes: Array<number> = new Shuffle<number>().shuffle(
        this._getAvailableWormholes()
      );
      const scatteredWormholes: Array<number> = this._getScattered(
        mapStringIndexes,
        numWormholes
      );
      this._fillEntriesOrThrow(scatteredWormholes, wormholes, entries);

      // Count red wormholes towards num reds assigned.
      const systemTier: SystemTier = new SystemTier();
      numRedWormholes = wormholes.filter((wormhole: number): boolean => {
        const system: System | undefined =
          TI4.systemRegistry.getBySystemTileNumber(wormhole);
        return system !== undefined && systemTier.getTier(system) === "red";
      }).length;
    }

    // Add reds.
    let numReds: number | undefined = new Shuffle<number>().choice(NUM_REDS);
    if (numReds) {
      numReds = Math.max(0, numReds - numRedWormholes);
      const redSystems: Array<number> = new Shuffle<number>().shuffle(
        this._getNonWormholeRedSystems()
      );
      const scatteredReds: Array<number> = this._getScattered(
        mapStringIndexes,
        numReds
      );
      this._fillEntriesOrThrow(scatteredReds, redSystems, entries);
    }

    // Add blues.  Map string indexes gets pruned as we go,
    // the remaining indexes are unfilled awaiting blue systems.
    const numBlues: number = mapStringIndexes.length;
    const blueSystems: Array<number> = new Shuffle<number>()
      .shuffle(this._getNonWormholeBlueSystems())
      .slice(0, numBlues);
    this._fillEntriesOrThrow(mapStringIndexes, blueSystems, entries);

    draftState.setBaseMap(entries.join(" "));

    return draftState;
  }

  _getNucleusMapStringIndexes(): Array<number> {
    // Leverage draft state to map string.
    // Use the milty slice shape, setting the eq+far to 1
    // and the rest to 2 (need values everywhere for hyperlane
    // addition to shift to open slots)
    const nucluesDraftState: DraftState = new DraftState("@nucleus-inner/ti4")
      .setSliceShape(MILTY_SLICE_SHAPE)
      .setSpeakerIndex(0);

    if (TI4.config.playerCount === 7) {
      nucluesDraftState.overrideSliceShape(3, MILTY_SLICE_SHAPE_ALT);
    } else if (TI4.config.playerCount === 8) {
      nucluesDraftState.overrideSliceShape(3, MILTY_SLICE_SHAPE_ALT);
      nucluesDraftState.overrideSliceShape(7, MILTY_SLICE_SHAPE_ALT);
    }

    const slices: Array<SliceTiles> = [];
    for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
      const playerSlot: number = 10 + seatIndex;
      nucluesDraftState.setSliceIndexToPlayerSlot(seatIndex, playerSlot);
      nucluesDraftState.setSeatIndexToPlayerSlot(seatIndex, playerSlot);
      slices.push([2, 2, 2, 1, 1]);
    }
    nucluesDraftState.setSlices(slices);

    const mapString: string =
      DraftToMapString.fromDraftState(nucluesDraftState).mapString;
    nucluesDraftState.destroy();

    const parsed: Array<MapStringEntry> = new MapStringParser()
      .parseOrThrow(mapString)
      .filter((entry: MapStringEntry): boolean => {
        return entry.tile !== 18;
      });

    const nucleusMapStringIndexes: Array<number> = [];
    parsed.forEach((entry: MapStringEntry, index): void => {
      if (entry.tile === 1) {
        nucleusMapStringIndexes.push(index);
      }
    });

    return nucleusMapStringIndexes;
  }

  /**
   * Choose a handful of random wormhole location sets, use the
   * one with the largest "smallest distance between two wormholes".
   * Don't check too many, or results will be too similar.
   *
   * As a side effect, remove the chosen map string indexes from the
   * input array.
   */
  _getScattered(
    mapStringIndexes: Array<number>,
    want: number,
    iterations: number = 50
  ): Array<number> {
    if (mapStringIndexes.length < want) {
      throw new Error(
        `NucleusDraft._getScattered: mapStringIndexes.length (${mapStringIndexes.length}) < want (${want})`
      );
    }

    const mapStringHex: MapStringHex = new MapStringHex();
    const idxToPosition: Map<number, Vector> = new Map<number, Vector>();
    mapStringIndexes.forEach((i: number): void => {
      const hex: HexType = mapStringHex.indexToHex(i);
      const pos: Vector = TI4.hex.toPosition(hex);
      idxToPosition.set(i, pos);
    });

    let best: Array<number> = [];
    let bestDistance: number = 0;

    const shuffler: Shuffle<number> = new Shuffle<number>();
    for (let iteration = 0; iteration < iterations; iteration++) {
      const candidate: Array<number> = shuffler
        .shuffle([...mapStringIndexes])
        .slice(0, want);
      let minDistance: number | undefined = undefined;
      candidate.forEach((i: number): void => {
        candidate.forEach((j: number): void => {
          if (i <= j) {
            return;
          }
          const iPos: Vector | undefined = idxToPosition.get(i);
          const jPos: Vector | undefined = idxToPosition.get(j);
          if (iPos !== undefined && jPos !== undefined) {
            const distance: number = iPos.distance(jPos);
            if (minDistance === undefined || distance < minDistance) {
              minDistance = distance;
            }
          }
        });
      });

      if (minDistance !== undefined && minDistance > bestDistance) {
        bestDistance = minDistance;
        best = candidate;
      }
    }

    // Remove the chosen indexes from the input array.
    for (const index of best) {
      const idx: number = mapStringIndexes.indexOf(index);
      if (idx !== -1) {
        mapStringIndexes.splice(idx, 1);
      }
    }

    return best;
  }

  _getAvailableWormholes(): Array<number> {
    const skipContained: boolean = false;
    const wormholes: Array<number> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return !system.isExcludeFromDraft() && system.getWormholes().length > 0;
      })
      .map((system: System): number => {
        return system.getSystemTileNumber();
      });
    return wormholes;
  }

  _getNonWormholeRedSystems(): Array<number> {
    const systemTier: SystemTier = new SystemTier();
    const skipContained: boolean = false;
    const redSystems: Array<number> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return (
          !system.isExcludeFromDraft() &&
          system.getWormholes().length === 0 &&
          systemTier.getTier(system) === "red"
        );
      })
      .map((system: System): number => {
        return system.getSystemTileNumber();
      });
    return redSystems;
  }

  _getNonWormholeBlueSystems(): Array<number> {
    const systemTier: SystemTier = new SystemTier();
    const skipContained: boolean = false;
    const blueSystems: Array<number> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return (
          !system.isExcludeFromDraft() &&
          system.getWormholes().length === 0 &&
          systemTier.getTier(system) !== "red"
        );
      })
      .map((system: System): number => {
        return system.getSystemTileNumber();
      });
    return blueSystems;
  }

  _fillEntriesOrThrow(
    fillIndexes: Array<number>,
    fillWith: Array<number>,
    entries: Array<number>
  ): void {
    fillIndexes.forEach((fillIndex: number, index: number): void => {
      const fillValue: number | undefined = fillWith[index];
      if (fillValue === undefined) {
        throw new Error(
          `NucleusDraft._fillEntriesOrThrow: fillValue[${fillIndex}] is undefined`
        );
      }
      if (entries[fillIndex] !== 1) {
        throw new Error(
          `NucleusDraft._fillEntriesOrThrow: entries[${fillIndex}] is not 1`
        );
      }
      entries[fillIndex] = fillValue;
    });
  }
}
