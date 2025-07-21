import { RemoveByNsidOrSource } from "../remove-by-nsid-or-source/remove-by-nsid-or-source";
export declare class RemoveRegistry {
    private readonly _sourceToRemoveNsids;
    createRemoveFromRegistryAndConfig(): RemoveByNsidOrSource;
    getAllNsids(): Array<string>;
    getAllSources(): Array<string>;
    getRemoveBySource(source: string): Array<string>;
    load(source: string, nsids: Array<string>): this;
    loadDefaultData(): this;
}
