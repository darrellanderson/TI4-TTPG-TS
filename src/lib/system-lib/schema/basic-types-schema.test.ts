import {
  AnomalySchema,
  HyperlaneSchema,
  LocalPositionSchema,
  TechSchema,
  TraitSchema,
  WormholeSchema,
  WormholeWithPositionSchema,
} from "./basic-types-schema";

it("AnomalySchema", () => {
  const data = "asteroid_field";
  const parsed = AnomalySchema.parse(data);
  expect(parsed).toEqual(data);
});

it("HyperlaneSchema", () => {
  const data = {
    n: ["ne", "se"],
    ne: ["n", "se"],
    se: ["n", "ne"],
    s: ["ne", "se"],
    sw: ["ne", "se"],
    nw: ["ne", "se"],
  };
  const parsed = HyperlaneSchema.parse(data);
  expect(parsed).toEqual(data);
});

it("LocalPositionSchema", () => {
  const data = {
    x: 0,
    y: 0,
  };
  const parsed = LocalPositionSchema.parse(data);
  expect(parsed).toEqual(data);
});

it("TechSchema", () => {
  const data = "blue";
  const parsed = TechSchema.parse(data);
  expect(parsed).toEqual(data);
});

it("TraitSchema", () => {
  const data = "cultural";
  const parsed = TraitSchema.parse(data);
  expect(parsed).toEqual(data);
});

it("WormholeSchema", () => {
  const data = "alpha";
  const parsed = WormholeSchema.parse(data);
  expect(parsed).toEqual(data);
});

it("WormholeWithPositionSchema", () => {
  const data = {
    wormhole: "alpha",
    localPosition: {
      x: 0,
      y: 0,
    },
  };
  const parsed = WormholeWithPositionSchema.parse(data);
  expect(parsed).toEqual(data);
});
