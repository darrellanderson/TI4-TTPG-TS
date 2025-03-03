import {
  Button,
  HorizontalAlignment,
  Player,
  VerticalAlignment,
} from "@tabletop-playground/api";
import {
  HexType,
  ThrottleClickHandler,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";

import { PremadeMapType } from "../../lib/map-string-lib/data/premade-map-type";
import { PREMADE_MAPS_2P } from "../../lib/map-string-lib/data/premade-maps-2p.data";
import { PREMADE_MAPS_3P } from "../../lib/map-string-lib/data/premade-maps-3p.data";
import { PREMADE_MAPS_4P } from "../../lib/map-string-lib/data/premade-maps-4p.data";
import { PREMADE_MAPS_5P } from "../../lib/map-string-lib/data/premade-maps-5p.data";
import { PREMADE_MAPS_6P } from "../../lib/map-string-lib/data/premade-maps-6p.data";
import { PREMADE_MAPS_7P } from "../../lib/map-string-lib/data/premade-maps-7p.data";
import { PREMADE_MAPS_8P } from "../../lib/map-string-lib/data/premade-maps-8p.data";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { MapUI } from "../map-ui/map-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { CreateZoomedUiType, ZoomableUI } from "../zoomable-ui/zoomable-ui";

export class MapPremadeUI extends AbstractUI {
  public readonly onMapString = new TriggerableMulticastDelegate<
    (mapString: string) => void
  >();
  private _mapString: string = "";

  static _emptyMapString(playerCount: number): string {
    if (playerCount <= 6) {
      return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
    }
    return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
  }

  static getPremadeMaps(playerCount: number): Array<PremadeMapType> {
    if (playerCount === 2) {
      return PREMADE_MAPS_2P;
    } else if (playerCount === 3) {
      return PREMADE_MAPS_3P;
    } else if (playerCount === 4) {
      return PREMADE_MAPS_4P;
    } else if (playerCount === 5) {
      return PREMADE_MAPS_5P;
    } else if (playerCount === 6) {
      return PREMADE_MAPS_6P;
    } else if (playerCount === 7) {
      return PREMADE_MAPS_7P;
    } else if (playerCount === 8) {
      return PREMADE_MAPS_8P;
    }
    return [];
  }

  constructor(scale: number) {
    // Show selected map.
    const playerCount: number = TI4.config.playerCount;
    const mapString: string = MapPremadeUI._emptyMapString(playerCount);
    const hexToLabel: Map<HexType, string> = new Map();

    const createMapUi: CreateZoomedUiType = (scale: number): AbstractUI => {
      return new MapUI(this._mapString, hexToLabel, scale * 2);
    };
    const mapUi: MapUI = new MapUI(mapString, hexToLabel, scale);
    const zoomableMapUi: AbstractUI = new ZoomableUI(mapUi, scale, createMapUi);

    const useMapButton: ButtonUI = new ButtonUI(scale);
    useMapButton.getButton().setText("Use Map");
    useMapButton.getButton().onClicked.add(
      new ThrottleClickHandler<Button>(
        (_button: Button, _player: Player): void => {
          this.onMapString.trigger(this._mapString);
        }
      ).get()
    );
    useMapButton.getButton().setEnabled(false);

    const mapAndUseButton: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([zoomableMapUi, useMapButton])
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .build();

    // Show premade maps.
    const premadeMaps: Array<PremadeMapType> =
      MapPremadeUI.getPremadeMaps(playerCount);
    const premadeMapButtons: Array<AbstractUI> = premadeMaps.map(
      (premadeMap: PremadeMapType): AbstractUI => {
        const buttonUi: ButtonUI = new ButtonUI(scale);
        buttonUi
          .getButton()
          .setText(premadeMap.name.replace("[", "\n["))
          .setFontSize(8 * scale);
        buttonUi.getButton().onClicked.add((): void => {
          this._mapString = premadeMap.mapString;
          mapUi.update(premadeMap.mapString, hexToLabel);
          useMapButton.getButton().setEnabled(true);
        });
        return buttonUi;
      }
    );
    const premadeMapsList: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setOverrideHeight(mapAndUseButton.getSize().h)
      .addUIs(premadeMapButtons)
      .build();

    const abstractUi: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([mapAndUseButton, premadeMapsList])
      .setVerticalAlignment(VerticalAlignment.Top)
      .build();
    super(abstractUi.getWidget(), abstractUi.getSize());

    this._mapString = mapString;
  }
}
