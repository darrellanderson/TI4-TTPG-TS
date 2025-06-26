import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
export declare class UnpackAll extends AbstractUnpack {
    private readonly _unpacks;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
}
