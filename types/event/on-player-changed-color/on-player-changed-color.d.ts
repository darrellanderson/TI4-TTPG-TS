import { Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
/**
 * Apply the player changed color event.
 */
export declare class OnPlayerChangedColor implements IGlobal {
    readonly _onPlayerChangedColorHandler: (playerSlot: number, colorName: string, colorHex: string, clickingPlayer: Player) => void;
    init(): void;
}
