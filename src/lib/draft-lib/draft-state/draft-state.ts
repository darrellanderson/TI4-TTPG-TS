import { world } from "@tabletop-playground/api";
import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";

import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";
import { Faction } from "../../faction-lib/faction/faction";

const SliceShapeSchema = z.array(z.string()).readonly().default([]);

export const DraftStateSchema = z.object({
  baseMap: z.string().default(""), // map string for non-slice systems
  sliceShape: SliceShapeSchema,
  sliceShapeOverrides: z.array(SliceShapeSchema.nullable()).default([]),
  slices: z.array(z.array(z.number()).readonly()).readonly().default([]),
  sliceLabels: z.array(z.string()).default([]),
  factions: z.array(z.string()).default([]),
  opaque: z.array(z.string()).default([]),
  opaqueType: z.string().nullable().default(null),
  speakerIndex: z.number().default(-1),
  sliceIndexToPlayerSlot: z.array(z.number().nullable()).default([]),
  factionIndexToPlayerSlot: z.array(z.number().nullable()).default([]),
  seatIndexToPlayerSlot: z.array(z.number().nullable()).default([]),
  opaqueIndexToPlayerSlot: z.array(z.number().nullable()).default([]),
});

export type DraftStateSchemaType = z.infer<typeof DraftStateSchema>;

/**
 * Persistent draft state: player choices.
 */
export class DraftState {
  public readonly onDraftStateChanged: TriggerableMulticastDelegate<
    (draftState: DraftState) => void
  > = new TriggerableMulticastDelegate<(draftState: DraftState) => void>();

  private readonly _namespaceId: NamespaceId;
  private readonly _data: DraftStateSchemaType;

  static isDraftInProgress(namespaceId: NamespaceId): boolean {
    const data: string | undefined = world.getSavedData(namespaceId);
    return data !== undefined && data.length > 0;
  }

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;

    const data: string | undefined = world.getSavedData(namespaceId);
    if (data !== undefined && data.length > 0) {
      this._data = DraftStateSchema.parse(JSON.parse(data));
    } else {
      this._data = DraftStateSchema.parse({});
    }

