"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScptDraftButtonUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * "YEAR" qual / prelim / semi / final.
 *
 * SCPT draft goes right to the draft.
 */
class ScptDraftButtonUI extends abtract_ui_1.AbstractUI {
    constructor(scale, scptDraftParams, onDraftStarted) {
        const size = {
            w: (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING) * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        const label = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setText(scptDraftParams.label);
        const labelBox = new api_1.LayoutBox()
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(label);
        const buttonQual = new api_1.Button()
            .setFontSize(fontSize)
            .setText("QUAL")
            .setEnabled(scptDraftParams.qual !== undefined);
        const buttonPrelim = new api_1.Button()
            .setFontSize(fontSize)
            .setText("PRELIM")
            .setEnabled(scptDraftParams.prelim !== undefined);
        const buttonSemi = new api_1.Button()
            .setFontSize(fontSize)
            .setText("SEMI")
            .setEnabled(scptDraftParams.semi !== undefined);
        const buttonFinal = new api_1.Button()
            .setFontSize(fontSize)
            .setText("FINAL")
            .setEnabled(scptDraftParams.final !== undefined);
        const confirmQual = new ttpg_darrell_1.ConfirmButton(buttonQual).getWidget();
        const confirmPrelim = new ttpg_darrell_1.ConfirmButton(buttonPrelim).getWidget();
        const confirmSemi = new ttpg_darrell_1.ConfirmButton(buttonSemi).getWidget();
        const confirmFinal = new ttpg_darrell_1.ConfirmButton(buttonFinal).getWidget();
        const panel = new api_1.HorizontalBox()
            .setChildDistance(config_1.CONFIG.SPACING * scale)
            .addChild(labelBox, 1.3)
            .addChild(confirmQual, 1)
            .addChild(confirmPrelim, 1)
            .addChild(confirmSemi, 1)
            .addChild(confirmFinal, 1);
        const panelBox = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(panel);
        super(panelBox, size);
        this._qualHandler = (_button, _player) => {
            const draftActivityStartParams = this._scptDraftParams.qual;
            if (draftActivityStartParams) {
                this._onDraftStarted.trigger();
                TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
            }
        };
        this._prelimHandler = (_button, _player) => {
            const draftActivityStartParams = this._scptDraftParams.prelim;
            if (draftActivityStartParams) {
                this._onDraftStarted.trigger();
                TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
            }
        };
        this._semiHandler = (_button, _player) => {
            const draftActivityStartParams = this._scptDraftParams.semi;
            if (draftActivityStartParams) {
                this._onDraftStarted.trigger();
                TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
            }
        };
        this._finalHandler = (_button, _player) => {
            const draftActivityStartParams = this._scptDraftParams.final;
            if (draftActivityStartParams) {
                this._onDraftStarted.trigger();
                TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
            }
        };
        this._scptDraftParams = scptDraftParams;
        this._onDraftStarted = onDraftStarted;
        buttonQual.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(this._qualHandler).get());
        buttonPrelim.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(this._prelimHandler).get());
        buttonSemi.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(this._semiHandler).get());
        buttonFinal.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(this._finalHandler).get());
    }
}
exports.ScptDraftButtonUI = ScptDraftButtonUI;
//# sourceMappingURL=scpt-draft-button-ui.js.map