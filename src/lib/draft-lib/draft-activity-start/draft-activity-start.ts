import { Direction, IGlobal, NamespaceId, Shuffle, Window } from "ttpg-darrell";

import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../../ui/abstract-window/abstract-window";
import { DraftState } from "../draft-state/draft-state";
import { DraftStateUI } from "../../../ui/draft/draft-state-ui/draft-state-ui";
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
import { ResolveConflictsKeleres } from "../resolve-conflicts/resolve-conflicts-keleres";

const DRAFT_NAMESPACE_ID: NamespaceId = "@ti4/draft";

export type DraftActivityStartParams = {
  namespaceId: NamespaceId;
  numSlices: number;
  numFactions: number;
  config: string;
};

export class DraftActivityMaybeResume implements IGlobal {
  init(): void {
    if (DraftState.isDraftInProgress(DRAFT_NAMESPACE_ID)) {
      new DraftActivityStart().resume();
    }
  }
}

/**
 * Start (or resume) a draft activity.
 * Load draft information from a config string, or generate it.
 * Create UI.
 */
export class DraftActivityStart {
  private _draftState: DraftState | undefined;

  static getOrGenerateSlices(
    config: string,
    numSlices: number,
    generateSlicesParams: GenerateSlicesParams,
    errors: Array<string>
  ): Array<SliceTiles> {
    const sliceSize: number = generateSlicesParams.sliceShape.length - 1;
    let slices: Array<SliceTiles> | undefined = new ParseSlices(
      sliceSize
    ).parseSlices(config, errors);
    if (slices === undefined) {
      slices = new GenerateSlices(generateSlicesParams).generateSlices(
        numSlices
      );
    }
    return slices;
  }

  static getSliceLabels(config: string): Array<string> | undefined {
    return new ParseLabels().parseLabels(config);
  }

  static getOrGenerateFactions(
    config: string,
    numFactions: number,
    errors: Array<string>
  ): Array<Faction> {
    let factions: Array<Faction> | undefined =
      new ParseFactions().parseFactions(config, errors);
    if (factions === undefined) {
      factions = new GenerateFactions().generate(numFactions);
    }
    return factions;
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
    const sliceParams: GenerateSlicesParams = draft.getGenerateSlicesParams();
    const slices: Array<SliceTiles> = DraftActivityStart.getOrGenerateSlices(
      params.config,
      params.numSlices,
      sliceParams,
      errors
    );
    this._draftState.setSlices(slices);
    if (this._draftState.getSlices().length < TI4.config.playerCount) {
      errors.push(
        `Slice count (${this._draftState.getSlices().length}) is less than player count (${TI4.config.playerCount})`
      );
    }

    // Slice labels.
    const labels: Array<string> | undefined = DraftActivityStart.getSliceLabels(
      params.config
    );
    if (labels !== undefined) {
      this._draftState.setSliceLabels(labels);
    }

    // Factions.
    const factions: Array<Faction> = DraftActivityStart.getOrGenerateFactions(
      params.config,
      params.numFactions,
      errors
    );
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
    if (!DraftState.isDraftInProgress(DRAFT_NAMESPACE_ID)) {
      throw new Error("Draft not in progress");
    }
    const draftState: DraftState = new DraftState(DRAFT_NAMESPACE_ID);
    this._draftState = draftState;

    const resolveConflictsKeleres = new ResolveConflictsKeleres(draftState);
    this._draftState.onDraftStateChanged.add(() => {
      resolveConflictsKeleres.resolve();
    });

    const create: CreateAbstractUIType = (scale: number): AbstractUI => {
      return new DraftStateUI(draftState, scale);
    };
    const namespaceId: NamespaceId = "@TI4/draft-window";
    const windowTitle: string = "Draft";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      create,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().disableClose = true;
    const window: Window = abstractWindow.createWindow();
    window.attach();

    // Close window when draft state destroyed.
    this._draftState.onDraftStateChanged.add(() => {
      if (!draftState.isActive()) {
        window.detach();
      }
    });

    return this;
  }

  destroy(): void {
    if (this._draftState) {
      this._draftState.destroy();
      this._draftState = undefined;
    }
  }
}
