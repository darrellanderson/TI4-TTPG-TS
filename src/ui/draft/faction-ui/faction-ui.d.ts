import { Faction } from "../../../lib/faction-lib/faction/faction";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare const BOX_W: number;
export declare const BOX_H: number;
export declare const FONT_SIZE: number;
export declare const SPACING: number;
export declare class FactionUI extends AbstractUI {
    constructor(faction: Faction, scale: number);
}
