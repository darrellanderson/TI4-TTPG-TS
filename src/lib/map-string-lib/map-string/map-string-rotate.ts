import { HexType } from "ttpg-darrell";
import { MapStringFormat } from "./map-string-format";
import { MapStringHex } from "./map-string-hex";
import { MapStringEntry, MapStringParser } from "./map-string-parser";
import { Vector } from "@tabletop-playground/api";

/**
 * Rotate a map string 180 degrees.
 */
export class MapStringRotate {
  rotate(mapString: string): string {
    const entriesBefore: Array<MapStringEntry> = new MapStringParser().parse(
      mapString,
      [],
    );

    const entriesAfter: Array<MapStringEntry> = [];
    const mapStringHex: MapStringHex = new MapStringHex();
    entriesBefore.forEach((entry: MapStringEntry, index: number): void => {
      const hexBefore: HexType = mapStringHex.indexToHex(index);
      const posBefore: Vector = TI4.hex.toPosition(hexBefore);
      const posAfter: Vector = new Vector(
        -posBefore.x,
        -posBefore.y,
        posBefore.z,
      );
      const hexAfter: HexType = TI4.hex.fromPosition(posAfter);
      const indexAfter: number = mapStringHex.hexToIndex(hexAfter);
      entriesAfter[indexAfter] = entry;
    });

    for (let index: number = 0; index < entriesAfter.length; index++) {
      if (!entriesAfter[index]) {
        entriesAfter[index] = { tile: -1 };
      }
    }

    const result: string = new MapStringFormat().format(entriesAfter);
    return result;
  }
}
