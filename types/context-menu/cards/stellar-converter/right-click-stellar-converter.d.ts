import { Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const ACTION_FETCH_STELLAR_CONVERTER: string;
export declare const STELLAR_CONVERTER_NSID: string;
export declare const STELLAR_CONVERTER_TOKEN_NSID: string;
export declare class RightClickStellarConverter extends AbstractRightClickCard {
    constructor();
    fetchNanoForgeToken(pos: Vector): void;
}
