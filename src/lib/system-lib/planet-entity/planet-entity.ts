import { SystemEntity } from "../system-entity/system-entity";
import { PlanetEntityType } from "./planet-entity-schema";

export class PlanetEntity extends SystemEntity {
  private readonly influence: number;
  private readonly resources: number;
  private readonly traits: string[];
  private readonly techs: string[];
  private readonly legendary: boolean;
  private readonly radius: number | undefined;
  private readonly destroyPlanet: boolean;

  constructor(params: PlanetEntityType) {
    super(params);
    this.influence = params.influence ?? 0;
    this.resources = params.resources ?? 0;
    this.traits = params.traits ?? [];
    this.techs = params.techs ?? [];
    this.legendary = params.legendary ?? false;
    this.radius = params.radius;
    this.destroyPlanet = params.destroyPlanet ?? false;
  }

  getInfluence(): number | undefined {
    return this.influence;
  }

  getResources(): number | undefined {
    return this.resources;
  }

  getTraits(): string[] | undefined {
    return this.traits;
  }

  getTechs(): string[] | undefined {
    return this.techs;
  }

  isLegendary(): boolean | undefined {
    return this.legendary;
  }

  getRadius(): number | undefined {
    return this.radius;
  }

  shouldDestroyPlanet(): boolean | undefined {
    return this.destroyPlanet;
  }
}
