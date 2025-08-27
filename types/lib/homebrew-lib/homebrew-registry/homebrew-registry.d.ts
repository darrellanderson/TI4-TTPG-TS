import { FactionSchemaType } from "../../faction-lib/schema/faction-schema";
import { PlanetAttachmentSchemaType } from "../../system-lib/schema/planet-attachment-schema";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
import { SystemAttachmentSchemaType } from "../../system-lib/schema/system-attachment-schema";
import { SystemSchemaType } from "../../system-lib/schema/system-schema";
import { TechSchemaType } from "../../tech-lib/schema/tech-schema";
import { UnitAttrsSchemaType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../unit-lib/schema/unit-modifier-schema";
export type HomebrewModuleType = {
    sourceAndPackageId: SourceAndPackageIdSchemaType;
    factions?: Array<FactionSchemaType>;
    systems?: Array<SystemSchemaType>;
    planetAttachments?: Array<PlanetAttachmentSchemaType>;
    systemAttachments?: Array<SystemAttachmentSchemaType>;
    unitAttrs?: Array<UnitAttrsSchemaType>;
    unitModifiers?: Array<UnitModifierSchemaType>;
    technologies?: Array<TechSchemaType>;
    remove?: Array<string>;
    nsidToTemplateId?: {
        [key: string]: string;
    };
};
/**
 * Homebrew modules register via this class.
 */
export declare class HomebrewRegistry {
    load(params: HomebrewModuleType): void;
}
