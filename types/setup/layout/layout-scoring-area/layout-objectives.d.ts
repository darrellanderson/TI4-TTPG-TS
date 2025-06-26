import { GameObject } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
export declare class LayoutObjectives {
    private readonly _layout;
    private readonly _scoreboard;
    constructor();
    getLayout(): LayoutObjects;
    getScoreboard(): GameObject;
}
