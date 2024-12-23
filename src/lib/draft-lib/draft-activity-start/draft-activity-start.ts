import { Direction, NamespaceId, Shuffle } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import { Faction } from "../../faction-lib/faction/faction";
import {
  GenerateSlices,
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { GenerateFactions } from "../generate-factions/generate-factions";
import { IDraft } from "../drafts/idraft";
import { ParseSlices } from "../parse/parse-slices";
import { ParseLabels } from "../parse/parse-labels";
import { ParseFactions } from "../parse/parse-factions";

const DRAFT_NAMESPACE_ID: NamespaceId = "@ti4/draft";

export type DraftActivityStartParams = {
  namespaceId: NamespaceId;
  numSlices: number;
  numFactions: number;
  config: string;
};

/**
 * Start (or resume) a draft activity.
 * Load draft information from a config string, or generate it.
 * Create UI.
 */
export class DraftActivityStart {
  private _draftState: DraftState | undefined;

  static shouldResume(): boolean {
    return DraftState.isDraftInProgress(DRAFT_NAMESPACE_ID);
  }

  getDraftState(): DraftState | undefined {
    return this._draftState;
  }

  start(
    draft: IDraft,
    params: DraftActivityStartParams,
    errors: Array<string>
  ): boolean {
    this._draftState = draft.createEmptyDraftState(DRAFT_NAMESPACE_ID);

    // Slices.
    const sliceSize: number = this._draftState.getSliceShape(-1).length - 1;
    let slices: Array<SliceTiles> | undefined;
    slices = new ParseSlices(sliceSize).parseSlices(params.config, errors);
    if (slices === undefined) {
      const generateSlicesParams: GenerateSlicesParams =
        draft.getGenerateSlicesParams();
      slices = new GenerateSlices(generateSlicesParams).generateSlices(
        params.numSlices
      );
    }
    this._draftState.setSlices(slices);

    if (this._draftState.getSlices().length < TI4.config.playerCount) {
      errors.push(
        `Slice count (${this._draftState.getSlices().length}) is less than player count (${TI4.config.playerCount})`
      );
    }

    // Slice labels.
    const labels: Array<string> | undefined = new ParseLabels().parseLabels(
      params.config
    );
    if (labels !== undefined) {
      this._draftState.setSliceLabels(labels);
    }

    // Factions.
    let factions: Array<Faction> | undefined =
      new ParseFactions().parseFactions(params.config, errors);
    if (factions === undefined) {
      factions = new GenerateFactions().generate(params.numFactions);
    }
    this._draftState.setFactions(factions);

    if (this._draftState.getFactions().length < TI4.config.playerCount) {
      errors.push(
        `Faction count (${this._draftState.getFactions().length}) is less than player count (${TI4.config.playerCount})`
      );
    }

    const speakerIndex: number = Math.floor(
      Math.random() * TI4.config.playerCount
    );
    this._draftState.setSpeakerIndex(speakerIndex);

    const success: boolean = errors.length === 0;
    if (success) {
      // Set turn order.
      const playerSlots: Array<number> = TI4.playerSeats
        .getAllSeats()
        .map((seat) => seat.playerSlot);
      const order: Array<number> = new Shuffle<number>().shuffle(playerSlots);
      const direction: Direction = "snake";
      const first: number | undefined = order[0];
      if (first !== undefined) {
        TI4.turnOrder.setTurnOrder(order, direction, first);
      }

      this.resume();
    }

    return success;
  }

  resume(): this {
    this._draftState = new DraftState(DRAFT_NAMESPACE_ID);

    // TODO
    return this;
  }
}
