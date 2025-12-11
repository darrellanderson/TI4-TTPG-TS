import { Button, Color, ContentButton, Player } from "@tabletop-playground/api";
import { Broadcast, ColorLib, ThrottleClickHandler } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { DraftActivityFinish } from "../../../lib/draft-lib/draft-activity-finish/draft-activity-finish";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { FactionUI } from "../faction-ui/faction-ui";
import { GridUIBuilder } from "../../panel/grid-ui-builder";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import {
  SliceShape,
  SliceTiles,
} from "../../../lib/draft-lib/generate-slices/generate-slices";
import { SliceUI } from "../slice-ui/slice-ui";
import { WrappedClickableUI } from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { CreateZoomedUiType, ZoomableUI } from "../../zoomable-ui/zoomable-ui";
import { AbstractWrappedClickableUI } from "../../wrapped-clickable-ui/abstract-wrapped-clickable-ui";
import { ConfirmButtonUI } from "../../button-ui/confirm-button-ui";
import { OpaqueUI } from "../opaque-ui/opaque-ui";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";

const SPACING: number = 12;

const COLORS: Array<string> = [
  "#F0F0F0", // white
  "#00CFFF", // blue
  "#572780", // purple
  "#D7B700", // yellow
  "#FF1010", // red
  "#00FF00", // green
  "#F46FCD", // pink
  "#FC6A03", // orange
  "#6E260E", // brown
];

// Draft UI moved to world with a large scale, undo it for zoomed elements.
const EXTRA_SCALE: number = 0.25;

export class DraftStateTfUI extends AbstractUI {
  private readonly _draftState: DraftStateTF;
  private readonly _onDraftStateChangedHandler: () => void;

  static _maybeAdvanceTurn = (player: Player): void => {
    const playerSlot: number = player.getSlot();
    if (TI4.turnOrder.getCurrentTurn() === playerSlot) {
      TI4.turnOrder.nextTurn();
    }
  };

  static _createSliceClickHandler(
    draftState: DraftStateTF,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    const handler = (_button: ContentButton, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const currentSlot: number =
        draftState.getSliceIndexToPlayerSlot(sliceIndex);
      if (currentSlot === -1) {
        // If there was a different candidate selected, clear it.
        for (let i = 0; i < draftState.getSlices().length; i++) {
          if (draftState.getSliceIndexToPlayerSlot(i) === playerSlot) {
            draftState.setSliceIndexToPlayerSlot(i, -1);
          }
        }

        // Select this candidate.
        draftState.setSliceIndexToPlayerSlot(sliceIndex, playerSlot);
        DraftStateTfUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setSliceIndexToPlayerSlot(sliceIndex, -1);
      }
    };
    return new ThrottleClickHandler<ContentButton>(handler).get();
  }

  static _createFactionClickHandler(
    draftState: DraftState,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    const handler = (_button: ContentButton, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const currentSlot: number =
        draftState.getFactionIndexToPlayerSlot(sliceIndex);
      if (currentSlot === -1) {
        // If there was a different candidate selected, clear it.
        for (let i = 0; i < draftState.getFactions().length; i++) {
          if (draftState.getFactionIndexToPlayerSlot(i) === playerSlot) {
            draftState.setFactionIndexToPlayerSlot(i, -1);
          }
        }

        // Select this candidate.
        draftState.setFactionIndexToPlayerSlot(sliceIndex, playerSlot);
        DraftStateTfUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setFactionIndexToPlayerSlot(sliceIndex, -1);
      }
    };
    return new ThrottleClickHandler<ContentButton>(handler).get();
  }

  static _createSeatClickHandler(
    draftState: DraftState,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    const handler = (_button: ContentButton, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const currentSlot: number =
        draftState.getSeatIndexToPlayerSlot(sliceIndex);
      if (currentSlot === -1) {
        // If there was a different candidate selected, clear it.
        for (let i = 0; i < TI4.config.playerCount; i++) {
          if (draftState.getSeatIndexToPlayerSlot(i) === playerSlot) {
            draftState.setSeatIndexToPlayerSlot(i, -1);
          }
        }

        // Select this candidate.
        draftState.setSeatIndexToPlayerSlot(sliceIndex, playerSlot);
        DraftStateTfUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setSeatIndexToPlayerSlot(sliceIndex, -1);
      }
    };
    return new ThrottleClickHandler<ContentButton>(handler).get();
  }

