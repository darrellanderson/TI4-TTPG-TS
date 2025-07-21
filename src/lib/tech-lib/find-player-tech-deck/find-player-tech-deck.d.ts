import { Card } from "@tabletop-playground/api";
export declare class FindPlayerTechDeck {
    private readonly _find;
    _getTechDeck(playerSlot: number, errors: Array<string>): Card | undefined;
    getTechDeck(playerSlot: number): Card | undefined;
    getTechDeckOrThrow(playerSlot: number): Card;
}
