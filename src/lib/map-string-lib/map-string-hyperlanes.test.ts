import { MapStringHyperlanes } from "./map-string-hyperlanes";
import { MapStringParser } from "./map-string-parser";

it("get", () => {
  const parser: MapStringParser = new MapStringParser();
  for (let i = 1; i <= 8; i++) {
    const mapString: string = MapStringHyperlanes.get(i);
    parser.parseOrThrow(mapString);
  }
});
