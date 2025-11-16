import { Border, UIElement, Vector, world } from "@tabletop-playground/api";
import {
  CardUtil,
  Direction,
  GarbageContainer,
  IGlobal,
  NSID,
  ParsedNSID,
  Shuffle,
} from "ttpg-darrell";
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

  static getFactionsOnTable(): Array<Faction> {
    const factions: Array<Faction> = [];

    const cardUtil: CardUtil = new CardUtil();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (cardUtil.isLooseCard(obj)) {
        const nsid: string = NSID.get(obj);
        if (nsid.startsWith("card.faction-reference:")) {
          const parsed: ParsedNSID | undefined = NSID.parse(nsid);
          if (!parsed) {
            throw new Error(`bad NSID "${nsid}"`);
          }
          const nsidName: string = parsed.nameParts.join(".");
          const faction: Faction | undefined =
            TI4.factionRegistry.getByNsidName(nsidName);
          if (faction) {
            factions.push(faction);
          }

          // Return faction reference cards to deck.
          GarbageContainer.tryRecycle(obj, undefined);
        }
      }
    }

    return factions;
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

  static getMinorFactions(factions: Array<Faction>): Array<string> {
    const inUseNsids: Array<string> = factions.map(
      (faction: Faction): string => {
        return faction.getNsid();
      }
    );

    if (
      inUseNsids.includes("faction:codex.vigil/keleres-argent") ||
      inUseNsids.includes("faction:codex.vigil/keleres-mentak") ||
      inUseNsids.includes("faction:codex.vigil/keleres-xxcha")
    ) {
      inUseNsids.push("faction:base/argent");
      inUseNsids.push("faction:base/mentak");
      inUseNsids.push("faction:base/xxcha");
    }
    inUseNsids.push("faction:codex.vigil/keleres-argent");
    inUseNsids.push("faction:codex.vigil/keleres-mentak");
    inUseNsids.push("faction:codex.vigil/keleres-xxcha");

    const availableFactions: Array<Faction> = TI4.factionRegistry
      .getAllFactionsFilteredByConfigSources()
      .filter((faction: Faction): boolean => {
        return (
          !inUseNsids.includes(faction.getNsid()) &&
          faction.getHomeSurrogateTileNumber() === -1
        );
      });
    const shuffledFactions: Array<Faction> = new Shuffle<Faction>().shuffle(
      availableFactions
    );
    const useFactions: Array<Faction> = shuffledFactions.slice(
      0,
      TI4.config.playerCount
    );
    return useFactions.map((faction: Faction): string => {
      return faction.getHomeSystemTileNumber().toString();
    });
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
    let factions: Array<Faction>;
    if (params.useFactionsOnTable) {
      factions = DraftActivityStart.getFactionsOnTable();
    } else {
      factions = DraftActivityStart.getOrGenerateFactions(
        params.config,
        params.numFactions,
        errors
      );
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

    // Minor factions.
    if (this._draftState.getOpaqueType() === "minorFactions") {
      const opaques: Array<string> = DraftActivityStart.getMinorFactions(
        this._draftState.getFactions()
      );
      this._draftState.setOpaques(opaques);
    }

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

      const countdownHours: number | undefined = params.countdownHours;
      if (countdownHours !== undefined) {
        TI4.timer.start(countdownHours * 60 * 60, -1);
      } else {
        TI4.timer.start(0, 1);
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
    if (DraftActivityStart._sharedUiElement !== undefined) {
      world.removeUIElement(DraftActivityStart._sharedUiElement);
      DraftActivityStart._sharedUiElement = undefined;
    }

    // Use a shared, in-world UI instead of per-player windows.
    const scale: number = 4;
    const ui = new UIElement();
    ui.scale = 1 / scale;
    ui.widget = new Border().setChild(
      new DraftStateUI(draftState, scale).getWidget()
    );
    ui.position = new Vector(0, 0, world.getTableHeight() + 3);
    world.addUI(ui);
    DraftActivityStart._sharedUiElement = ui;

    // Close window when draft state destroyed.
    this._draftState.onDraftStateChanged.add(() => {
      if (!draftState.isActive()) {
        world.removeUIElement(ui);
        DraftActivityStart._sharedUiElement = undefined;
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
