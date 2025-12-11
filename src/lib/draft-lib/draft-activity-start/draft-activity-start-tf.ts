import {
  Border,
  GameWorld,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Direction, IGlobal, Shuffle } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";
import {
  GenerateSlices,
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { ParseSlices } from "../parse/parse-slices";
import { ParseLabels } from "../parse/parse-labels";
import { ParseFactions } from "../parse/parse-factions";
import { ResolveConflictsKeleres } from "../resolve-conflicts/resolve-conflicts-keleres";
import {
  DRAFT_NAMESPACE_ID_TF,
  DraftActivityStartParamsTF,
} from "./draft-activity-start-params-tf";
import { MapStringParser } from "../../map-string-lib/map-string/map-string-parser";
import { DraftStateTF } from "../draft-state-tf/draft-state-tf";
import { DraftStateTfUI } from "../../../ui/draft/draft-state-tf-ui/draft-state-tf-ui";

export class DraftActivityMaybeResume implements IGlobal {
  init(): void {
    if (DraftStateTF.isDraftInProgress(DRAFT_NAMESPACE_ID_TF)) {
      new DraftActivityStartTF().resume();
    }
  }
}

/**
 * Start (or resume) a draft activity.
 * Load draft information from a config string, or generate it.
 * Create UI.
 */
export class DraftActivityStartTF {
  private _draftState: DraftStateTF | undefined;

  private static _sharedUiElement: UIElement | undefined = undefined;

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
      const candidates: Array<Faction> = [
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-black"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-blue"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-purple"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-green"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-red"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-yellow"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-orange"),
        TI4.factionRegistry.getByNsidOrThrow("faction:thunders-edge/tf-pink"),
      ];
      factions = new Shuffle<Faction>()
        .shuffle(candidates)
        .slice(0, Math.min(numFactions, candidates.length));
    }
    return factions;
  }

  getDraftState(): DraftStateTF | undefined {
    return this._draftState;
  }

  start(params: DraftActivityStartParamsTF, errors: Array<string>): boolean {
    this._draftState = new DraftStateTF(params.namespaceId);

    // Slices.
    const blacklistSystemTileNumbers: Array<number> = new MapStringParser()
      .parse(this._draftState.getBaseMap(), [])
      .map((mapStringEntry) => mapStringEntry.tile);

    const sliceParams: GenerateSlicesParams =
      params.draft.getGenerateSlicesParams();
    const slices: Array<SliceTiles> = DraftActivityStartTF.getOrGenerateSlices(
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
    const labels: Array<string> | undefined =
      DraftActivityStartTF.getSliceLabels(params.config);
    if (labels !== undefined) {
      this._draftState.setSliceLabels(labels);
    }

    // Factions.
    const factions: Array<Faction> = DraftActivityStartTF.getOrGenerateFactions(
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

      if (GameWorld.getExecutionReason() !== "unittest") {
        const countdownHours: number | undefined = params.countdownHours;
        if (countdownHours !== undefined) {
          TI4.timer.start(countdownHours * 60 * 60, -1);
        } else {
          TI4.timer.start(0, 1);
        }
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
      world.setSavedData("", DRAFT_NAMESPACE_ID_TF);
      throw e;
    }
    return this;
  }

  _resume(): this {
    if (!DraftStateTF.isDraftInProgress(DRAFT_NAMESPACE_ID_TF)) {
      throw new Error("Draft not in progress");
    }
    const draftState: DraftStateTF = new DraftStateTF(DRAFT_NAMESPACE_ID_TF);
    this._draftState = draftState;

    const resolveConflictsKeleres = new ResolveConflictsKeleres(draftState);
    this._draftState.onDraftStateChanged.add(() => {
      resolveConflictsKeleres.resolve();
    });

    /*
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
    */

    // Watch out for duplicate UIs.
    if (DraftActivityStartTF._sharedUiElement !== undefined) {
      world.removeUIElement(DraftActivityStartTF._sharedUiElement);
      DraftActivityStartTF._sharedUiElement = undefined;
    }

    // Use a shared, in-world UI instead of per-player windows.
    const scale: number = 4;
    const ui = new UIElement();
    ui.scale = 1 / scale;
    ui.widget = new Border().setChild(
      new DraftStateTfUI(draftState, scale).getWidget()
    );
    ui.position = new Vector(0, 0, world.getTableHeight() + 3);
    world.addUI(ui);
    DraftActivityStartTF._sharedUiElement = ui;

    // Close window when draft state destroyed.
    this._draftState.onDraftStateChanged.add(() => {
      if (!draftState.isActive()) {
        world.removeUIElement(ui);
        DraftActivityStartTF._sharedUiElement = undefined;
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
