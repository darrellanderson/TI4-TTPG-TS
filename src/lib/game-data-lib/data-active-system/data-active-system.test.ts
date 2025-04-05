import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { DataActiveSystem, DataActiveSystemType } from "./data-active-system";
import { System } from "../../system-lib/system/system";

it("constructor", () => {
  new DataActiveSystem();
});

it("get (empty)", () => {
  const dataActiveSystem = new DataActiveSystem();
  expect(dataActiveSystem.getFieldName()).toBe("activeSystem");
  expect(dataActiveSystem.getRootData()).toBeUndefined();
});

it("get (with data)", () => {
  MockGameObject.simple("tile.system:base/18");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);

  const dataActiveSystem = new DataActiveSystem();
  const data: DataActiveSystemType | undefined = dataActiveSystem.getRootData();
  expect(data?.tile).toBe(18);
  expect(data?.planets).toEqual(["Mecatol Rex"]);
});
