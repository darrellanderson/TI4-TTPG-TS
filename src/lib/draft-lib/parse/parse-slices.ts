import { Slice } from "../generate-slices/generate-slices";

export class ParseSlices {
  private readonly _sliceSize: number;

  constructor(sliceSize: number) {
    this._sliceSize = sliceSize;
  }

  public parseSlices(config: string, errors: Array<string>): Array<Slice> {
    let index: number;

    const prefix = "slices=";
    index = config.indexOf(prefix);
    if (index !== -1) {
      config = config.substring(index + prefix.length);
    }

    const suffix = "&";
    index = config.indexOf(suffix);
    if (index !== -1) {
      config = config.substring(0, index);
    }

    const entries: Array<string> = config.split("|");

    const slices: Array<Slice> = [];

    for (const entry of entries) {
      const tileNumberStrings: Array<string> = entry.split(",");
      if (tileNumberStrings.length !== this._sliceSize) {
        errors.push(
          `slice "${entry}" has ${tileNumberStrings.length} tiles, expected ${this._sliceSize}`
        );
        continue;
      }

      const slice: Slice = tileNumberStrings.map((tileNumberString) =>
        parseInt(tileNumberString)
      );
      if (slice.includes(NaN)) {
        errors.push(`slice "${entry}" has invalid tile number`);
        continue;
      }

      slices.push(slice);
    }

    return slices;
  }
}
