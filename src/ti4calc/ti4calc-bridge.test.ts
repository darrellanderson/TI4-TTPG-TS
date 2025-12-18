import { MockGameObject } from "ttpg-mock";
import { System } from "../lib/system-lib/system/system";
import { TI4CalcBridge } from "./ti4calc-bridge";

it("one simulation battle count", () => {
  // System.
  MockGameObject.simple("tile.system:base/19");

  // Units.
  const selfPlayerSlot: number = 10;
  for (let i = 0; i < 2; i++) {
    MockGameObject.simple("unit:base/carrier", {
      owningPlayerSlot: selfPlayerSlot,
    });
  }
  for (let i = 0; i < 11; i++) {
    MockGameObject.simple("unit:base/fighter", {
      owningPlayerSlot: selfPlayerSlot,
    });
  }

  const opponentPlayerSlot: number = 11;
  for (let i = 0; i < 2; i++) {
    MockGameObject.simple("unit:base/carrier", {
      owningPlayerSlot: opponentPlayerSlot,
    });
  }
  for (let i = 0; i < 10; i++) {
    MockGameObject.simple("unit:base/fighter", {
      owningPlayerSlot: opponentPlayerSlot,
    });
  }

  // Bridge.
  const system: System | undefined =
    globalThis.TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("could not get system");
  }
  const bridge: TI4CalcBridge = new TI4CalcBridge(system);
  for (let i = 0; i < 100; i++) {
    const inProgress: boolean = bridge.advanceSimulations();
    const battleCount: number = bridge.getSimulationBattleCount();
    const result: string = bridge.getSimulationResult();
    console.log(`(${i}) ${battleCount} battles so far:\n${result}\n`);
    if (!inProgress) {
      break;
    }
  }
});
