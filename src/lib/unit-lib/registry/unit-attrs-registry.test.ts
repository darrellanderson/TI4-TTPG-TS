import { UnitAttrsRegistry } from "./unit-attrs-registry";
import { OLD_STYLE_UNIT_ATTRS } from "../data/unit-attrs-old-style.data";
import {
  CombatAttrsSchemaType,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";
import { NSID } from "ttpg-darrell";

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
  const registry = new UnitAttrsRegistry().loadDefaultData();

  const nsidNameRewrite: Record<string, string> = {
    heltitan: "hel-titan",
    "heltitan-2": "hel-titan-2",
    superdreadnought: "super-dreadnought",
    "superdreadnought-2": "super-dreadnought-2",
    "war-sun": "war-sun-2",
  };

  for (const oldStyle of OLD_STYLE_UNIT_ATTRS) {
    const unit: UnitType = oldStyle.unit.replace(/_/g, "-") as UnitType;

    if (unit === "mech") {
      continue; // skip for now, havent added mechs yet
    }

    // Lookup new style data.
    let newStyle: UnitAttrsSchemaType | undefined;
    if (oldStyle.triggerNsid) {
      let nsidName: string | undefined = NSID.parse(
        oldStyle.triggerNsid
      )?.nameParts[0]?.replace(/_/g, "-");
      if (nsidName) {
        nsidName = nsidNameRewrite[nsidName] ?? nsidName;
        newStyle = registry.getOverrideAttrs(nsidName);
      }
    } else {
      newStyle = registry.getBaseAttrs(unit);
    }

    // Verify new style version exists.
    if (!newStyle) {
      console.log("Missing new style:", unit, JSON.stringify(oldStyle));
    }
    expect(newStyle).toBeDefined();

    // Validate.
    // TODO
  }
});
