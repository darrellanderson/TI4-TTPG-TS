import { Card } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
export declare class UnpackFactionTech extends AbstractUnpack {
    private readonly _cardUtil;
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
    _getExistingTechDeckOrThrow(): Card;
    _filterFactionTech(deck: Card): Card | undefined;
    _addFilteredToExistingTechDeck(filtered: Card | undefined): void;
}
