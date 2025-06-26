import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { TechSchemaType } from "../schema/tech-schema";
import { Tech } from "../tech/tech";
export declare class TechRegistry {
    private readonly _nsidToTech;
    getAllNsids(): Array<string>;
    getAllTechs(): Array<Tech>;
    getByNsid(nsid: string): Tech | undefined;
    getByNsidNameMaybeOmegaToo(nsidName: string): Array<Tech>;
    load(source: NsidNameSchemaType, techSchemas: Array<TechSchemaType>): this;
    loadDefaultData(): this;
}