  static _createOpaqueClickHandler(
    draftState: DraftState,
    opaqueIndex: number
  ): (_button: ContentButton, player: Player) => void {
    const handler = (_button: ContentButton, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const currentSlot: number =
        draftState.getOpaqueIndexToPlayerSlot(opaqueIndex);
      if (currentSlot === -1) {
        // If there was a different candidate selected, clear it.
        for (let i = 0; i < draftState.getOpaques().length; i++) {
          if (draftState.getOpaqueIndexToPlayerSlot(i) === playerSlot) {
            draftState.setOpaqueToPlayerSlot(i, -1);
          }
        }

        // Select this candidate.
        draftState.setOpaqueToPlayerSlot(opaqueIndex, playerSlot);
        DraftStateTfUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setOpaqueToPlayerSlot(opaqueIndex, -1);
      }
    };
    return new ThrottleClickHandler<ContentButton>(handler).get();
  }

  static _createFinishClickHandler(
    draftState: DraftState
  ): (button: Button, player: Player) => void {
    const handler = (_button: Button, _player: Player): void => {
      Broadcast.chatAll(`Draft finished by ${_player.getName()}`);
      new DraftActivityFinish(draftState).finishAll();
    };
    return new ThrottleClickHandler<Button>(handler).get();
  }

  static _createCancelClickHandler(
    draftState: DraftState
  ): (button: Button, player: Player) => void {
    const handler = (_button: Button, _player: Player): void => {
      Broadcast.chatAll(`Draft cancelled by ${_player.getName()}`);
      draftState.destroy();
    };
    return new ThrottleClickHandler<Button>(handler).get();
  }

  static _getCreateZoomedSliceUi = (
    slice: SliceTiles,
    sliceShape: SliceShape,
    color: Color
  ): CreateZoomedUiType => {
    return (scale: number): AbstractUI => {
      return new SliceUI(slice, sliceShape, color, scale * 3.5 * EXTRA_SCALE);
    };
  };

  static _createZoomedOpaqueUi = (
    draftState: DraftState,
    opaque: string
  ): CreateZoomedUiType => {
    return (scale: number): AbstractUI => {
      return new OpaqueUI(opaque, -1, draftState, scale * 3.5 * EXTRA_SCALE);
    };
  };

  static _getSliceColorOrThrow = (index: number): Color => {
    const colorString: string | undefined = COLORS[index];
    if (!colorString) {
      throw new Error(`Missing color for index ${index}`);
    }
    return new ColorLib().parseColorOrThrow(colorString);
  };

  constructor(draftState: DraftStateTF, scale: number) {
    const sliceLabels: Array<string> = draftState.getSliceLabels();
    const zoomableSliceButtons: Array<AbstractUI> = [];
    const sliceButtons: Array<WrappedClickableUI> = draftState
      .getSlices()
      .map((slice: SliceTiles, index: number) => {
        const sliceShape: SliceShape = draftState.getSliceShape(-1);
        const color: Color = DraftStateTfUI._getSliceColorOrThrow(index);
        const sliceUi: SliceUI = new SliceUI(slice, sliceShape, color, scale);
        const label: string | undefined = sliceLabels[index];
        if (label) {
          sliceUi.setLabel(label);
        }
        const clickable = new WrappedClickableUI(sliceUi, scale);
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateTfUI._createSliceClickHandler(draftState, index)
          );

        const createZoomedUi: CreateZoomedUiType =
          DraftStateTfUI._getCreateZoomedSliceUi(slice, sliceShape, color);
        const zoomableSliceButton = new ZoomableUI(
          clickable,
          scale,
          createZoomedUi
        );
        zoomableSliceButtons.push(zoomableSliceButton);

        return clickable;
      });
    const sliceGrid: AbstractUI = new GridUIBuilder()
      .addUIs(zoomableSliceButtons)
      .setMaxRows(3)
      .setSpacing(SPACING * scale)
      .build();

