import { world } from "@tabletop-playground/api";
import { NamespaceId } from "ttpg-darrell";
import { z } from "zod";

import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";
import { Faction } from "lib/faction-lib/faction/faction";

export const DraftStateSchema = z.object({
  sliceShape: z.array(z.string()).readonly().default([]),
  slices: z.array(z.array(z.number()).readonly()).readonly().default([]),
  factions: z.array(z.string()).default([]),
  speakerIndex: z.number().default(-1),
  sliceIndexToPlayerSlot: z.array(z.number()).default([]),
  factionIndexToPlayerSlot: z.array(z.number()).default([]),
  seatIndexToPlayerSlot: z.array(z.number()).default([]),
});

export type DraftStateSchemaType = z.infer<typeof DraftStateSchema>;

/**
 * Persistent draft state: player choices.
 */
export class DraftState {
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
  }

  _save(): void {
    world.setSavedData(this._namespaceId, JSON.stringify(this._data));
  }

  setSliceShape(sliceShape: SliceShape): this {
    this._data.sliceShape = sliceShape;
    this._save();
    return this;
  }

  getSliceShape(): SliceShape {
    return this._data.sliceShape as SliceShape;
  }

  setSlices(slices: Array<SliceTiles>): this {
    this._data.slices = slices;
    this._save();
    return this;
  }

  getSlices(): Array<SliceTiles> {
    return this._data.slices as Array<SliceTiles>;
  }

  setFactions(factions: Array<Faction>): this {
    this._data.factions = factions.map((faction) => faction.getNsid());
    this._save();
    return this;
  }

  getFactions(): Array<Faction> {
    const factions: Array<Faction> = this._data.factions.map((nsid) =>
      TI4.factionRegistry.getByNsidOrThrow(nsid)
    );
    return factions;
  }

  setSpeakerIndex(speakerIndex: number): this {
    this._data.speakerIndex = speakerIndex;
    this._save();
    return this;
  }

  getSpeakerIndex(): number {
    return this._data.speakerIndex;
  }
}
