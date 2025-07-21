import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { TechColorType, TechSchemaType } from "../schema/tech-schema";
export declare class Tech {
    private readonly _source;
    private readonly _params;
    static sortByLevel(techs: Array<Tech>): Array<Tech>;
    constructor(source: NsidNameSchemaType, params: TechSchemaType);
    getColor(): TechColorType;
    getLevel(): number;
    getName(): string;
    getNsid(): string;
    getNsidName(): string;
    getPrerequisites(color: TechColorType): number;
    isFactionTech(): boolean;
    replacesNsidName(): string | undefined;
}
