import { Color } from "@tabletop-playground/api";
import { NamespaceId } from "ttpg-darrell";
type PlayerColorEntry = {
    colorName: string;
    target: string;
    plastic: string;
    widget: string;
};
export declare class PlayerColor {
    private readonly _namespaceId;
    private readonly _colorLib;
    constructor(namespaceId: NamespaceId);
    getAnonymousColor(): Color;
    _getPlayerColorEntry(slot: number): PlayerColorEntry | undefined;
    _setPlayerColorEntry(slot: number, entry: PlayerColorEntry): void;
    setSlotColor(slot: number, colorName: string, colorHex?: string): void;
    getSlotColorName(slot: number): string | undefined;
    getSlotColorNameOrThrow(slot: number): string;
    getSlotPlasticColor(slot: number): Color | undefined;
    getSlotPlasticColorOrThrow(slot: number): Color;
    getSlotWidgetColor(slot: number): Color | undefined;
    getSlotWidgetColorOrThrow(slot: number): Color;
}
export {};
