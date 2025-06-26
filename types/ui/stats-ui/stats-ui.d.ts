import { AbstractUI } from "../abstract-ui/abtract-ui";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";
export declare class StatsUI extends AbstractUI {
    private readonly _statsEntries;
    private readonly _onGameData;
    constructor(scale: number);
    destroy(): void;
    update(gameData: GameData): void;
}
