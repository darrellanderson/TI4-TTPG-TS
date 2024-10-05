import { PlayerColor } from "./player-color";

it("set/get", () => {
  const playerColor: PlayerColor = new PlayerColor();
  let colorName: string | undefined;

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBeUndefined();
  expect(playerColor.getSlotWidgetColor(10).toHex()).toBe("FFFFFFFF");
  expect(playerColor.getSlotPlasticColor(10).toHex()).toBe("FFFFFFFF");

  playerColor.setSlotColor(10, "green");

  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("green");
  expect(playerColor.getSlotWidgetColor(10).toHex()).toBe("02B615FF");
  expect(playerColor.getSlotPlasticColor(10).toHex()).toBe("06CC44FF");

  playerColor.setSlotColor(10, "yellow", "#FFFF00");
  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("yellow");
});
