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
  });
  expect(parsed).toEqual({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
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
