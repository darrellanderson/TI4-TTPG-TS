import { world } from "@tabletop-playground/api";
import { Direction, IGlobal, NamespaceId, Shuffle, Window } from "ttpg-darrell";
import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
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
import { ParseSlices } from "../parse/parse-slices";
import { ParseLabels } from "../parse/parse-labels";
import { ParseFactions } from "../parse/parse-factions";
import { ResolveConflictsKeleres } from "../resolve-conflicts/resolve-conflicts-keleres";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "./draft-activity-start-params";
import { ParseBaseMap } from "../parse/parse-base-map";
import { MapStringParser } from "../../map-string-lib/map-string/map-string-parser";

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
    blacklistSystemTileNumbers: Array<number>,
    errors: Array<string>
  ): Array<SliceTiles> {
    const sliceSize: number = generateSlicesParams.sliceShape.length - 1;
    let slices: Array<SliceTiles> | undefined = new ParseSlices(
      sliceSize
    ).parseSlices(config, errors);

    if (slices === undefined) {
      slices = new GenerateSlices(generateSlicesParams)
        .setBlacklistSystemTileNumbers(blacklistSystemTileNumbers)
        .generateSlices(numSlices);
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

  static getBaseMap(config: string, errors: Array<string>): string | undefined {
    const baseMap: string | undefined = new ParseBaseMap().parseBaseMap(
      config,
      errors
    );
    return baseMap;
  }

  getDraftState(): DraftState | undefined {
    return this._draftState;
  }

  start(params: DraftActivityStartParams, errors: Array<string>): boolean {
    this._draftState = params.draft.createEmptyDraftState(DRAFT_NAMESPACE_ID);

    // Base map.
    const baseMap: string | undefined = DraftActivityStart.getBaseMap(
      params.config,
      errors
    );
    if (baseMap !== undefined) {
      this._draftState.setBaseMap(baseMap);
    }

    // Slices.
    const blacklistSystemTileNumbers: Array<number> = new MapStringParser()
      .parse(this._draftState.getBaseMap(), [])
      .map((mapStringEntry) => mapStringEntry.tile);

    const sliceParams: GenerateSlicesParams =
      params.draft.getGenerateSlicesParams();
    const slices: Array<SliceTiles> = DraftActivityStart.getOrGenerateSlices(
      params.config,
      params.numSlices,
      sliceParams,
      blacklistSystemTileNumbers,
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

      if (params.onStart) {
        params.onStart();
      }

      this.resume();
    }

    return success;
  }

  resume(): this {
    try {
      this._resume();
    } catch (e) {
      // Something went wrong, erase the draft in progress.
      world.setSavedData("", DRAFT_NAMESPACE_ID);
      throw e;
    }
    return this;
  }

  _resume(): this {
    if (!DraftState.isDraftInProgress(DRAFT_NAMESPACE_ID)) {
      throw new Error("Draft not in progress");
    }
    const draftState: DraftState = new DraftState(DRAFT_NAMESPACE_ID);
    this._draftState = draftState;

    const resolveConflictsKeleres = new ResolveConflictsKeleres(draftState);
    this._draftState.onDraftStateChanged.add(() => {
      resolveConflictsKeleres.resolve();
    });

    const create: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new DraftStateUI(draftState, params.scale);
    };
    const namespaceId: NamespaceId = "@TI4/draft-window";
    const windowTitle: string = "Draft";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      create,
      namespaceId,
      windowTitle
    );
    abstractWindow.addHost().getMutableWindowParams().disableClose = true;
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
