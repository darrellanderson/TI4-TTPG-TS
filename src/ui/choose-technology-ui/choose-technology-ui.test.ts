import { Card, CardHolder, Player, SnapPoint } from "@tabletop-playground/api";
import {
  clickAll,
  MockButton,
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";

import { ChooseTechnologyUI } from "./choose-technology-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { FindPlayerTechDeck } from "../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck";

it("static _getTechColumn", () => {
  const scale: number = 1;
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/sol");
  expect(faction).toBeDefined();
  const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(10);
  ChooseTechnologyUI._getTechColumn(
    scale,
    "unit-upgrade",
    faction,
    playerTechSummary,
    (_tech: Tech): void => {}
  );
});

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ChooseTechnologyUI(scale, playerSlot).destroy();
});

it("_onFetchTechClickHandler", () => {
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

  const tech: Tech | undefined = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/antimass-deflectors"
  );
  if (!tech) {
    throw new Error("Tech not found");
  }

  const scale: number = 1;
  const ui: ChooseTechnologyUI = new ChooseTechnologyUI(scale, playerSlot);
  const player: Player = new MockPlayer({ slot: playerSlot });

  ui._setCurrentTechSelection(tech);
  ui._onFetchTechClickHandler(new MockButton(), player);
});

it("clickAll", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  const ui: ChooseTechnologyUI = new ChooseTechnologyUI(scale, playerSlot);
  clickAll(ui.getWidget());
});
