import { SliceTiles } from "../generate-slices/generate-slices";
export declare class ParseSlices {
    private readonly _sliceSize;
    constructor(sliceSize: number);
    parseSlices(config: string, errors: Array<string>): Array<SliceTiles> | undefined;
}
