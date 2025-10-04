import { Vector } from "@tabletop-playground/api";
import { MapStringEntry, MapStringParser } from "./map-string-parser";
import { MapStringHex } from "./map-string-hex";
import { HexType } from "ttpg-darrell";
import { MapStringFormat } from "./map-string-format";

const HYPERLANES: Record<number, string> = {
  3: "{-1} 85A3 -1 85A5 -1 85A1 -1 -1 87A3 -1 88A5 -1 87A5 -1 87A3 -1 88A5 -1 88A3 86A3 84A3 -1 -1 -1 83A2 86A5 84A5 -1 -1 -1 84A3 86A1 83A2 -1 -1 -1 83A0",
  4: "{-1} 85A3 -1 -1 85A0 -1 -1 -1 88A1 -1 -1 -1 88A0 -1 87A0 -1 -1 -1 87A5 86A3 83A1 -1 -1 -1 -1 -1 -1 83A0 86A0 84A3 -1 -1 -1 -1 -1 -1 84A5",
  5: "{-1} -1 -1 -1 85A0 -1 -1 -1 -1 -1 -1 -1 88A0 -1 87A0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 83A0 86A0 84A3",
  7: "{-1} 85B3 -1 -1 84B3 90B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 88B3 -1 -1 -1 -1 -1 -1 86B3 -1 -1 -1 -1 -1 83B2",
  8: "{-1} 87A1 90B3 -1 88A2 89B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 85B2 -1 -1 -1 -1 -1 -1 -1 -1 83B2",
  // corners 7: "{-1} -1 -1 -1 -1 -1 -1 85A3 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 87A3 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 88A3 86A3 83A1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 84A5",
  // corners 8: "{-1} 87A1 90B3 -1 88A2 89B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 85B2 -1 -1 -1 -1 -1 -1 -1 -1 83B2",
};

export class MapStringHyperlanes {
  static get(playerCount: number): string {
    return HYPERLANES[playerCount] || "";
  }

  /**
   * Shift systems with an overlaying hyperlane to the closest open slot
   * (could be in another ring!), then apply the hyperlanes to the map string.
   *
   * @param mapString
   * @param playerCount
   * @returns
   */
  addHyperlanes(mapString: string, hyperlanesMapString: string): string {
    const mapStringParser = new MapStringParser();
    const mapStringArray: Array<MapStringEntry> =
      mapStringParser.parseOrThrow(mapString);
    const hyperlaneArray: Array<MapStringEntry> =
      mapStringParser.parseOrThrow(hyperlanesMapString);
    const maxIndex: number = Math.max(
      mapStringArray.length,
      hyperlaneArray.length
    );

    const open: Set<number> = new Set();
    const move: Array<{ index: number; entry: MapStringEntry }> = [];

    for (let index = 0; index < maxIndex; index++) {
      // Add hyperlane to map string.  If there is a tile there mark for move.
      const hyperlaneEntry: MapStringEntry | undefined = hyperlaneArray[index];
      if (hyperlaneEntry && hyperlaneEntry.tile > 0) {
        const mapStringEntry: MapStringEntry | undefined =
          mapStringArray[index];
        if (mapStringEntry && mapStringEntry.tile !== -1) {
          move.push({ index, entry: mapStringEntry });
        }
        mapStringArray[index] = hyperlaneEntry;
      }

      // Keep track of open slots in the ring.
      const mapStringEntry: MapStringEntry | undefined = mapStringArray[index];
      if (
        (!hyperlaneEntry || hyperlaneEntry.tile === -1) &&
        (!mapStringEntry || mapStringEntry.tile === -1)
      ) {
        open.add(index);
      }
    }

    // Keep shifting move entries to open spots until all are done.
    // Prioritize moving the shortest distance each pass.
    const mapStringHex: MapStringHex = new MapStringHex();
    while (move.length > 0) {
      let bestMoveIndex: number | undefined = undefined; // into the moveItem array, not map string
      let bestOpenIndex: number | undefined = undefined;
      let bestDistance: number | undefined = undefined;
      move.forEach((moveItem, moveIndex) => {
        const moveHex: HexType = mapStringHex.indexToHex(moveItem.index); // this is map string index
        const movePos: Vector = TI4.hex.toPosition(moveHex);
        for (const openIndex of open) {
          const openHex: HexType = mapStringHex.indexToHex(openIndex);
          const openPos: Vector = TI4.hex.toPosition(openHex);
          let distance: number = movePos.subtract(openPos).magnitudeSquared();

          // Prefer closer to center.
          distance += openIndex / 100;

          if (bestDistance === undefined || distance < bestDistance) {
            bestMoveIndex = moveIndex;
            bestOpenIndex = openIndex;
            bestDistance = distance;
          }
        }
        if (!bestDistance) {
          throw new Error(`no open slot`);
        }
        if (bestOpenIndex !== undefined && bestMoveIndex !== undefined) {
          mapStringArray[bestOpenIndex] = moveItem.entry;
          move.splice(bestMoveIndex, 1);
          open.delete(bestOpenIndex);
        }
      });
    }
    const result: string = new MapStringFormat().format(mapStringArray);
    return result;
  }
}
