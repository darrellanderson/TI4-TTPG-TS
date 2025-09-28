import { DrawingLine, world } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { TurnOrder } from "ttpg-darrell";
import { AllBorders } from "./all-borders";

it("static getAllDrawingLines", () => {
  const line: DrawingLine = new DrawingLine();
  line.tag = "__border__";
  world.addDrawingLine(line);

  const lines: Array<DrawingLine> = AllBorders.getAllDrawingLines();
  expect(lines.length).toBe(1);
  expect(lines).toEqual([line]);
});

it("static removeAllDrawingLines", () => {
  const line: DrawingLine = new DrawingLine();
  line.tag = "__border__";
  world.addDrawingLine(line);
  expect(world.getDrawingLines().length).toBe(1);

  AllBorders.removeAllDrawingLines();
  expect(world.getDrawingLines().length).toBe(0);
});

it("constructor, event, destroy", () => {
  const allBorders = new AllBorders();
  allBorders.init();
  TurnOrder.onTurnStateChanged.trigger(globalThis.TI4.turnOrder);
  allBorders.destroy();
});

it("toggleVisibility", () => {
  // Create hand for player seat, system, and a control object.
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 13,
  });

  const allBorders = new AllBorders();
  allBorders.init();
  expect(allBorders.isVisibleTo(13)).toBe(false);
  allBorders.toggleVisibility(13);
  expect(allBorders.isVisibleTo(13)).toBe(true);
  allBorders.toggleVisibility(13);
  expect(allBorders.isVisibleTo(13)).toBe(false);
  allBorders.destroy();

  // Create from saved state.
  new AllBorders().destroy();
});
