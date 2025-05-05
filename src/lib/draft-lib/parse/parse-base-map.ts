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
    new MapStringParser().parse(config, errors);
    return config.length > 0 ? config : undefined;
  }
}
