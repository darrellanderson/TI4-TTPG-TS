import {
  MapStringEntry,
  MapStringParser,
} from "../map-string/map-string-parser";
import { PremadeMapType } from "./premade-map-type";
import { PREMADE_MAPS_2P } from "./premade-maps-2p.data";
import { PREMADE_MAPS_3P } from "./premade-maps-3p.data";
import { PREMADE_MAPS_4P } from "./premade-maps-4p.data";
import { PREMADE_MAPS_5P } from "./premade-maps-5p.data";
import { PREMADE_MAPS_6P } from "./premade-maps-6p.data";
import { PREMADE_MAPS_7P } from "./premade-maps-7p.data";
import { PREMADE_MAPS_8P } from "./premade-maps-8p.data";

const premadeMapEntries: Array<PremadeMapType> = [
  ...PREMADE_MAPS_2P,
  ...PREMADE_MAPS_3P,
  ...PREMADE_MAPS_4P,
  ...PREMADE_MAPS_5P,
  ...PREMADE_MAPS_6P,
  ...PREMADE_MAPS_7P,
  ...PREMADE_MAPS_8P,
];

it("parse map strings", () => {
  const errors: Array<string> = [];
  const mapStringParser = new MapStringParser();
  for (const premadeMapEntry of premadeMapEntries) {
    const playerCount: number = premadeMapEntry.playerCount;
    const mapString: string = premadeMapEntry.mapString;
    try {
      const _mapStringEntries: Array<MapStringEntry> =
        mapStringParser.parseOrThrow(mapString);
    } catch (e) {
      errors.push(
        `Error parsing premade map ${premadeMapEntry.name} (${playerCount}): ${e}`
      );
    }
  }
  if (errors.length > 0) {
    console.error(errors.join("\n"));
  }
  expect(errors).toEqual([]);
});

/*
    const playerCount: number = premadeMapEntry.playerCount;
    const rings: number = playerCount <= 6 ? 3 : 4;
    const limit = MapStringHex._firstIndexInRing(rings + 1);
      if (mapStringEntries.length > limit) {
        errors.push(
          `Premade map ${premadeMapEntry.name} (${playerCount}) has too many tiles (${mapStringEntries.length} > ${limit})`
        );
      }
*/
