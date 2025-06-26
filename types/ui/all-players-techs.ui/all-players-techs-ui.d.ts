import { Color } from "@tabletop-playground/api";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class AllPlayersTechsUI extends AbstractUI {
    static getTechNameToColor(): Map<string, Color>;
    constructor(scale: number, gameData: GameData);
}
