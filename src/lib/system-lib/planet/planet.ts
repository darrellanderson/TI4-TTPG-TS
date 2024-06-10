import { PlanetSchemaType } from "../schema/planet-schema";

export class Planet {
  private readonly _planetSchemaType: PlanetSchemaType;

  constructor(planetSchemaType: PlanetSchemaType) {
    this._planetSchemaType = planetSchemaType;
  }
}
