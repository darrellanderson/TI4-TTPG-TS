import { SystemEntitySchema, SystemEntityType } from "./system-entity-schema";

it("parse (required only)", () => {
  const parsed: SystemEntityType = SystemEntitySchema.parse({
    name: "my-name",
  });
  expect(parsed).toEqual({
    name: "my-name",
  });
});

it("parse with optional", () => {
  const parsed: SystemEntityType = SystemEntitySchema.parse({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    class: "map",
    tile: 3,
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid-field"],
    wormholes: ["alpha"],
    img: "my-img",
    imgPackageId: "my-img-package-id",
    // skip planets
  });
  expect(parsed).toEqual({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    class: "map",
    tile: 3,
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid-field"],
    wormholes: ["alpha"],
    img: "my-img",
    imgPackageId: "my-img-package-id",
  });
});

it("parse with invalid name", () => {
  expect(() => {
    SystemEntitySchema.parse({
      name: 123, // not a string
    });
  }).toThrow();
});

it("parse with an invalid field", () => {
  expect(() => {
    SystemEntitySchema.parse({
      name: "my-name",
      type: "anomaly",
      invalidField: "invalid",
    });
  }).toThrow();
});
