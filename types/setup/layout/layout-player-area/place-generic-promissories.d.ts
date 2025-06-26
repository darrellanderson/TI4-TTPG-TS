import { Card, CardHolder } from "@tabletop-playground/api";
export declare class PlaceGenericPromissories {
    private readonly _playerSlot;
    private readonly _cardUtil;
    private readonly _find;
    constructor(playerSlot: number);
    place(): void;
    _getCardHolder(): CardHolder | undefined;
    _getColorName(): string | undefined;
    _getPromissoryDeck(): Card;
    _getGenericPromissoryCards(deck: Card, colorName: string): Array<Card>;
    _placeCards(cardHolder: CardHolder, cards: Array<Card>): void;
}
