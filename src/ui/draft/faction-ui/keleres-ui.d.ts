import { Border, ContentButton, Player, Widget } from "@tabletop-playground/api";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { AbstractWrappedClickableUI } from "../../wrapped-clickable-ui/abstract-wrapped-clickable-ui";
type KeleresFlavor = "argent" | "mentak" | "xxcha";
/**
 * Export for testing, not normally used externally.
 */
export declare class KeleresFlavorButton {
    private readonly _draftState;
    private readonly _faction;
    private readonly _fg;
    private readonly _bg;
    private readonly _button;
    readonly _widget: Widget;
    /**
     * Switch the keleres faction to this flavor.
     *
     * @param _contentButton
     * @param _player
     */
    _onClicked: (button: ContentButton, player: Player) => void;
    static _getKeleresIndex(draftState: DraftState): number;
    constructor(draftState: DraftState, flavor: KeleresFlavor, w: number, h: number);
    /**
     * Update the button color to reflect if this is the active flavor.
     * This only updates the local widget attributes, never touches
     * the draft state (to avoid infinite update loops).
     */
    update(): void;
}
/**
 * Keleres has three flavors, based on Argent, Mentak, and Xxcha.
 *
 * Flavors are available so long as the corresponding actual faction
 * has not been selected.
 *
 * Use the "wrapped clickable ui" size because cannot have buttons
 * inside a content button.
 */
export declare class KeleresUI extends AbstractWrappedClickableUI {
    private readonly _contentButton;
    private readonly _border;
    private readonly _draftState;
    private readonly _flavorButtons;
    private readonly _onDraftStateChanged;
    destroy(): void;
    getContentButton(): ContentButton;
    getBorder(): Border;
    constructor(draftState: DraftState, scale: number);
}
export {};
