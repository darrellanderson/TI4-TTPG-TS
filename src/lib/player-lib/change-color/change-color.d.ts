import { GameObject } from "@tabletop-playground/api";
/**
 * Change player color.
 *
 * - Recolor status pad.
 * - Recolor command, leader sheets.
 * - Recolor units.
 * - Recolor unit containers.
 * - Recolor command, control tokens.
 * - Recolor faction-extras, command, control containers.
 * - Replace generic-color promissories.
 * - Recolor player area border lines.
 *
 * - Send on color changed event (unit containers).
 *
 * - Card holder hand / secret should automatically pick up slot color change.
 */
export declare class ChangeColor {
    private readonly _playerSlot;
    private readonly _cardUtil;
    private readonly _find;
    private readonly _recolorNsids;
    private readonly _recolorNsidPrefixes;
    constructor(playerSlot: number);
    _shouldChangeColor(obj: GameObject): boolean;
    changeColor(newColorName: string, newColorHex: string): void;
    _recolorPlayerAreaBorderLines(): void;
    _replaceGenericPromissories(oldColorName: string, newColorName: string): void;
}
