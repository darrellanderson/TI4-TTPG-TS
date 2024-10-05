import { PlayerColor } from "./player-color";

it("set/get", () => {
  const playerColor: PlayerColor = new PlayerColor();
  let colorName: string | undefined;

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBeUndefined();

  playerColor.setSlotColor(10, "green");

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("green");

  playerColor.setSlotColor(10, "yellow", "#FFFF00");
  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("yellow");
});
