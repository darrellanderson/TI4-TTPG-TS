import { Player } from "@tabletop-playground/api";
import { clickAll, MockPlayer } from "ttpg-mock";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { MapToolUI } from "./map-tool-ui";

it("constructor", () => {
  const scale: number = 1;
  const mapToolUI: AbstractUI = new MapToolUI(scale);
  expect(mapToolUI).toBeDefined();

  const player: Player = new MockPlayer();
  clickAll(mapToolUI.getWidget(), player);
});
