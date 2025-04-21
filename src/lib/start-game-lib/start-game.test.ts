import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { StartGame } from "./start-game";

it("constructor/init", () => {
  new StartGame().init();
});

it("event", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });

  new StartGame().init();
  try {
    TI4.events.onStartGameRequest.trigger();
  } catch (_e) {
    // full setup requires more state than the mock objects provide
  }
  TI4.timer.stop();
});

it("event (correct player count)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
  });
  TI4.config.setPlayerCount(3);
  new StartGame().init();
  TI4.events.onStartGameRequest.trigger();
  TI4.timer.stop();
});

it("event (scoreboard)", () => {
  MockGameObject.simple("token:base/scoreboard");
  TI4.config.setPlayerCount(14);
  new StartGame().init();
  expect(() => {
    TI4.events.onStartGameRequest.trigger();
  }).toThrow();
  TI4.timer.stop();
});