    const factionButtons: Array<AbstractWrappedClickableUI> = draftState
      .getFactions()
      .map((faction: Faction, index: number) => {
        const factionUi: AbstractUI = new FactionUI(faction, scale);
        const clickable: AbstractWrappedClickableUI = new WrappedClickableUI(
          factionUi,
          scale
        );
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateTfUI._createFactionClickHandler(draftState, index)
          );
        return clickable;
      });
    const factionGrid: AbstractUI = new GridUIBuilder()
      .addUIs(factionButtons)
      .setMaxRows(9)
      .setSpacing(SPACING * scale)
      .build();

    // Opques are TF faction refeference state.
    const opaqueButtons: Array<WrappedClickableUI> = [];
    const opaqueType: string | null = draftState.getOpaqueType();
    for (let index = 0; index < draftState.getOpaques().length; index++) {
      const opaque: string | undefined = draftState.getOpaques()[index];
      if (opaque && opaqueType !== null) {
        const opaqueUi: AbstractUI = new OpaqueUI(
          opaque,
          index,
          draftState,
          scale
        );
        const clickable = new WrappedClickableUI(opaqueUi, scale);
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateTfUI._createOpaqueClickHandler(draftState, index)
          );
        opaqueButtons.push(clickable);
      }
    }
    const tfFactionRefsGrid: AbstractUI = new GridUIBuilder()
      .addUIs(opaqueButtons)
      .setSpacing(SPACING * scale)
      .setMaxRows(9)
      .build();

    const finishDraftButton: ButtonUI = new ButtonUI(scale);
    finishDraftButton.getButton().setText("Finish");
    finishDraftButton
      .getButton()
      .onClicked.add(DraftStateTfUI._createFinishClickHandler(draftState));

    const cancelButton: ButtonUI = new ButtonUI(scale);
    cancelButton.getButton().setText("Cancel");
    cancelButton
      .getButton()
      .onClicked.add(DraftStateTfUI._createCancelClickHandler(draftState));
    const confirmCancelButton: AbstractUI = new ConfirmButtonUI(cancelButton);

    const finishAndCancelButtons: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(SPACING * scale)
      .addUIs([finishDraftButton, confirmCancelButton])
      .build();

    const panelUis: Array<AbstractUI> = [
      sliceGrid,
      factionGrid,
      tfFactionRefsGrid,
      finishAndCancelButtons,
    ];

    const panel: AbstractUI = new HorizontalUIBuilder()
      .addUIs(panelUis)
      .setPadding(SPACING * scale)
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());

    this._draftState = draftState;
    this._onDraftStateChangedHandler = (): void => {
      sliceButtons.forEach(
        (button: WrappedClickableUI, index: number): void => {
          const playerSlot: number =
            draftState.getSliceIndexToPlayerSlot(index);
          button.setOwningPlayerSlot(playerSlot);
        }
      );
      factionButtons.forEach(
        (button: AbstractWrappedClickableUI, index: number): void => {
          const playerSlot: number =
            draftState.getFactionIndexToPlayerSlot(index);
          button.setOwningPlayerSlot(playerSlot);
        }
      );
      opaqueButtons.forEach(
        (button: WrappedClickableUI, index: number): void => {
          const playerSlot: number =
            draftState.getOpaqueIndexToPlayerSlot(index);
          button.setOwningPlayerSlot(playerSlot);
        }
      );
      finishDraftButton.getButton().setEnabled(draftState.isComplete());
    };

    draftState.onDraftStateChanged.add(this._onDraftStateChangedHandler);
    this._onDraftStateChangedHandler();
  }

  destroy(): void {
    super.destroy();
    this._draftState.onDraftStateChanged.remove(
      this._onDraftStateChangedHandler
    );
  }
}
