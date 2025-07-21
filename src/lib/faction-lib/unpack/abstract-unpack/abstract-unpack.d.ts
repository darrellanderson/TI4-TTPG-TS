import { Card, CardHolder } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
export declare abstract class AbstractUnpack {
    private readonly _faction;
    private readonly _playerSlot;
    constructor(faction: Faction, playerSlot: number);
    getFaction(): Faction;
    getPlayerSlot(): number;
    abstract unpack(): void;
    abstract remove(): void;
    spawnDeckAndFilterSourcesOrThrow(cardNsidPrefix: string): Card;
    getPlayerHandHolderOrThrow(): CardHolder;
    dealToPlayerOrThrow(card: Card): void;
}
