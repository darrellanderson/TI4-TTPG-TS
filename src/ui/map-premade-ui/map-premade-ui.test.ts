import { Widget } from "@tabletop-playground/api";
import { MapPremadeUI } from "./map-premade-ui";
import { clickAll } from "ttpg-mock";

it("static emptyMapString", () => {
  const mapString6: string = MapPremadeUI._emptyMapString(3);
  expect(mapString6.split(" ").length).toBe(36);

  const mapString8: string = MapPremadeUI._emptyMapString(7);
  expect(mapString8.split(" ").length).toBe(60);
});

it("static getPremadeMaps", () => {
  for (let i = 1; i <= 8; i++) {
    const maps: Array<unknown> = MapPremadeUI.getPremadeMaps(i);
    expect(maps).toBeDefined(); // at time of writing 2p premades are empty
  }
});

it("constructor, clickall", () => {
  const scale: number = 1;
  const widget: Widget = new MapPremadeUI(scale).getWidget();
  clickAll(widget);
});
