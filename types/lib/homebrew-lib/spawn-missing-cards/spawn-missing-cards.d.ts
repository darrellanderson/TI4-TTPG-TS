import { Card } from "@tabletop-playground/api";
/**
 * Homebrew injection may add new cards to existings decks.
 * Given a new deck nsid, add any missing cards to the corresponding deck.
 */
export declare class SpawnMissingCards {
    private readonly _cardUtil;
    private readonly _find;
    static shouldSpawnMissingCards(deckNsid: string): boolean;
    static shouldShuffleDeck(deckNsid: string): boolean;
    spawnAndAddMissingCards(deckNsid: string): void;
    _spawnDeck(deckNsid: string): Card | undefined;
    /**
     * Decks are normally stored on snap points of `deck-${type}`
     * where cards have a `card.${type}` nsid prefix.
     *
     * @param deckNsid
     */
    _getExistingDeck(deckNsid: string): Card | undefined;
    _addMissingCards(srcDeck: Card, dstDeck: Card): void;
}
