import { GameObject } from "@tabletop-playground/api";
/**
 * Remove content based on source or NSID.
 */
export declare class RemoveByNsidOrSource {
    private readonly _cardUtil;
    private readonly _removeSources;
    private readonly _removeNsids;
    private readonly _shouldRemove;
    /**
     * Add a source to remove.
     * @param source Source to remove.
     */
    addSource(source: string): this;
    /**
     * Add an NSID to remove.
     * @param nsid NSID to remove.
     */
    addNsid(nsid: string): this;
    hasSource(source: string): boolean;
    hasNsid(nsid: string): boolean;
    removeOne(obj: GameObject): this;
    removeAll(): this;
    shouldRemove(nsid: string): boolean;
}
