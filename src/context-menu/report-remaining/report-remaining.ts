import {
  Card,
  CardDetails,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
} from "ttpg-darrell";

export class ReportRemaining implements IGlobal {
  private readonly _actionName: string = "*Report Remaining";
  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName && obj instanceof Card) {
      this.reportRemaining(obj, player);
    }
  };

  // Do NOT report remaining for action, agenda decks.
  // That can let players deduce cards in players' hands or otherwise hidden.
  private readonly _prefixes: Array<string> = [
    "card.exploration",
    "card.relic",
  ];

  init(): void {
    for (const obj of world.getAllObjects()) {
      this._maybeAddContextMenuItem(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAddContextMenuItem(obj);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card: Card) => {
      this._maybeAddContextMenuItem(card);
    });
  }

  _maybeAddContextMenuItem(obj: GameObject): void {
    if (obj instanceof Card) {
      const nsids: Array<string> = NSID.getDeck(obj);
      const nsid: string | undefined = nsids[0];
      if (
        nsid &&
        nsids.length > 1 &&
        this._prefixes.some((prefix) => nsid.startsWith(prefix))
      ) {
        obj.removeCustomAction(this._actionName);
        obj.addCustomAction(this._actionName);
        obj.onCustomAction.remove(this._customActionHandler);
        obj.onCustomAction.add(this._customActionHandler);
      }
    }
  }

  getCardNamesWithCountsMessage(deck: Card): string {
    const names: Array<string> = deck
      .getAllCardDetails()
      .map((cardDetails: CardDetails): string => {
        return cardDetails.name.replace(/ \(\d\)$/, ""); // strip off card number ("morale boost (2)")
      });

    const nameToCount: Map<string, number> = new Map<string, number>();
    for (const name of names) {
      const count: number = nameToCount.get(name) ?? 0;
      nameToCount.set(name, count + 1);
    }

    const namesWithCounts: Array<string> = Array.from(nameToCount.keys())
      .sort()
      .map((name: string) => {
        const count: number | undefined = nameToCount.get(name);
        let result: string = "";
        if (count !== undefined) {
          if (count === 1) {
            result = name;
          } else {
            result = `${name} (${count})`;
          }
        }
        return result;
      });

    return "Remaining: " + namesWithCounts.join(", ");
  }

  reportRemaining(deck: Card, player: Player): void {
    const msg: string = this.getCardNamesWithCountsMessage(deck);
    Broadcast.chatOne(player, msg);
  }
}
