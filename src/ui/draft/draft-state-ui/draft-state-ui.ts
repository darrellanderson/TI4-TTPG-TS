import { Color, ContentButton, Player } from "@tabletop-playground/api";
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
import { WrappedClickableUI } from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { ZoomableUI } from "../../zoomable-ui/zoomable-ui";

const SPACING: number = 12;

export class DraftStateUI extends AbstractUI {
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
      } else if (currentSlot === playerSlot) {
        draftState.setSeatIndexToPlayerSlot(sliceIndex, -1);
      }
    };
  }

  static _createZoomecUi = (
    slice: SliceTiles,
    sliceShape: SliceShape,
    color: Color,
    scale: number
  ): AbstractUI => {
    return new SliceUI(slice, sliceShape, color, scale * 4);
  };

  constructor(draftState: DraftState, scale: number) {
    const sliceShape: SliceShape = draftState.getSliceShape();
    const zoomableSliceButtons: Array<AbstractUI> = [];
    const sliceButtons: Array<WrappedClickableUI> = draftState
      .getSlices()
      .map((slice: SliceTiles, index: number) => {
        const color: Color = new Color(1, 0, 0, 1);
        const sliceUi: AbstractUI = new SliceUI(
          slice,
          sliceShape,
          color,
          scale
        );
        const clickable = new WrappedClickableUI(sliceUi, scale);
        clickable
          .getContentButton()
          .onClicked.add(
            DraftStateUI._createSliceClickHandler(draftState, index)
          );

        const createZoomedUi = (): AbstractUI => {
          return new SliceUI(slice, sliceShape, color, scale * 4);
        };
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
      .setMaxRows(6)
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
      .setMaxRows(6)
      .setSpacing(SPACING * scale)
      .build();

    const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
      DraftToMapString.fromDraftState(draftState);
    const mapString: string = mapStringAndHexToPlayerName.mapString;
    const hexToLabel: Map<HexType, string> =
      mapStringAndHexToPlayerName.hexToPlayerName;
    const map: MapUI = new MapUI(mapString, hexToLabel, scale);

    const createZoomedMap = (scale: number): AbstractUI => {
      const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
        DraftToMapString.fromDraftState(draftState);
      const mapString: string = mapStringAndHexToPlayerName.mapString;
      const hexToLabel: Map<HexType, string> =
        mapStringAndHexToPlayerName.hexToPlayerName;
      return new MapUI(mapString, hexToLabel, scale * 1.7);
    };
    const zoomableMapUi: AbstractUI = new ZoomableUI(
      map,
      scale,
      createZoomedMap
    );

    const panel: AbstractUI = new HorizontalUIBuilder()
      .addUIs([sliceGrid, factionGrid, seatGrid, zoomableMapUi])
      .setPadding(SPACING * scale)
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());

    const update = (): void => {
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
      map.update(mapString, hexToLabel);
    };

    draftState.onDraftStateChanged.add(update);
    update();
  }
}
