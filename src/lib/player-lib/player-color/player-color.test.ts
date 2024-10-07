import { Color } from "@tabletop-playground/api";
import { PlayerColor } from "./player-color";

it("set/get", () => {
  const playerColor: PlayerColor = new PlayerColor("@test/test");
  let colorName: string | undefined;
  let plasticColor: Color | undefined;
  let widgetColor: Color | undefined;

  colorName = playerColor.getSlotColorName(10);
  plasticColor = playerColor.getSlotPlasticColor(10);
  widgetColor = playerColor.getSlotWidgetColor(10);

  expect(colorName).toBeUndefined();
  expect(plasticColor).toBeUndefined();
  expect(widgetColor).toBeUndefined();

  expect(() => {
    playerColor.getSlotColorNameOrThrow(10);
  }).toThrow();
  expect(() => {
    playerColor.getSlotPlasticColorOrThrow(10);
  }).toThrow();
  expect(() => {
    playerColor.getSlotWidgetColorOrThrow(10);
  }).toThrow();

  playerColor.setSlotColor(10, "green");

  colorName = playerColor.getSlotColorNameOrThrow(10);
  plasticColor = playerColor.getSlotPlasticColorOrThrow(10);
  widgetColor = playerColor.getSlotWidgetColorOrThrow(10);

  expect(colorName).toBe("green");
  expect(plasticColor?.toHex()).toBe("06CC44FF");
  expect(widgetColor?.toHex()).toBe("02B615FF");

  playerColor.setSlotColor(10, "yellow", "#FFFF00");
  colorName = playerColor.getSlotColorName(10);
  expect(colorName).toBe("yellow");
});
