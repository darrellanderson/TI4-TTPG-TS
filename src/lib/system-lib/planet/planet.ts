import { SystemDefaults } from "../data/system-defaults";
import { PlanetEntity } from "../planet-entity/planet-entity";
import { PlanetEntityType } from "../planet-entity/planet-entity-schema";

export class Planet {
  private readonly _primeEntry: PlanetEntity;
  private readonly _planetEntities: Array<PlanetEntity> = []; // first entry is raw planet

  constructor(params: PlanetEntityType) {
    this._primeEntry = new PlanetEntity(params);
    this._planetEntities.push(this._primeEntry);
  }

  getInfluence(): number {
    let result: number = 0;
    for (const planetEntity of this._planetEntities) {
      result += planetEntity.getInfluence();
    }
    return result;
  }

  getName(): string {
    return this._primeEntry.getName();
  }

  getRadius(): number {
    return this._primeEntry.getRadius() ?? SystemDefaults.PLANET_RADIUS;
  }

  getResources(): number {
    let result: number = 0;
    for (const planetEntity of this._planetEntities) {
      result += planetEntity.getResources();
    }
    return result;
  }

  getTechs(): string[] {
    const result: string[] = [];
    for (const planetEntity of this._planetEntities) {
      for (const tech of planetEntity.getTechs()) {
        if (!result.includes(tech)) {
          result.push(tech);
        }
      }
    }
    return result;
  }

  getTraits(): string[] {
    const result: string[] = [];
    for (const planetEntity of this._planetEntities) {
      for (const trait of planetEntity.getTraits()) {
        if (!result.includes(trait)) {
          result.push(trait);
        }
      }
    }
    return result;
  }

  isDestroyPlanet(): boolean {
    for (const planetEntity of this._planetEntities) {
      if (planetEntity.isDestroyPlanet()) {
        return true;
      }
    }
    return false;
  }

  isLegendary(): boolean {
    for (const planetEntity of this._planetEntities) {
      if (planetEntity.isLegendary()) {
        return true;
      }
    }
    return false;
  }
}
