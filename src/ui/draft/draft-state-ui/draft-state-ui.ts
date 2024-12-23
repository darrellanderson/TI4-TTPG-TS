import {
  Color,
  ContentButton,
  HorizontalAlignment,
  Player,
} from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import {
  DraftToMapString,
  MapStringAndHexToPlayerName,
} from "../../../lib/draft-lib/draft-to-map-string/draft-to-map-string";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { FactionUI } from "../faction-ui/faction-ui";
import { GridUIBuilder } from "../../panel/grid-ui-builder";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { MapUI } from "../../map-ui/map-ui";
import { SeatUI } from "../seat-ui/seat-ui";
import {
  SliceShape,
  SliceTiles,
} from "../../../lib/draft-lib/generate-slices/generate-slices";
import { SliceUI } from "../slice-ui/slice-ui";
import { TurnOrderMini } from "../../turn-order-mini/turn-order-mini";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { WrappedClickableUI } from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { CreateZoomedUiType, ZoomableUI } from "../../zoomable-ui/zoomable-ui";

const SPACING: number = 12;

export class DraftStateUI extends AbstractUI {
  private readonly _draftState: DraftState;
  private readonly _onDraftStateChangedHandler: () => void;

  static _maybeAdvanceTurn = (player: Player): void => {
    const playerSlot: number = player.getSlot();
    if (TI4.turnOrder.getCurrentTurn() === playerSlot) {
      TI4.turnOrder.nextTurn();
    }
  };

  static _createSliceClickHandler(
    draftState: DraftState,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    return (_button: ContentButton, player: Player): void => {
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
        DraftStateUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setSliceIndexToPlayerSlot(sliceIndex, -1);
      }
    };
  }

  static _createFactionClickHandler(
    draftState: DraftState,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    return (_button: ContentButton, player: Player): void => {
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
        DraftStateUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setFactionIndexToPlayerSlot(sliceIndex, -1);
      }
    };
  }

  static _createSeatClickHandler(
    draftState: DraftState,
    sliceIndex: number
  ): (_button: ContentButton, player: Player) => void {
    return (_button: ContentButton, player: Player): void => {
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
        DraftStateUI._maybeAdvanceTurn(player);
      } else if (currentSlot === playerSlot) {
        draftState.setSeatIndexToPlayerSlot(sliceIndex, -1);
      }
    };
  }

  static _getCreateZoomedSliceUi = (
    slice: SliceTiles,
    sliceShape: SliceShape,
    color: Color
  ): CreateZoomedUiType => {
    return (scale: number): AbstractUI => {
      return new SliceUI(slice, sliceShape, color, scale * 3.5);
    };
  };

  static _getCreatedZoomedMapUi = (
    draftState: DraftState
  ): CreateZoomedUiType => {
    return (scale: number): AbstractUI => {
      const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
        DraftToMapString.fromDraftState(draftState);
      const mapString: string = mapStringAndHexToPlayerName.mapString;
      const hexToLabel: Map<HexType, string> =
        mapStringAndHexToPlayerName.hexToPlayerName;
      return new MapUI(mapString, hexToLabel, scale * 2);
    };
  };

  constructor(draftState: DraftState, scale: number) {
    const sliceLabels: Array<string> = draftState.getSliceLabels();
    const zoomableSliceButtons: Array<AbstractUI> = [];
    const sliceButtons: Array<WrappedClickableUI> = draftState
      .getSlices()
      .map((slice: SliceTiles, index: number) => {
        const sliceShape: SliceShape = draftState.getSliceShape(-1);
        const color: Color = new Color(1, 0, 0, 1);
        const sliceUi: SliceUI = new SliceUI(slice, sliceShape, color, scale);
        const label: string | undefined = sliceLabels[index];
        if (label) {
          sliceUi.setLabel(label);
        }
        const clickable = new WrappedClickableUI(sliceUi, scale);
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateUI._createSliceClickHandler(draftState, index)
          );

        const createZoomedUi: CreateZoomedUiType =
          DraftStateUI._getCreateZoomedSliceUi(slice, sliceShape, color);
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

    const factionButtons: Array<WrappedClickableUI> = draftState
      .getFactions()
      .map((faction: Faction, index: number) => {
        const factionUi: AbstractUI = new FactionUI(faction, scale);
        const clickable = new WrappedClickableUI(factionUi, scale);
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateUI._createFactionClickHandler(draftState, index)
          );
        return clickable;
      });
    const factionGrid: AbstractUI = new GridUIBuilder()
      .addUIs(factionButtons)
      .setMaxRows(9)
      .setSpacing(SPACING * scale)
      .build();

    const speakerSeatIndex: number = draftState.getSpeakerIndex();
    const seatButtons: Array<WrappedClickableUI> = [];
    for (let index = 0; index < TI4.config.playerCount; index++) {
      const seatUi: AbstractUI = new SeatUI(index, speakerSeatIndex, scale);
      const clickable = new WrappedClickableUI(seatUi, scale);
      clickable
        .getContentButton()
        .onClicked.add(DraftStateUI._createSeatClickHandler(draftState, index));
      seatButtons.push(clickable);
    }
    const seatGrid: AbstractUI = new GridUIBuilder()
      .addUIs(seatButtons)
      .setMaxRows(9)
      .setSpacing(SPACING * scale)
      .build();

    const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
      DraftToMapString.fromDraftState(draftState);
    const mapString: string = mapStringAndHexToPlayerName.mapString;
    const hexToLabel: Map<HexType, string> =
      mapStringAndHexToPlayerName.hexToPlayerName;
    const mapUi: MapUI = new MapUI(mapString, hexToLabel, scale);

    // Add zoom button.
    const createZoomedMapUi: CreateZoomedUiType =
      DraftStateUI._getCreatedZoomedMapUi(draftState);
    const zoomableMapUi: ZoomableUI = new ZoomableUI(
      mapUi,
      scale,
      createZoomedMapUi
    );

    // Turn order.
    const turnOrderMini: AbstractUI = new TurnOrderMini(scale);

    const mapOverTurnOrder: AbstractUI = new VerticalUIBuilder()
      .setSpacing(SPACING * scale)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .addUIs([zoomableMapUi, turnOrderMini])
      .build();

    const panel: AbstractUI = new HorizontalUIBuilder()
      .addUIs([sliceGrid, factionGrid, seatGrid, mapOverTurnOrder])
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
        (button: WrappedClickableUI, index: number): void => {
          const playerSlot: number =
            draftState.getFactionIndexToPlayerSlot(index);
          button.setOwningPlayerSlot(playerSlot);
        }
      );
      seatButtons.forEach((button: WrappedClickableUI, index: number): void => {
        const playerSlot: number = draftState.getSeatIndexToPlayerSlot(index);
        button.setOwningPlayerSlot(playerSlot);
      });

      const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
        DraftToMapString.fromDraftState(draftState);
      const mapString: string = mapStringAndHexToPlayerName.mapString;
      const hexToLabel: Map<HexType, string> =
        mapStringAndHexToPlayerName.hexToPlayerName;
      mapUi.update(mapString, hexToLabel);
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
