import { Card } from "@tabletop-playground/api";
import { Find, IGlobal } from "ttpg-darrell";

export class ShuffleDecks implements IGlobal {
  public init(): void {
    console.log("ShuffleDecks.init()");

    const deckSnapPointTags: Array<string> = [
      "deck-action",
      "deck-agenda",
      "deck-exploration-cultural",
      "deck-exploration-frontier",
      "deck-exploration-hazardous",
      "deck-exploration-industrial",
      "deck-objective-1",
      "deck-objective-2",
      "deck-objective-secret",
      "deck-relic",
    ];
    const find: Find = new Find();
    for (const deckSnapPointTag of deckSnapPointTags) {
      const deck: Card | undefined = find.findDeckOrDiscard(deckSnapPointTag);
      if (deck) {
        console.log(
          `ShuffleDecks: shuffling: "${deckSnapPointTag}" (${deck.getId()})`
        );
        deck.shuffle();
      } else {
        console.log(`ShuffleDecks: missing deck: "${deckSnapPointTag}"`);
      }
    }
  }
}
