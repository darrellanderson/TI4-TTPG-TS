"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftActivityStart = exports.DraftActivityMaybeResume = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_window_1 = require("../../../ui/abstract-window/abstract-window");
const draft_state_1 = require("../draft-state/draft-state");
const draft_state_ui_1 = require("../../../ui/draft/draft-state-ui/draft-state-ui");
const generate_slices_1 = require("../generate-slices/generate-slices");
const generate_factions_1 = require("../generate-factions/generate-factions");
const parse_slices_1 = require("../parse/parse-slices");
const parse_labels_1 = require("../parse/parse-labels");
const parse_factions_1 = require("../parse/parse-factions");
const resolve_conflicts_keleres_1 = require("../resolve-conflicts/resolve-conflicts-keleres");
const draft_activity_start_params_1 = require("./draft-activity-start-params");
const parse_base_map_1 = require("../parse/parse-base-map");
const map_string_parser_1 = require("../../map-string-lib/map-string/map-string-parser");
class DraftActivityMaybeResume {
    init() {
        if (draft_state_1.DraftState.isDraftInProgress(draft_activity_start_params_1.DRAFT_NAMESPACE_ID)) {
            new DraftActivityStart().resume();
        }
    }
}
exports.DraftActivityMaybeResume = DraftActivityMaybeResume;
/**
 * Start (or resume) a draft activity.
 * Load draft information from a config string, or generate it.
 * Create UI.
 */
class DraftActivityStart {
    static getOrGenerateSlices(config, numSlices, generateSlicesParams, blacklistSystemTileNumbers, errors) {
        const sliceSize = generateSlicesParams.sliceShape.length - 1;
        let slices = new parse_slices_1.ParseSlices(sliceSize).parseSlices(config, errors);
        if (slices === undefined) {
            slices = new generate_slices_1.GenerateSlices(generateSlicesParams)
                .setBlacklistSystemTileNumbers(blacklistSystemTileNumbers)
                .generateSlices(numSlices);
        }
        return slices;
    }
    static getSliceLabels(config) {
        return new parse_labels_1.ParseLabels().parseLabels(config);
    }
    static getOrGenerateFactions(config, numFactions, errors) {
        let factions = new parse_factions_1.ParseFactions().parseFactions(config, errors);
        if (factions === undefined) {
            factions = new generate_factions_1.GenerateFactions().generate(numFactions);
        }
        return factions;
    }
    static getBaseMap(config, errors) {
        const baseMap = new parse_base_map_1.ParseBaseMap().parseBaseMap(config, errors);
        return baseMap;
    }
    getDraftState() {
        return this._draftState;
    }
    start(params, errors) {
        this._draftState = params.draft.createEmptyDraftState(draft_activity_start_params_1.DRAFT_NAMESPACE_ID);
        // Base map.
        const baseMap = DraftActivityStart.getBaseMap(params.config, errors);
        if (baseMap !== undefined) {
            this._draftState.setBaseMap(baseMap);
        }
        // Slices.
        const blacklistSystemTileNumbers = new map_string_parser_1.MapStringParser()
            .parse(this._draftState.getBaseMap(), [])
            .map((mapStringEntry) => mapStringEntry.tile);
        const sliceParams = params.draft.getGenerateSlicesParams();
        const slices = DraftActivityStart.getOrGenerateSlices(params.config, params.numSlices, sliceParams, blacklistSystemTileNumbers, errors);
        this._draftState.setSlices(slices);
        if (this._draftState.getSlices().length < TI4.config.playerCount) {
            errors.push(`Slice count (${this._draftState.getSlices().length}) is less than player count (${TI4.config.playerCount})`);
        }
        // Slice labels.
        const labels = DraftActivityStart.getSliceLabels(params.config);
        if (labels !== undefined) {
            this._draftState.setSliceLabels(labels);
        }
        // Factions.
        const factions = DraftActivityStart.getOrGenerateFactions(params.config, params.numFactions, errors);
        this._draftState.setFactions(factions);
        if (this._draftState.getFactions().length < TI4.config.playerCount) {
            errors.push(`Faction count (${this._draftState.getFactions().length}) is less than player count (${TI4.config.playerCount})`);
        }
        const speakerIndex = Math.floor(Math.random() * TI4.config.playerCount);
        this._draftState.setSpeakerIndex(speakerIndex);
        const success = errors.length === 0;
        if (success) {
            // Set turn order.
            const playerSlots = TI4.playerSeats
                .getAllSeats()
                .map((seat) => seat.playerSlot);
            const order = new ttpg_darrell_1.Shuffle().shuffle(playerSlots);
            const direction = "snake";
            const first = order[0];
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
    resume() {
        try {
            this._resume();
        }
        catch (e) {
            // Something went wrong, erase the draft in progress.
            api_1.world.setSavedData("", draft_activity_start_params_1.DRAFT_NAMESPACE_ID);
            throw e;
        }
        return this;
    }
    _resume() {
        if (!draft_state_1.DraftState.isDraftInProgress(draft_activity_start_params_1.DRAFT_NAMESPACE_ID)) {
            throw new Error("Draft not in progress");
        }
        const draftState = new draft_state_1.DraftState(draft_activity_start_params_1.DRAFT_NAMESPACE_ID);
        this._draftState = draftState;
        const resolveConflictsKeleres = new resolve_conflicts_keleres_1.ResolveConflictsKeleres(draftState);
        this._draftState.onDraftStateChanged.add(() => {
            resolveConflictsKeleres.resolve();
        });
        const create = (params) => {
            return new draft_state_ui_1.DraftStateUI(draftState, params.scale);
        };
        const namespaceId = "@TI4/draft-window";
        const windowTitle = "Draft";
        const abstractWindow = new abstract_window_1.AbstractWindow(create, namespaceId, windowTitle);
        abstractWindow.addHost().getMutableWindowParams().disableClose = true;
        const window = abstractWindow.createWindow();
        window.attach();
        // Close window when draft state destroyed.
        this._draftState.onDraftStateChanged.add(() => {
            if (!draftState.isActive()) {
                window.detach();
            }
        });
        return this;
    }
    destroy() {
        if (this._draftState) {
            this._draftState.destroy();
            this._draftState = undefined;
        }
    }
}
exports.DraftActivityStart = DraftActivityStart;
//# sourceMappingURL=draft-activity-start.js.map