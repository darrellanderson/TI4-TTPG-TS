"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeleresUI = exports.KeleresFlavorButton = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const faction_ui_1 = require("./faction-ui");
const wrapped_clickable_ui_1 = require("../../wrapped-clickable-ui/wrapped-clickable-ui");
const abstract_wrapped_clickable_ui_1 = require("../../wrapped-clickable-ui/abstract-wrapped-clickable-ui");
const resolve_conflicts_keleres_1 = require("../../../lib/draft-lib/resolve-conflicts/resolve-conflicts-keleres");
/**
 * Export for testing, not normally used externally.
 */
class KeleresFlavorButton {
    static _getKeleresIndex(draftState) {
        return draftState.getFactions().findIndex((faction) => {
            return faction.getNsid().startsWith("faction:codex.vigil/keleres");
        });
    }
    constructor(draftState, flavor, w, h) {
        /**
         * Switch the keleres faction to this flavor.
         *
         * @param _contentButton
         * @param _player
         */
        this._onClicked = new ttpg_darrell_1.ThrottleClickHandler((_contentButton, _player) => {
            const keleresIndex = KeleresFlavorButton._getKeleresIndex(this._draftState);
            const factions = this._draftState.getFactions();
            if (keleresIndex >= 0 && factions[keleresIndex] !== this._faction) {
                factions[keleresIndex] = this._faction;
                this._draftState.setFactions(factions);
            }
        }).get();
        this._draftState = draftState;
        this._faction = TI4.factionRegistry.getByNsidOrThrow(`faction:codex.vigil/keleres-${flavor}`);
        const fontSize = h * 0.5;
        this._fg = new api_1.Text()
            .setBold(true)
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setText(flavor.toUpperCase());
        const fgBox = new api_1.LayoutBox()
            .setOverrideWidth(w)
            .setOverrideHeight(h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(this._fg);
        this._bg = new api_1.Border().setChild(fgBox);
        // Create a ContentButton with the flavor text.
        // Strip off ContentButton added edges; cannot use LayoutBox negative
        // padding because it will be in another Canvas and bleed, but wrap
        // in a second Canvas to enforce the size/trim.
        this._button = new api_1.ContentButton().setChild(this._bg);
        this._widget = new api_1.Canvas().addChild(this._button, -4, -4, w + 8, h + 8);
        this._button.onClicked.add(this._onClicked);
    }
    /**
     * Update the button color to reflect if this is the active flavor.
     * This only updates the local widget attributes, never touches
     * the draft state (to avoid infinite update loops).
     */
    update() {
        const keleresIndex = KeleresFlavorButton._getKeleresIndex(this._draftState);
        const activeFaction = this._draftState.getFactions()[keleresIndex];
        if (activeFaction) {
            const isActive = this._faction === activeFaction;
            const colorActive = new api_1.Color(0, 0, 0, 1);
            const colorPassive = new api_1.Color(1, 1, 1, 1);
            const fg = isActive ? colorActive : colorPassive;
            const bg = isActive ? colorPassive : colorActive;
            this._fg.setTextColor(fg);
            this._bg.setColor(bg);
        }
        // Enable if an available flavor.
        const availableFlavors = resolve_conflicts_keleres_1.ResolveConflictsKeleres.getAvailableFlavors(this._draftState);
        const isEnabled = availableFlavors.includes(this._faction);
        this._button.setEnabled(isEnabled);
    }
}
exports.KeleresFlavorButton = KeleresFlavorButton;
/**
 * Keleres has three flavors, based on Argent, Mentak, and Xxcha.
 *
 * Flavors are available so long as the corresponding actual faction
 * has not been selected.
 *
 * Use the "wrapped clickable ui" size because cannot have buttons
 * inside a content button.
 */
class KeleresUI extends abstract_wrapped_clickable_ui_1.AbstractWrappedClickableUI {
    destroy() {
        this._draftState.onDraftStateChanged.remove(this._onDraftStateChanged);
    }
    getContentButton() {
        return this._contentButton;
    }
    getBorder() {
        return this._border;
    }
    constructor(draftState, scale) {
        // Use the same size as a "regular" faction button.
        const dummyFaction = TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec");
        const dummyFactionUi = new faction_ui_1.FactionUI(dummyFaction, scale);
        const dummyWrappedUi = new wrapped_clickable_ui_1.WrappedClickableUI(dummyFactionUi, scale);
        const size = dummyWrappedUi.getSize();
        const fontSize = faction_ui_1.FONT_SIZE * scale;
        const borderWidth = wrapped_clickable_ui_1.WRAPPED_BORDER_WIDTH * scale;
        // This one is complicated, use a canvas for more positional control.
        const canvas = new api_1.Canvas();
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(canvas);
        super(box, size);
        this._border = new api_1.Border();
        this._flavorButtons = [];
        this._onDraftStateChanged = () => {
            // Update the flavor buttons.
            this._flavorButtons.forEach((flavorButton) => flavorButton.update());
        };
        this._draftState = draftState;
        this._draftState.onDraftStateChanged.add(this._onDraftStateChanged);
        // Now fill in the canvas.
        const reserveW = size.w * 0.45;
        // Label, skip the icon for the reduced size.
        const nameW = size.w - reserveW - borderWidth * 2;
        const nameH = size.h - borderWidth * 2;
        const name = new api_1.Text()
            .setBold(true)
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setText("Keleres".toUpperCase());
        const nameBox = new api_1.LayoutBox()
            .setOverrideWidth(nameW)
            .setOverrideHeight(nameH)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(name);
        this._contentButton = new api_1.ContentButton().setChild(nameBox);
        const flavorLeft = size.w - reserveW;
        const flavorH = size.h / 3;
        const argent = new KeleresFlavorButton(draftState, "argent", reserveW, flavorH);
        const mentak = new KeleresFlavorButton(draftState, "mentak", reserveW, flavorH);
        const xxcha = new KeleresFlavorButton(draftState, "xxcha", reserveW, flavorH);
        this._flavorButtons.push(argent, mentak, xxcha);
        this._flavorButtons.forEach((flavorButton) => {
            flavorButton.update();
        });
        canvas.addChild(argent._widget, flavorLeft, 0, reserveW, flavorH);
        canvas.addChild(mentak._widget, flavorLeft, flavorH, reserveW, flavorH);
        canvas.addChild(xxcha._widget, flavorLeft, flavorH * 2, reserveW, flavorH);
        // Add left button last to draw on top of flavor bleed left.
        canvas.addChild(this._border, 0, 0, size.w - reserveW, size.h);
        canvas.addChild(this._contentButton, borderWidth, borderWidth, nameW, nameH);
    }
}
exports.KeleresUI = KeleresUI;
//# sourceMappingURL=keleres-ui.js.map