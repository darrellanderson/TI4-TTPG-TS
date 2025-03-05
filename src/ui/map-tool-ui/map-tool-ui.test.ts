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
  const mapToolUI: MapToolUI = new MapToolUI(scale);

  const playerSlot: number = 10;
  mapToolUI._openPremadeMapWindow(playerSlot);

  const params: CreateAbstractUIParams = {
    scale,
    playerSlot,
  };
  const mapPremadeUi: MapPremadeUI = mapToolUI._createMapPremadeUI(
    params
  ) as MapPremadeUI;
  expect(mapPremadeUi).toBeDefined();
  mapPremadeUi.onMapString.trigger("mapString");
});

it("_openPremadeMapWindow", () => {
  const scale: number = 1;
  const mapToolUI: MapToolUI = new MapToolUI(scale);
  const playerSlot: number = 10;
  mapToolUI._openPremadeMapWindow(playerSlot);
});
