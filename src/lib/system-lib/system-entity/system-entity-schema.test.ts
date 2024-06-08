import { SystemEntySchema } from "./system-entity-schema";

it("parse", () => {
  SystemEntySchema.parse({
    name: "my-name",
    type: "anomaly",
  });
});

it("parse with optional", () => {
  SystemEntySchema.parse({
    name: "my-name",
    type: "anomaly",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
  });
});

it("parse with invalid name", () => {
  expect(() => {
    SystemEntySchema.parse({
      name: 123, // not a string
      type: "anomaly",
    });
  }).toThrow();
});

it("parse with invalid type", () => {
  expect(() => {
    SystemEntySchema.parse({
      name: "my-name",
      type: "NOT_A_VALID_TYPE",
    });
  }).toThrow();
});

it("parse with an invalid field", () => {
  expect(() => {
    SystemEntySchema.parse({
      name: "my-name",
      type: "anomaly",
      invalidField: "invalid",
    });
  }).toThrow();
});
