import { Card } from "@tabletop-playground/api";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
export declare class UnpackStartingTech extends AbstractUnpack {
    private readonly _cardUtil;
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
    _getTechDeckOrThrow(): Card;
}
