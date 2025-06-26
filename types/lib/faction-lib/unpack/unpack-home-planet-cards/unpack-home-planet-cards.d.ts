import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { Card } from "@tabletop-playground/api";
export declare class UnpackHomePlanetCards extends AbstractUnpack {
    private readonly _cardUtil;
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    _getHomePlanetCardsNsidsOrThrow(): Array<string>;
    _getPlanetDeckOrThrow(): Card;
    unpack(): void;
    remove(): void;
}
