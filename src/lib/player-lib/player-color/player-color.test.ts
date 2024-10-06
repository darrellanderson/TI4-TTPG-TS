import { PlayerColor } from "./player-color";

it("set/get", () => {
  const playerColor: PlayerColor = new PlayerColor("@test/test");
  let colorName: string | undefined;

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBeUndefined();
  expect(playerColor.getSlotWidgetColor(10)).toBeUndefined();
  expect(playerColor.getSlotPlasticColor(10)).toBeUndefined();

  expect(() => {
    playerColor.getSlotColorNameOrThrow(10);
  }).toThrow();
  expect(() => {
    playerColor.getSlotWidgetColorOrThrow(10);
  }).toThrow();
  expect(() => {
    playerColor.getSlotPlasticColorOrThrow(10);
  }).toThrow();

  playerColor.setSlotColor(10, "green");

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("green");
  expect(playerColor.getSlotWidgetColor(10)?.toHex()).toBe("02B615FF");
  expect(playerColor.getSlotPlasticColor(10)?.toHex()).toBe("06CC44FF");

  playerColor.setSlotColor(10, "yellow", "#FFFF00");
  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("yellow");
});
