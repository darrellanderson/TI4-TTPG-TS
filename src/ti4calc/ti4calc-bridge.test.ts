import { MockGameObject } from "ttpg-mock";
import { System } from "../lib/system-lib/system/system";
import { TI4CalcBridge } from "./ti4calc-bridge";

it("serialize battle", () => {
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
  globalThis.TI4.turnOrder.setTurnOrder(
    [selfPlayerSlot, opponentPlayerSlot],
    "forward",
    selfPlayerSlot
  );
  const bridge: TI4CalcBridge = new TI4CalcBridge(system);
  const json: string = bridge.serialize();
  const parsed = JSON.parse(json);
  expect(parsed).toEqual([
    {
      attacker: {
        battleEffects: {},
        damagedUnits: {},
        faction: "Arborec",
        riskDirectHit: false,
        side: "attacker",
        unitUpgrades: {},
        units: {
          carrier: 2,
          cruiser: 0,
          destroyer: 0,
          dreadnought: 0,
          fighter: 11,
          flagship: 0,
          infantry: 0,
          mech: 0,
          nonunit: 0,
          other: 0,
          pds: 0,
          warsun: 0,
        },
      },
      defender: {
        battleEffects: {},
        damagedUnits: {},
        faction: "Arborec",
        riskDirectHit: false,
        side: "defender",
        unitUpgrades: {},
        units: {
          carrier: 2,
          cruiser: 0,
          destroyer: 0,
          dreadnought: 0,
          fighter: 10,
          flagship: 0,
          infantry: 0,
          mech: 0,
          nonunit: 0,
          other: 0,
          pds: 0,
          warsun: 0,
        },
      },
      place: "Space",
    },
    {
      attacker: {
        battleEffects: {},
        damagedUnits: {},
        faction: "Arborec",
        riskDirectHit: false,
        side: "attacker",
        unitUpgrades: {},
        units: {
          carrier: 2,
          cruiser: 0,
          destroyer: 0,
          dreadnought: 0,
          fighter: 11,
          flagship: 0,
          infantry: 0,
          mech: 0,
          nonunit: 0,
          other: 0,
          pds: 0,
          warsun: 0,
        },
      },
      defender: {
        battleEffects: {},
        damagedUnits: {},
        faction: "Arborec",
        riskDirectHit: false,
        side: "defender",
        unitUpgrades: {},
        units: {
          carrier: 0,
          cruiser: 0,
          destroyer: 0,
          dreadnought: 0,
          fighter: 0,
          flagship: 0,
          infantry: 0,
          mech: 0,
          nonunit: 0,
          other: 0,
          pds: 0,
          warsun: 0,
        },
      },
      place: "Ground",
    },
  ]);
});
