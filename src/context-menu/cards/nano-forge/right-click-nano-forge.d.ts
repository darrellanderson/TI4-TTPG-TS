import { Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const ACTION_FETCH_NANO_FORGE: string;
export declare const NANO_FORGE_NSID: string;
export declare const NANO_FORGE_TOKEN_NSID: string;
export declare class RightClickNanoForge extends AbstractRightClickCard {
    constructor();
    fetchNanoForgeToken(pos: Vector): void;
}
