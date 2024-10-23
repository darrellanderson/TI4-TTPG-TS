import { NSID } from "ttpg-darrell";
import { NumpadKeySpawn } from "./numpad-key-spawn";
import { Player, world } from "@tabletop-playground/api";
import { mockGlobalEvents, MockPlayer } from "ttpg-mock";

it("numpad-key", () => {
  const nsid: string = "unit:base/carrier"; // differ from global version's nsids
  const key: number = 19; // won't conflict with actual key number
  const numpadKeySpawn = new NumpadKeySpawn({ [key]: nsid });

  let count: number;
  count = world.getAllObjects().filter((obj) => NSID.get(obj) === nsid).length;
  expect(count).toBe(0);

  const player: Player = new MockPlayer();
  const ctrl: boolean = false;
  const alt: boolean = false;

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, ctrl, alt);
  count = world.getAllObjects().filter((obj) => NSID.get(obj) === nsid).length;
  expect(count).toBe(1);

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, ctrl, alt);
  count = world.getAllObjects().filter((obj) => NSID.get(obj) === nsid).length;
  expect(count).toBe(2);

  numpadKeySpawn.destroy();

  count = world.getAllObjects().filter((obj) => NSID.get(obj) === nsid).length;
  expect(count).toBe(2);
});

it("numpad-key: invalid nsid", () => {
  const nsid: string = "_does_not_exist_";
  expect(() => {
    new NumpadKeySpawn({ 1: nsid });
  }).toThrow();
});
