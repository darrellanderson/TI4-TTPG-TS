import { Button } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare class CombatUISpace extends AbstractUI {
    private readonly _spaceCannonOffense;
    private readonly _ambush;
    private readonly _antifighterBarrage;
    private readonly _spaceCombat;
    constructor(scale: number, playerSlot: PlayerSlot);
    destroy(): void;
    getSpaceCannonOffense(): Button;
    getAmbush(): Button;
    getAntifighterBarrage(): Button;
    getSpaceCombat(): Button;
}
