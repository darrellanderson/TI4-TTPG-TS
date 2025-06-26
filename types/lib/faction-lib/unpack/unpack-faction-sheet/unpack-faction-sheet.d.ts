import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
export declare class UnpackFactionSheet extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
}