    this._save();
  }

  destroy(): void {
    world.setSavedData("", this._namespaceId);
    this.onDraftStateChanged.trigger(this);
    this.onDraftStateChanged.clear();
  }

  _save(): void {
    const json: string = JSON.stringify(this._data);
    if (json.length < 1024) {
      world.setSavedData(json, this._namespaceId);
    }
  }

  isActive(): boolean {
    return DraftState.isDraftInProgress(this._namespaceId);
  }

  isComplete(): boolean {
    const playerCount: number = TI4.config.playerCount;

    const chosenSliceCount: number = [
      ...this._data.sliceIndexToPlayerSlot.values(),
    ].filter((playerSlot: number | null): boolean => {
      return playerSlot !== null && playerSlot >= 0;
    }).length;
    if (chosenSliceCount < playerCount) {
      return false;
    }

    const chosenFactionCount: number = [
      ...this._data.factionIndexToPlayerSlot.values(),
    ].filter((playerSlot: number | null): boolean => {
      return playerSlot !== null && playerSlot >= 0;
    }).length;
    if (chosenFactionCount < playerCount) {
      return false;
    }

    const chosenSeatCount: number = [
      ...this._data.seatIndexToPlayerSlot.values(),
    ].filter((playerSlot: number | null): boolean => {
      return playerSlot !== null && playerSlot >= 0;
    }).length;
    if (chosenSeatCount < playerCount) {
      return false;
    }

    return true;
  }

  setBaseMap(baseMap: string): this {
    this._data.baseMap = baseMap;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getBaseMap(): string {
    return this._data.baseMap;
  }

  setSliceShape(sliceShape: SliceShape): this {
    this._data.sliceShape = sliceShape;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this {
    if (sliceShape.length !== this._data.sliceShape.length) {
      throw new Error("Invalid slice shape length");
    }
    this._data.sliceShapeOverrides[seatIndex] = sliceShape;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSliceShape(seatIndex: number): SliceShape {
    let sliceShape: ReadonlyArray<string> | null | undefined;
    sliceShape = this._data.sliceShapeOverrides[seatIndex];
    if (!sliceShape) {
      sliceShape = this._data.sliceShape;
    }
    return sliceShape as SliceShape;
  }

  setSlices(slices: Array<SliceTiles>): this {
    this._data.slices = slices;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSlices(): Array<SliceTiles> {
    return this._data.slices as Array<SliceTiles>;
  }

  setSliceLabels(sliceLabels: Array<string>): this {
    sliceLabels.forEach((label: string) => {
      if (label.length > 100) {
        throw new Error(`slice label too long (max 100): "${label}"`);
      }
    });
    this._data.sliceLabels = sliceLabels;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSliceLabels(): Array<string> {
    return this._data.sliceLabels;
  }

  setFactions(factions: Array<Faction>): this {
    this._data.factions = factions.map((faction) => faction.getNsid());
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getFactions(): Array<Faction> {
    const factions: Array<Faction> = this._data.factions.map((nsid) =>
      TI4.factionRegistry.getByNsidOrThrow(nsid)
    );
    return factions;
  }

  setOpaques(opaque: Array<string>): this {
    this._data.opaque = [...opaque];
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getOpaques(): Array<string> {
    return this._data.opaque;
  }

  setOpaqueType(opaqueType: string | null): this {
    this._data.opaqueType = opaqueType;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getOpaqueType(): string | null {
    return this._data.opaqueType;
  }

  setSpeakerIndex(speakerIndex: number): this {
    this._data.speakerIndex = speakerIndex;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSpeakerIndex(): number {
    return this._data.speakerIndex;
  }

  setSliceIndexToPlayerSlot(sliceIndex: number, playerSlot: number): this {
    this._data.sliceIndexToPlayerSlot[sliceIndex] = playerSlot;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSliceIndexToPlayerSlot(sliceIndex: number): number {
    return this._data.sliceIndexToPlayerSlot[sliceIndex] ?? -1;
  }

  setFactionIndexToPlayerSlot(factionIndex: number, playerSlot: number): this {
    this._data.factionIndexToPlayerSlot[factionIndex] = playerSlot;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getFactionIndexToPlayerSlot(factionIndex: number): number {
    return this._data.factionIndexToPlayerSlot[factionIndex] ?? -1;
  }

  /**
   * What faction is assigned to the result seat index?
   *
   * @param seatIndex
   * @returns
   */
  getSeatIndexToFaction(seatIndex: number): Faction | undefined {
    const playerSlot: number = this.getSeatIndexToPlayerSlot(seatIndex);
    if (playerSlot < 0) {
      return undefined;
    }
    const index: number = this._data.factionIndexToPlayerSlot.findIndex(
      (factionPlayerSlot: number | null): boolean =>
        factionPlayerSlot === playerSlot
    );
    if (index < 0) {
      return undefined;
    }
    return this.getFactions()[index];
  }

  setSeatIndexToPlayerSlot(seatIndex: number, playerSlot: number): this {
    this._data.seatIndexToPlayerSlot[seatIndex] = playerSlot;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getSeatIndexToPlayerSlot(seatIndex: number): number {
    return this._data.seatIndexToPlayerSlot[seatIndex] ?? -1;
  }

  setOpaqueToPlayerSlot(opaqueIndex: number, playerSlot: number): this {
    this._data.opaqueIndexToPlayerSlot[opaqueIndex] = playerSlot;
    this._save();
    this.onDraftStateChanged.trigger(this);
    return this;
  }

  getOpaqueIndexToPlayerSlot(opaqueIndex: number): number {
    return this._data.opaqueIndexToPlayerSlot[opaqueIndex] ?? -1;
  }
}
