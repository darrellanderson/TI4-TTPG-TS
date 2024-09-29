import { UnitAttrsSet } from "./unit-attrs-set";
import { UnitType } from "../schema/unit-attrs-schema";

it("constructor (empty)", () => {
  const unitAttrsSet = new UnitAttrsSet([]);
  expect(unitAttrsSet.get("infantry")).toBeUndefined();
});

it("addSyntheticUnit", () => {
  const unitAttrsSet = new UnitAttrsSet([
    {
      unit: "infantry",
      name: "base-infantry",
    },
  ]);
  let success: boolean;

  success = unitAttrsSet.addSyntheticUnit({
    unit: "infantry",
    name: "synthetic-infantry",
  });
  expect(success).toBe(false);

  success = unitAttrsSet.addSyntheticUnit({
    unit: "my-unit" as UnitType,
    name: "my-name",
  });
  expect(success).toBe(true);
  expect(unitAttrsSet.get("my-unit" as UnitType)?.getName()).toBe("my-name");
});

it("applyOverride", () => {
  const unitAttrsSet = new UnitAttrsSet([
    {
      unit: "infantry",
      name: "my-base-name",
    },
  ]);
  expect(unitAttrsSet.get("infantry")).toBeDefined();

  expect(
    unitAttrsSet.applyOverride({
      unit: "infantry",
      name: "my-override-name",
    }),
  ).toBe(true);
  expect(
    unitAttrsSet.applyOverride({
      unit: "fighter",
      name: "my-override-name",
    }),
  ).toBe(false);
});

it("get, getAll", () => {
  const unitAttrsSet = new UnitAttrsSet([
    {
      unit: "infantry",
      name: "my-base-name",
    },
  ]);
  expect(unitAttrsSet.get("infantry")).toBeDefined();
  expect(unitAttrsSet.getAll()[0]?.getUnit()).toBe("infantry");
});

it("getOrThrow", () => {
  const unitAttrsSet = new UnitAttrsSet([
    {
      unit: "infantry",
      name: "my-base-name",
    },
  ]);
  expect(unitAttrsSet.getOrThrow("infantry").getUnit()).toBe("infantry");
  expect(() => unitAttrsSet.getOrThrow("nope" as UnitType)).toThrow();
});
