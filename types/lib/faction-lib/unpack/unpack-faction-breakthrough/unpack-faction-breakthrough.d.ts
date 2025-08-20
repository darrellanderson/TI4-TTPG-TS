import { Card, Container } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
export declare class UnpackFactionBreakthrough extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    _dealBreakthroughCardsAndDeleteDeck(unfilteredBreakthroughDeck: Card): void;
    _getFactionExtrasContainerOrThrow(): Container;
    remove(): void;
}
