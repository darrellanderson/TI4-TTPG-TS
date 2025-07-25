import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";
import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";
import { Faction } from "../../faction-lib/faction/faction";
export declare const DraftStateSchema: z.ZodObject<{
    baseMap: z.ZodDefault<z.ZodString>;
    sliceShape: z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodString, "many">>>;
    sliceShapeOverrides: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodString, "many">>>>, "many">>;
    slices: z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodReadonly<z.ZodArray<z.ZodNumber, "many">>, "many">>>;
    sliceLabels: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    factions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    opaque: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    opaqueType: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    speakerIndex: z.ZodDefault<z.ZodNumber>;
    sliceIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
    factionIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
    seatIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
    opaqueIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
}, "strip", z.ZodTypeAny, {
    sliceShape: readonly string[];
    baseMap: string;
    sliceShapeOverrides: (readonly string[] | null)[];
    slices: readonly (readonly number[])[];
    sliceLabels: string[];
    factions: string[];
    opaque: string[];
    opaqueType: string | null;
    speakerIndex: number;
    sliceIndexToPlayerSlot: (number | null)[];
    factionIndexToPlayerSlot: (number | null)[];
    seatIndexToPlayerSlot: (number | null)[];
    opaqueIndexToPlayerSlot: (number | null)[];
}, {
    baseMap?: string | undefined;
    sliceShape?: string[] | undefined;
    sliceShapeOverrides?: (string[] | null | undefined)[] | undefined;
    slices?: number[][] | undefined;
    sliceLabels?: string[] | undefined;
    factions?: string[] | undefined;
    opaque?: string[] | undefined;
    opaqueType?: string | null | undefined;
    speakerIndex?: number | undefined;
    sliceIndexToPlayerSlot?: (number | null)[] | undefined;
    factionIndexToPlayerSlot?: (number | null)[] | undefined;
    seatIndexToPlayerSlot?: (number | null)[] | undefined;
    opaqueIndexToPlayerSlot?: (number | null)[] | undefined;
}>;
export type DraftStateSchemaType = z.infer<typeof DraftStateSchema>;
/**
 * Persistent draft state: player choices.
 */
export declare class DraftState {
    readonly onDraftStateChanged: TriggerableMulticastDelegate<(draftState: DraftState) => void>;
    private readonly _namespaceId;
    private readonly _data;
    static isDraftInProgress(namespaceId: NamespaceId): boolean;
    constructor(namespaceId: NamespaceId);
    destroy(): void;
    _save(): void;
    isActive(): boolean;
    isComplete(): boolean;
    setBaseMap(baseMap: string): this;
    getBaseMap(): string;
    setSliceShape(sliceShape: SliceShape): this;
    overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this;
    getSliceShape(seatIndex: number): SliceShape;
    setSlices(slices: Array<SliceTiles>): this;
    getSlices(): Array<SliceTiles>;
    setSliceLabels(sliceLabels: Array<string>): this;
    getSliceLabels(): Array<string>;
    setFactions(factions: Array<Faction>): this;
    getFactions(): Array<Faction>;
    setOpaques(opaque: Array<string>): this;
    getOpaques(): Array<string>;
    setOpaqueType(opaqueType: string | null): this;
    getOpaqueType(): string | null;
    setSpeakerIndex(speakerIndex: number): this;
    getSpeakerIndex(): number;
    setSliceIndexToPlayerSlot(sliceIndex: number, playerSlot: number): this;
    getSliceIndexToPlayerSlot(sliceIndex: number): number;
    setFactionIndexToPlayerSlot(factionIndex: number, playerSlot: number): this;
    getFactionIndexToPlayerSlot(factionIndex: number): number;
    /**
     * What faction is assigned to the result seat index?
     *
     * @param seatIndex
     * @returns
     */
    getSeatIndexToFaction(seatIndex: number): Faction | undefined;
    setSeatIndexToPlayerSlot(seatIndex: number, playerSlot: number): this;
    getSeatIndexToPlayerSlot(seatIndex: number): number;
    setOpaqueToPlayerSlot(opaqueIndex: number, playerSlot: number): this;
    getOpaqueIndexToPlayerSlot(opaqueIndex: number): number;
}
