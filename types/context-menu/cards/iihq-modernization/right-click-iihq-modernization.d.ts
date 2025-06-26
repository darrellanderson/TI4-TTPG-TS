import { Card } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const ACTION_NAME_IIHQ_MODERNIZATION: string;
export declare const IIHQ_MODERNIZATION_NSID: string;
export declare const LEGENDARY_NSID: string;
export declare const PLANET_NSID: string;
export declare class RightClickIihqModernization extends AbstractRightClickCard {
    private readonly _cardUtil;
    private readonly _find;
    constructor();
    getPlanetCard(): Card | undefined;
    getLegendaryCard(): Card | undefined;
    dealCardToPlayer(card: Card, playerSlot: number): void;
}
