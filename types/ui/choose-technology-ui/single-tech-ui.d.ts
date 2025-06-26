import { Button } from "@tabletop-playground/api";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class SingleTechUI extends AbstractUI {
    private readonly _button;
    constructor(scale: number, tech: Tech, faction: Faction | undefined, playerTechSummary: PlayerTechSummary);
    getButton(): Button;
}
