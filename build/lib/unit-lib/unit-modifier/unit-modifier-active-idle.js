"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitModifierActiveIdle = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UnitModifierActiveIdle {
    static isActive(obj) {
        const value = obj.getSavedData(UnitModifierActiveIdle.ACTIVE_KEY);
        return value === "true";
    }
    static setActive(obj, active) {
        const value = active ? "true" : "false";
        obj.setSavedData(value, UnitModifierActiveIdle.ACTIVE_KEY);
    }
    init() {
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card) => {
            this._maybeAddActiveIdleButton(card);
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card, oldNsid) => {
            this._maybeRemoveActiveIdleButton(card, oldNsid);
        });
    }
    _maybeAddActiveIdleButton(card) {
        const nsid = ttpg_darrell_1.NSID.get(card);
        const unitModifier = TI4.unitModifierRegistry.getByNsid(nsid);
        if (unitModifier && unitModifier.isActiveIdle()) {
            // Careful not to add button twice.
            this._maybeRemoveActiveIdleButton(card, nsid);
            const button = new api_1.Button().setFontSize(10).setText("<?>");
            // Apply current state.
            const updateButton = () => {
                const text = UnitModifierActiveIdle.isActive(card)
                    ? "Active"
                    : "Idle";
                button.setText(text);
            };
            updateButton();
            // Click to toggle and update state.
            button.onClicked.add(() => {
                const toggled = !UnitModifierActiveIdle.isActive(card);
                UnitModifierActiveIdle.setActive(card, toggled);
                updateButton();
            });
            const ui = new api_1.UIElement();
            ui.widget = button;
            const extent = card.getExtent(false, false);
            ui.position = new api_1.Vector(-extent.x, 0, -extent.z - 0.1);
            ui.rotation = new api_1.Rotator(180, 180, 0);
            card.addUI(ui);
        }
    }
    _maybeRemoveActiveIdleButton(deck, oldNsid) {
        const unitModifier = TI4.unitModifierRegistry.getByNsid(oldNsid);
        if (unitModifier && unitModifier.isActiveIdle()) {
            // Don't be clever (yet), just remove all UI.
            for (const ui of deck.getUIs()) {
                deck.removeUIElement(ui);
            }
        }
    }
}
exports.UnitModifierActiveIdle = UnitModifierActiveIdle;
UnitModifierActiveIdle.ACTIVE_KEY = "isActive";
//# sourceMappingURL=unit-modifier-active-idle.js.map