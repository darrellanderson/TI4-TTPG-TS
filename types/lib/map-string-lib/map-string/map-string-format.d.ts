import { MapStringEntry } from "./map-string-parser";
export declare class MapStringFormat {
    _formatEntry(entry: MapStringEntry, index: number): string;
    format(entries: Array<MapStringEntry>): string;
}
