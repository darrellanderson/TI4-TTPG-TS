import {
  Color,
  HorizontalAlignment,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Widget,
} from "@tabletop-playground/api";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { BOX_H, BOX_W } from "../faction-ui/faction-ui";

const packageId: string = refPackageId;

/**
 * Twilight's Fall includes 3 faction reference numbers:
 * - speaker priority
 * - home system
 * - starting units
 *
 * This UI displays those 3 being selected (yes/no) for the owning player.
 * Unlike other draft UIs this one is not selectable, it just shows the
 * current state.
 *
 * Players right click faction reference cards to choose category.
 */
export class TfFactionRefsUI extends AbstractUI {
  private readonly _draftStateTF: DraftStateTF;
  private readonly _choiceIndex: number;

  private readonly _speakerPriority: ImageWidget = new ImageWidget();
  private readonly _homeSystem: ImageWidget = new ImageWidget();
  private readonly _startingUnits: ImageWidget = new ImageWidget();

  private readonly _onDraftStateChanged = (): void => {
    this._update();
  };

  constructor(scale: number, draftStateTF: DraftStateTF, choiceIndex: number) {
    const uiSize: UI_SIZE = {
      w: BOX_W * scale,
      h: BOX_H * scale,
    };
    const panel: HorizontalBox = new HorizontalBox().setChildDistance(
      7 * scale
    );
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(uiSize.w)
      .setOverrideHeight(uiSize.h)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setChild(panel);

    super(widget, uiSize);

    this._draftStateTF = draftStateTF;
    this._choiceIndex = choiceIndex;
    draftStateTF.onDraftStateChanged.add(this._onDraftStateChanged);

    const iconSize = Math.min(uiSize.h, uiSize.w / 3);

    this._speakerPriority
      .setImageSize(iconSize, iconSize)
      .setImage("icon/token/speaker-shape.png", packageId);
    panel.addChild(this._speakerPriority, 1);

    this._homeSystem
      .setImageSize(iconSize, iconSize)
      .setImage("tile/system/tile-000.png", packageId);

    panel.addChild(this._homeSystem, 1);

    this._startingUnits
      .setImageSize(iconSize, iconSize)
      .setImage("icon/unit/infantry.png", packageId);

    panel.addChild(this._startingUnits, 1);

    this._update();
  }

  /**
   * Color the icons if the player with the corresponding choice index has
   * selected the given Twilight's Fall faction reference number type.
   */
  _update(): void {
    this._speakerPriority.setTintColor([0, 0, 0, 1]);
    this._homeSystem.setTintColor([0, 0, 0, 1]);
    this._startingUnits.setTintColor([0, 0, 0, 1]);

    const playerSlot: number = this._draftStateTF.getOpaqueIndexToPlayerSlot(
      this._choiceIndex
    );
    const playerColor: Color | undefined =
      TI4.playerColor.getSlotWidgetColor(playerSlot);
    if (playerColor === undefined) {
      return; // no player has chosen this entry.
    }

    const speakerPriorityValue: number =
      this._draftStateTF.getSpeakerPriority(playerSlot);
    if (speakerPriorityValue !== -1) {
      this._speakerPriority.setTintColor(playerColor);
    }

    const homeSystemValue: number =
      this._draftStateTF.getHomeSystem(playerSlot);
    if (homeSystemValue !== -1) {
      this._homeSystem.setTintColor(playerColor);
    }

    const startingUnitsValue: number =
      this._draftStateTF.getStartingUnits(playerSlot);
    if (startingUnitsValue !== -1) {
      this._startingUnits.setTintColor(playerColor);
    }
  }
}
