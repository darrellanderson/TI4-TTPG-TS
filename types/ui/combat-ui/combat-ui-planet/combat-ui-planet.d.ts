import { Button } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare class CombatUIPlanet extends AbstractUI {
    private readonly _planetIndex;
    private _planetNameValue;
    private readonly _planetName;
    private readonly _bombardment;
    private readonly _spaceCannonDefense;
    private readonly _groundCombat;
    private readonly _onSystemActivatedHandler;
    constructor(scale: number, planetIndex: number);
    destroy(): void;
    update(): void;
    getBombardment(): Button;
    getSpaceCannonDefense(): Button;
    getGroundCombat(): Button;
}
