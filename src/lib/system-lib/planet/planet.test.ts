import { PlanetSchemaType } from "../schema/planet-schema";
import { Planet } from "./planet";

it("constructor", () => {
  const params: PlanetSchemaType = {
    name: "Tatooine",
  };
  const planet = new Planet(params);
  expect(planet.getName()).toEqual("Tatooine");
});
