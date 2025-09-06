import { Container, GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";
import { SpawnMissingCards } from "../spawn-missing-cards/spawn-missing-cards";

import { FactionSchemaType } from "../../faction-lib/schema/faction-schema";
import { PlanetAttachmentSchemaType } from "../../system-lib/schema/planet-attachment-schema";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
import { SystemAttachmentSchemaType } from "../../system-lib/schema/system-attachment-schema";
import { SystemSchemaType } from "../../system-lib/schema/system-schema";
import { TechSchemaType } from "../../tech-lib/schema/tech-schema";
import { UnitAttrsSchemaType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../unit-lib/schema/unit-modifier-schema";

export type HomebrewModuleType = {
  // Each of source and package id uniquely identifies a module.
  // Source is used in all relevant NSIDs.
  sourceAndPackageId: SourceAndPackageIdSchemaType;

  factions?: Array<FactionSchemaType>;
  systems?: Array<SystemSchemaType>;

  planetAttachments?: Array<PlanetAttachmentSchemaType>;
  systemAttachments?: Array<SystemAttachmentSchemaType>;

  unitAttrs?: Array<UnitAttrsSchemaType>;
  unitModifiers?: Array<UnitModifierSchemaType>;

  technologies?: Array<TechSchemaType>;

  remove?: Array<string>; // NSIDs

  nsidToTemplateId?: {
    [key: string]: string;
  };
};

/**
 * Homebrew modules register via this class.
 */
export class HomebrewRegistry {
  public load(params: HomebrewModuleType): void {
    const sources: Array<string> = TI4.config.sources;
    if (!sources.includes(params.sourceAndPackageId.source)) {
      sources.push(params.sourceAndPackageId.source);
      TI4.config.setSources(sources);
    }

    if (params.factions) {
      TI4.factionRegistry.load(params.sourceAndPackageId, params.factions);
    }

    if (params.systems) {
      TI4.systemRegistry.load(params.sourceAndPackageId, params.systems);
    }

    if (params.planetAttachments) {
      TI4.planetAttachmentRegistry.load(
        params.sourceAndPackageId,
        params.planetAttachments
      );
    }
    if (params.systemAttachments) {
      TI4.systemAttachmentRegistry.load(
        params.sourceAndPackageId,
        params.systemAttachments
      );
    }

    if (params.unitAttrs) {
      TI4.unitAttrsRegistry.load(
        params.sourceAndPackageId.source,
        params.unitAttrs
      );
    }
    if (params.unitModifiers) {
      TI4.unitModifierRegistry.load(
        params.sourceAndPackageId.source,
        params.unitModifiers
      );
    }

    if (params.technologies) {
      TI4.techRegistry.load(
        params.sourceAndPackageId.source,
        params.technologies
      );
    }

    if (params.remove) {
      TI4.removeRegistry.load(params.sourceAndPackageId.source, params.remove);
    }

    if (params.nsidToTemplateId) {
      TI4.spawn.inject(params.nsidToTemplateId);
    }

    this.addMissingItems(params);
  }

  /**
   * AFTER loading registries, spawn nsids.
   *
   * @param params
   */
  public addMissingItems(params: HomebrewModuleType): void {
    const source: string = params.sourceAndPackageId.source;
    const find: Find = new Find();

    const allNsids: Set<string> = new Set();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.length > 0) {
        allNsids.add(nsid);
      }
    }

    if (params.systems) {
      const container: Container | undefined = find.findContainer(
        "container:base/systems",
        undefined, // no owner
        true // skip contained
      );
      params.systems.forEach((system: SystemSchemaType): void => {
        const nsid: string | undefined =
          TI4.systemRegistry.tileNumberToSystemTileObjNsid(system.tile);
        if (
          !system.isHome &&
          system.tile > 0 &&
          nsid &&
          !allNsids.has(nsid) &&
          container
        ) {
          const above: Vector = container.getPosition().add([0, 0, 10]);
          const obj: GameObject = TI4.spawn.spawnOrThrow(nsid, above);
          container.addObjects([obj]);
        }
      });
    }

    if (params.planetAttachments) {
      const container: Container | undefined = find.findContainer(
        "container:pok/exploration",
        undefined, // no owner
        true // skip contained
      );
      params.planetAttachments.forEach(
        (schema: PlanetAttachmentSchemaType): void => {
          const nsid: string = `token.attachment.planet:${source}/${schema.nsidName}`;
          if (!allNsids.has(nsid) && container) {
            const above: Vector = container.getPosition().add([0, 0, 10]);
            const obj: GameObject = TI4.spawn.spawnOrThrow(nsid, above);
            const tags: Array<string> = obj.getTags();
            if (!tags.includes("exploration")) {
              tags.push("exploration");
              obj.setTags(tags);
            }
            container.addObjects([obj]);
          }
        }
      );
    }

    if (params.systemAttachments) {
      const container: Container | undefined = find.findContainer(
        "container:pok/exploration",
        undefined, // no owner
        true // skip contained
      );
      params.systemAttachments.forEach(
        (schema: SystemAttachmentSchemaType): void => {
          const nsid: string = `token.attachment.system:${source}/${schema.nsidName}`;
          if (!allNsids.has(nsid) && container) {
            const above: Vector = container.getPosition().add([0, -10, 10]);
            const obj: GameObject = TI4.spawn.spawnOrThrow(nsid, above);
            const tags: Array<string> = obj.getTags();
            if (!tags.includes("exploration")) {
              tags.push("exploration");
              obj.setTags(tags);
            }
            container.addObjects([obj]);
          }
        }
      );
    }

    if (params.nsidToTemplateId) {
      const spawnMissingCards = new SpawnMissingCards();
      for (const nsid of Object.keys(params.nsidToTemplateId)) {
        if (SpawnMissingCards.shouldSpawnMissingCards(nsid)) {
          spawnMissingCards.spawnAndAddMissingCards(nsid);
        }
      }
    }
  }
}
