import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
/**
 * Clean combat UI, minimal.
 */
export declare class CombatUIAllSimple extends AbstractUI {
    private readonly _combatUiSpace;
    private readonly _combatUiPlanets;
    constructor(scale: number, playerSlot: PlayerSlot);
    destroy(): void;
}
