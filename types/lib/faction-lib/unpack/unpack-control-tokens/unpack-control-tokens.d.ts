import { Container } from "@tabletop-playground/api";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
export declare class UnpackControlTokens extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
    _getControlTokenContainerOrThrow(): Container;
}
