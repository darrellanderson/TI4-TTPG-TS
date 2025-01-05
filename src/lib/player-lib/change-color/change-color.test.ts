import { GameObject, MockGameObject } from "ttpg-mock";
import { ChangeColor } from "./change-color";
import { DrawingLine, world } from "@tabletop-playground/api";

it("constructor", () => {
  new ChangeColor(10);
});

it("changeColor", () => {
  new ChangeColor(10).changeColor("red", "#ff0000");
});

it("changeColor (invalid)", () => {
  expect(() => {
    new ChangeColor(10).changeColor("__invalid__", "#ff0000");
  }).toThrow();
});

it("_shouldChangeColor (false)", () => {
  const obj: GameObject = MockGameObject.simple("bad-nsid");
  expect(new ChangeColor(10)._shouldChangeColor(obj)).toBe(false);
});

it("_recolor", () => {
  const objs: Array<GameObject> = [
    MockGameObject.simple("mat:base/status-pad"),
    MockGameObject.simple("sheet:base/command"),
    MockGameObject.simple("sheet:pok/leader"),
    MockGameObject.simple("unit:base/carrier"),
    MockGameObject.simple("unit:pok/mech"),
    MockGameObject.simple("token.command:base/arborec"),
    MockGameObject.simple("token.control:base/arborec"),
  ];
  for (const obj of objs) {
    obj.setOwningPlayerSlot(10);
    expect(obj.getPrimaryColor().toHex()).not.toBe("FE2221FF");
  }

  new ChangeColor(10).changeColor("red", "#ff0000");

  for (const obj of objs) {
    expect(obj.getPrimaryColor().toHex()).toBe("FE2221FF");
  }
});

it("_recolorPlayerAreaBorderLines", () => {
  let drawingLine: DrawingLine | undefined = new DrawingLine();
  drawingLine.tag = "player-area-10";
  world.addDrawingLine(drawingLine);

  expect(drawingLine.color).not.toBe("FE0808FF");

  new ChangeColor(10).changeColor("red", "#ff0000");

  drawingLine = world.getDrawingLines()[0];
  expect(drawingLine?.color.toHex()).toBe("FE0808FF");
});
