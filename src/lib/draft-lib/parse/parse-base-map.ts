import { MapStringParser } from "../../map-string-lib/map-string/map-string-parser";

export class ParseBaseMap {
  parseBaseMap(config: string, errors: Array<string>): string | undefined {
    let index: number;

    const prefix = "base=";
    index = config.indexOf(prefix);
    if (index !== -1) {
      config = config.substring(index + prefix.length);
    } else {
      // prefix MUST exist to find them.
      return undefined;
    }

    const suffix = "&";
    index = config.indexOf(suffix);
    if (index !== -1) {
      config = config.substring(0, index);
    }

    config = config.toLowerCase();
    const mapParserErrors: Array<string> = [];
    new MapStringParser().parse(config, mapParserErrors);
    if (mapParserErrors.length > 0) {
      errors.push("base map bad tiles: " + mapParserErrors.join(", "));
    }
    if (config.length === 0 || errors.length > 0) {
      return undefined;
    }
    return config;
  }
}
