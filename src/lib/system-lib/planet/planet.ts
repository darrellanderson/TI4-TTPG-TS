import { Vector } from "ttpg-mock";
import { PlanetSchemaType } from "../schema/planet-schema";

export class Planet {
  private readonly _params: PlanetSchemaType;

  // Planet position is based on total planets/wormholes in system.
  // Planet schema can apply an offset.
  private _planetIndex: number = 0;
  private _systemEntityCount: number = 0;

  constructor(planetSchemaType: PlanetSchemaType) {
    this._params = planetSchemaType;
  }

  getInfluence(): number {
    let result: number = this._params.influence || 0;

    return result;
  }

  getName(): string {
    return this._params.name;
  }

  getPosition(systemPosition: Vector): Vector {
    return new Vector(0, 0, 0);
  }
}
