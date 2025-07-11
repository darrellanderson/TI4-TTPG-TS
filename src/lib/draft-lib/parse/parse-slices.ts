import { SliceTiles } from "../generate-slices/generate-slices";

export class ParseSlices {
  private readonly _sliceSize: number;

  constructor(sliceSize: number) {
    this._sliceSize = sliceSize;
  }

  public parseSlices(
    config: string,
    errors: Array<string>
  ): Array<SliceTiles> | undefined {
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

    const entries: Array<string> = config
      .split("|")
      .filter((s) => s.length > 0);

    const slices: Array<SliceTiles> = [];

    for (const entry of entries) {
      const tileNumberStrings: Array<string> = entry
        .split(/[, ]/)
        .filter((s) => s.length > 0);
      if (tileNumberStrings.length !== this._sliceSize) {
        errors.push(
          `slice "${entry}" has ${tileNumberStrings.length} tiles, expected ${this._sliceSize}`
        );
        continue;
      }

      const slice: SliceTiles = tileNumberStrings.map((tileNumberString) =>
        parseInt(tileNumberString)
      );
      if (slice.includes(NaN)) {
        errors.push(`slice "${entry}" has invalid tile number`);
        continue;
      }

      slices.push(slice);
    }

    return slices.length > 0 ? slices : undefined;
  }
}
