import { Card } from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";
import { Planet } from "../../lib/system-lib/planet/planet";
import { PlanetCardLayout } from "../../lib/system-lib/planet-attachment/planet-card-layout";

/**
 * Update attachements on planet cards when a singleton planet card is created.
 */
export class OnPlanetCardSingleton implements IGlobal {
  constructor() {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card): void => {
        const nsid: string = NSID.get(card);
        const planet: Planet | undefined =
          TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
        if (planet) {
          new PlanetCardLayout().layout(planet);
        }
      }
    );

    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      (card: Card): void => {
        for (const ui of card.getUIs()) {
          card.removeUIElement(ui);
        }
      }
    );
  }

  init(): void {}
}
