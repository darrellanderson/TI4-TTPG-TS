import { GameObject, Vector, world } from "@tabletop-playground/api";
import { SystemEntity } from "../system-entity/system-entity";
import { Planet } from "../planet/planet";

export class System {
  private readonly _primeSystemEntity: SystemEntity;
  private readonly _planets: Array<Planet> = [];
  private _systemTileObjId: string | undefined = undefined;

  constructor(systemEntity: SystemEntity) {
    this._primeSystemEntity = systemEntity;
    for (const planetEntityType of systemEntity.getPlanetEntityTypes()) {
      const planet = new Planet(planetEntityType);
      this._planets.push(planet);
    }
  }

  /**
   * Get the position of the entity in world coordinates.
   * Undefined if no system tile object.
   *
   * @returns
   */
  getGlobalPosition(localPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const globalPosition: Vector =
      systemTileObj.localPositionToWorld(localPosition);
    return globalPosition;
  }

  getPlanets(): Array<Planet> {
    return this._planets;
  }

  getSystemTileObj(): GameObject | undefined {
    if (!this._systemTileObjId) {
      return undefined;
    }
    const systemTileObj: GameObject | undefined = world.getObjectById(
      this._systemTileObjId
    );
    if (!systemTileObj || !systemTileObj.isValid()) {
      return undefined;
    }
    return systemTileObj;
  }

  getSystemTileObjId(): string | undefined {
    return this._systemTileObjId;
  }

  setSystemTileObjId(systemObjId: string | undefined): this {
    this._systemTileObjId = systemObjId;
    return this;
  }
}
