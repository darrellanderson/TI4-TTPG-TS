import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { System } from "../../../system-lib/system/system";
import { Card, CardHolder, GameObject } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

export class UnpackHomePlanetCards extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  _getHomePlanetCardsNsidsOrThrow(): Array<string> {
    const playerSlot: number = this.getPlayerSlot();
    const systemTileObj: GameObject | undefined =
      this.getFaction().getHomeSystemTileObj(playerSlot);
    if (systemTileObj) {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileObjId(systemTileObj.getId());
      if (system) {
        const result: Array<string> = [];
        for (const planet of system.getPlanets()) {
          result.push(planet.getPlanetCardNsid());
        }
        return result;
      }
    }
    throw new Error("Could not find home system tile or system");
  }

  _getPlanetDeckOrThrow(): Card {
    const deck: Card | undefined = this._find.findDeckOrDiscard("deck-planet");
    if (!deck) {
      throw new Error("Could not find planet deck");
    }
    return deck;
  }

  unpack(): void {
    const homePlanetCardsNsids: Array<string> =
      this._getHomePlanetCardsNsidsOrThrow();
    const planetDeck: Card = this._getPlanetDeckOrThrow();

    const cardStack: Card | undefined = this._cardUtil.filterCards(
      planetDeck,
      (nsid: string): boolean => {
        return homePlanetCardsNsids.includes(nsid);
      }
    );

    if (cardStack) {
      const cards: Array<Card> = this._cardUtil.separateDeck(cardStack);
      for (const card of cards) {
        card.setRotation([0, 0, 180]);
        this.dealToPlayerOrThrow(card);
      }
    }
  }

  remove(): void {
    const planetDeck: Card = this._getPlanetDeckOrThrow();

    const cardHolder: CardHolder = this.getPlayerHandHolderOrThrow();
    for (const card of cardHolder.getCards()) {
      const nsid: string = NSID.get(card);
      if (nsid.startsWith("card.planet:")) {
        card.removeFromHolder();
        planetDeck.addCards(card);
      }
    }
  }
}
