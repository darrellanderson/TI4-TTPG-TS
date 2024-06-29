import { UnitAttrsRegistry } from "./unit-attrs-registry";
import { OLD_STYLE_UNIT_ATTRS } from "../data/unit-attrs-old-style.data";
import {
  CombatAttrsSchemaType,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";
import { NSID, ParsedNSID } from "ttpg-darrell";

it("constructor", () => {
  new UnitAttrsRegistry();
});

it("load (empty)", () => {
  const registry = new UnitAttrsRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const registry = new UnitAttrsRegistry();
  expect(registry.getBaseAttrs("infantry")).toBeUndefined();
  expect(registry.getOverrideAttrs("my-nsid-name")).toBeUndefined();

  registry.load("source", [
    {
      name: "my-base-name",
      unit: "infantry",
    },
    {
      name: "my-override-name",
      unit: "infantry",
      nsidName: "my-nsid-name",
    },
  ]);
  expect(registry.getBaseAttrs("infantry")?.name).toBe("my-base-name");
  expect(registry.getOverrideAttrs("my-nsid-name")?.name).toBe(
    "my-override-name"
  );
});

it("load (invalid schema)", () => {
  const registry = new UnitAttrsRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-base-name",
        unit: "infantry",
        nsidName: "@@invalid",
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new UnitAttrsRegistry();
  expect(registry.getBaseAttrs("fighter")).toBeUndefined();
  expect(registry.getOverrideAttrs("hybrid-crystal-fighter")).toBeUndefined();
  expect(registry.getAllBaseAttrs()).toHaveLength(0);

  registry.loadDefaultData();
  expect(registry.getBaseAttrs("fighter")).toBeDefined();
  expect(registry.getOverrideAttrs("hybrid-crystal-fighter")).toBeDefined();
  expect(registry.getAllBaseAttrs()).not.toHaveLength(0);
});

it("createUnitAttrsSet", () => {
  const unitAttrsSet = new UnitAttrsRegistry()
    .loadDefaultData()
    .createUnitAttrsSet(["fighter-2"]);
  expect(unitAttrsSet.get("infantry")?.getName()).toBe("Infantry");
  expect(unitAttrsSet.get("fighter")?.getName()).toBe("Fighter II");
});

it("compare vs old style data", () => {
  // This "test" is mostly a sanity check that new data agrees with old.
  const registry = new UnitAttrsRegistry().loadDefaultData();

  const nsidNameRewrite: Record<string, string> = {
    heltitan: "hel-titan",
    "heltitan-2": "hel-titan-2",
    superdreadnought: "super-dreadnought",
    "superdreadnought-2": "super-dreadnought-2",
    "war-sun": "war-sun-2",
  };

  const convertNsidName = (nsid: string | undefined): string | undefined => {
    if (nsid) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        let nsidName: string | undefined = parsed.nameParts[0];
        if (nsidName) {
          nsidName = nsidName.replace(/_/g, "-");
          nsidName = nsidNameRewrite[nsidName];
        }
        return nsidName;
      }
    }
    return undefined;
  };

  for (const oldStyle of OLD_STYLE_UNIT_ATTRS) {
    const unit: UnitType = oldStyle.unit.replace(/_/g, "-") as UnitType;
    const nsidName: string | undefined = convertNsidName(oldStyle.triggerNsid);

    // Lookup new style data.
    let newStyle: UnitAttrsSchemaType | undefined;
    if (nsidName) {
      newStyle = registry.getOverrideAttrs(nsidName);
    } else {
      newStyle = registry.getBaseAttrs(unit);
    }

    // Validate.
    let antiFighterBarrage: CombatAttrsSchemaType | undefined;
    if (oldStyle.antiFighterBarrage) {
      antiFighterBarrage = {
        dice: oldStyle.antiFighterBarrage.dice,
        hit: oldStyle.antiFighterBarrage.hit,
      };
    }

    let bombardment: CombatAttrsSchemaType | undefined;
    if (oldStyle.bombardment) {
      bombardment = {
        dice: oldStyle.bombardment.dice,
        hit: oldStyle.bombardment.hit,
      };
    }

    let spaceCannon: CombatAttrsSchemaType | undefined;
    if (oldStyle.spaceCannon) {
      spaceCannon = {
        dice: oldStyle.spaceCannon.dice,
        hit: oldStyle.spaceCannon.hit,
        range: oldStyle.spaceCannon.range,
      };
    }

    let spaceCombat: CombatAttrsSchemaType | undefined;
    if (oldStyle.spaceCombat) {
      const crit: number | undefined = oldStyle.spaceCombat.extraHitsOn
        ? oldStyle.spaceCombat.extraHitsOn.value
        : undefined;
      const critCount: number | undefined = oldStyle.spaceCombat.extraHitsOn
        ? oldStyle.spaceCombat.extraHitsOn.count
        : undefined;
      spaceCombat = {
        dice: oldStyle.spaceCombat.dice,
        hit: oldStyle.spaceCombat.hit,
        crit,
        critCount,
      };
    }

    let groundCombat: CombatAttrsSchemaType | undefined;
    if (oldStyle.groundCombat) {
      groundCombat = {
        dice: oldStyle.groundCombat.dice,
        hit: oldStyle.groundCombat.hit,
      };
    }

    // Assert new style exists.
    if (!newStyle) {
      throw new Error(
        "Missing new style: " + unit + " " + JSON.stringify(oldStyle)
      );
    }
    const oldUpdated: UnitAttrsSchemaType = {
      name: newStyle.name,
      unit: newStyle.unit,
      componentCount: oldStyle.unitCount,
      nsidName,
      cost: oldStyle.cost,
      isShip: oldStyle.ship,
      isGround: oldStyle.ground,
      antiFighterBarrage,
      bombardment,
      spaceCannon,
      spaceCombat,
      groundCombat,
    };

    const scrub = (obj: Record<string, any>) => {
      for (const [k, v] of [...Object.entries(obj)]) {
        if (v === undefined) {
          delete obj[k];
        } else if (typeof v === "object") {
          scrub(v);
        }
      }
    };
    expect(scrub(oldUpdated)).toEqual(scrub(newStyle));
  }
});
