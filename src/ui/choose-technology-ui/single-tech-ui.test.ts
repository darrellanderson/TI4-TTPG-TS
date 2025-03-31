import { Card, CardHolder, Player, SnapPoint } from "@tabletop-playground/api";
import {
  clickAll,
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { FindPlayerTechDeck } from "../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { SingleTechUI } from "./single-tech-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const tech: Tech | undefined = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/antimass-deflectors"
  );
  if (!tech) {
    throw new Error("Tech not found");
  }
  const ui: AbstractUI = new SingleTechUI(scale, tech, undefined);
  clickAll(ui.getWidget());
  ui.destroy();
});

it("clickall", () => {
  const playerSlot: number = 10;
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });
  const cardHolder: CardHolder | undefined =
    TI4.playerSeats.getCardHolderByPlayerSlot(playerSlot);
  expect(cardHolder).toBeDefined();

  const techDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.technology.blue:base/antimass-deflectors",
      }),
    ],
  });
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });
  const foundTechDeck: Card | undefined = new FindPlayerTechDeck().getTechDeck(
    playerSlot
  );
  expect(foundTechDeck).toBeDefined();

  const scale: number = 1;
  const tech: Tech | undefined = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/antimass-deflectors"
  );
  if (!tech) {
    throw new Error("Tech not found");
  }
  const ui: AbstractUI = new SingleTechUI(scale, tech, undefined);
  const player: Player = new MockPlayer({ slot: playerSlot });
  clickAll(ui.getWidget(), player);
  ui.destroy();
  expect(true).toBe(true);
});
