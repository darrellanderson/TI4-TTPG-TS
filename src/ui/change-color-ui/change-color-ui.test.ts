import { MockCardHolder, MockContentButton, MockPlayer } from "ttpg-mock";
import { ChangeColorUI } from "./change-color-ui";
import { ContentButton, Player } from "@tabletop-playground/api";

it("static getAllColorNames", () => {
  const colorNames: Array<string> = ChangeColorUI._getAllColorNames();
  expect(colorNames).toContain("red");
});

it("constructor", () => {
  new MockCardHolder({
    owningPlayerSlot: 10,
    templateMetadata: "card-holder:base/player-hand",
  });
  new MockCardHolder({
    owningPlayerSlot: 11,
    templateMetadata: "card-holder:base/player-hand",
  });

  const playerSlot: number = 10;
  const scale: number = 1;
  new ChangeColorUI(playerSlot, scale);
});

it("click", () => {
  const playerSlot: number = 10;
  const colorName: string = "red";
  const colorHex: string = "#ff0000";
  const clickHandler: (_button: ContentButton, _player: Player) => void =
    ChangeColorUI._getClickHandler(playerSlot, colorName, colorHex);

  const button: ContentButton = new MockContentButton();
  const player: Player = new MockPlayer();
  clickHandler(button, player);
});
