import { Button, Player } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class ChooseTechnologyUI extends AbstractUI {
    private readonly _ui;
    private readonly _currentChoiceUi;
    private _currentTechSelection;
    _setCurrentTechSelection(tech: Tech | undefined): void;
    readonly _onFetchTechClickHandler: (button: Button, player: Player) => void;
    static _getTechColumn(scale: number, techColor: TechColorType, faction: Faction | undefined, playerTechSummary: PlayerTechSummary, onTechSelected: (tech: Tech) => void): AbstractUI;
    constructor(scale: number, playerSlot: PlayerSlot);
    destroy(): void;
}
