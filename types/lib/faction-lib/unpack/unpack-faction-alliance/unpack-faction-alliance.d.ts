import { Card } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
export declare class UnpackFactionAlliance extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    _dealAllianceCardsAndDeleteDeck(unfilteredAlliancesDeck: Card): void;
    remove(): void;
}
