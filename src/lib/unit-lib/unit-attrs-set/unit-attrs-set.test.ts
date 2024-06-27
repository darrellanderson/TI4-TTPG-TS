import exp from "constants";
import { UnitAttrsSet } from "./unit-attrs-set";

it("constructor (empty)", () => {
  const unitAttrsSet = new UnitAttrsSet([]);
  expect(unitAttrsSet.get("infantry")).toBeUndefined();
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
    })
  ).toBe(true);
  expect(
    unitAttrsSet.applyOverride({
      unit: "fighter",
      name: "my-override-name",
    })
  ).toBe(false);
});
