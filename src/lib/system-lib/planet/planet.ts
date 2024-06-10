import { PlanetSchemaType } from "../schema/planet-schema";

export class Planet {
  private readonly _params: PlanetSchemaType;

  constructor(planetSchemaType: PlanetSchemaType) {
    this._params = planetSchemaType;
  }

  getName(): string {
    return this._params.name;
  }
}
