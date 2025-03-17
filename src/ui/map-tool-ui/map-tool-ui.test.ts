import { Player } from "@tabletop-playground/api";
import { clickAll, MockPlayer } from "ttpg-mock";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CreateAbstractUIParams } from "../abstract-window/abstract-window";
import { MapToolUI } from "./map-tool-ui";
import { MapPremadeUI } from "../map-premade-ui/map-premade-ui";

it("constructor", () => {
  const scale: number = 1;
  const mapToolUI: AbstractUI = new MapToolUI(scale);
  expect(mapToolUI).toBeDefined();

  const player: Player = new MockPlayer();
  clickAll(mapToolUI.getWidget(), player);
});

it("_createMapPremadeUI", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  const params: CreateAbstractUIParams = {
    scale,
    playerSlot,
  };

  const mapToolUI: MapToolUI = new MapToolUI(scale);
  const player: Player = new MockPlayer();
  clickAll(mapToolUI.getWidget(), player); // attach window

  const mapPremadeUi: MapPremadeUI = mapToolUI._createMapPremadeUI(
    params
  ) as MapPremadeUI;
  expect(mapPremadeUi).toBeDefined();
  mapPremadeUi.onMapString.trigger("mapString");

  // Repeat, closes existing window.
  mapToolUI._createMapPremadeUI(params);
});
