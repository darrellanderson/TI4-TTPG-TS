import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { PlayerSlot } from "ttpg-darrell";
/**
 * space | hex
 * planet| planet | planet
 */
export declare class CombatUIAll extends AbstractUI {
    private readonly _combatUiSpace;
    private readonly _combatUiPlanets;
    private readonly _combatUiHex;
    constructor(scale: number, playerSlot: PlayerSlot);
    destroy(): void;
}
