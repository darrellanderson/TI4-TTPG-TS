import {
  Button,
  LayoutBox,
  MultilineTextBox,
  Player,
  TextJustification,
  Widget,
} from "@tabletop-playground/api";

import { MapPlaceFrontierTokens } from "../../lib/map-string-lib/map-place/map-place-frontier-tokens";
import { MapPlacePlanetCards } from "../../lib/map-string-lib/map-place/map-place-planet-cards";
import { MapRemoveAllNonHomeSystems } from "../../lib/map-string-lib/map-remove/map-remove-all-non-home-systems";
import { MapRemoveFrontierTokens } from "../../lib/map-string-lib/map-remove/map-remove-frontier-tokens";
import { MapRemovePlanetCards } from "../../lib/map-string-lib/map-remove/map-remove-planet-cards";
import { MapStringLoad } from "../../lib/map-string-lib/map-string/map-string-load";
import { MapStringSave } from "../../lib/map-string-lib/map-string/map-string-save";
import { MapStringHyperlanes } from "../../lib/map-string-lib/map-string/map-string-hyperlanes";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { CONFIG } from "../config/config";
import { Broadcast } from "ttpg-darrell";

export class MapToolUI extends AbstractUI {
  private readonly _editText: MultilineTextBox;

  private readonly _onMapStringLoad = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Map string loaded by ${playerName}`;
    Broadcast.chatAll(msg);

    const mapString: string = this._editText.getText();
    new MapStringLoad().load(mapString);
  };

  private readonly _onMapStringSave = (): void => {
    const mapString: string = new MapStringSave().save();
    this._editText.setText(mapString);
  };

  private readonly _onPlacePlanetCards = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Planet cards placed by ${playerName}`;
    Broadcast.chatAll(msg);

    new MapPlacePlanetCards().placePlanetCards();
  };

  private readonly _onPlaceFrontierTokens = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Frontier tokens placed by ${playerName}`;
    Broadcast.chatAll(msg);

    new MapPlaceFrontierTokens().placeFrontierTokens();
  };

  private readonly _onRemovePlanetCards = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Planet cards removed by ${playerName}`;
    Broadcast.chatAll(msg);

    new MapRemovePlanetCards().removePlanetCards();
  };

  private readonly _onRemoveFrontierTokens = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Frontier tokens removed by ${playerName}`;
    Broadcast.chatAll(msg);

    new MapRemoveFrontierTokens().removeFrontierTokens();
  };

  private readonly _onPlaceHyperlanes = (
    _button: Button,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Hyperlanes placed by ${playerName}`;
    Broadcast.chatAll(msg);

    const playerCount: number = TI4.config.playerCount;
    const mapString: string = MapStringHyperlanes.get(playerCount);
    new MapStringLoad().load(mapString);
  };

  private readonly _onClearMap = (_button: Button, player: Player): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `Map cleared by ${playerName}`;
    Broadcast.chatAll(msg);

    new MapRemovePlanetCards().removePlanetCards();
    new MapRemoveFrontierTokens().removeFrontierTokens();
    new MapRemoveAllNonHomeSystems().removeAllNonHomeSystems();
    this._editText.setText("");
  };

  constructor(scale: number) {
    const labelUi: LabelUI = new LabelUI(scale);
    labelUi.getText().setText("Map string:");
    labelUi.getText().setJustification(TextJustification.Left);

    const editText: MultilineTextBox = new MultilineTextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setMaxLength(1000);
    const textBoxSize: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * 2 * scale + CONFIG.SPACING * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const layoutBox: Widget = new LayoutBox()
      .setChild(editText)
      .setOverrideHeight(textBoxSize.h)
      .setOverrideWidth(textBoxSize.w);
    const textBoxUi: AbstractUI = new (class extends AbstractUI {
      constructor() {
        super(layoutBox, textBoxSize);
      }
    })();

    const buttonLoad: ButtonUI = new ButtonUI(scale);
    buttonLoad.getButton().setText("Load map from string");

    const buttonPlacePlanetCards: ButtonUI = new ButtonUI(scale);
    buttonPlacePlanetCards.getButton().setText("Place planet cards");

    const buttonPlaceFrontierTokens: ButtonUI = new ButtonUI(scale);
    buttonPlaceFrontierTokens.getButton().setText("Place frontier tokens");

    const buttonPlaceHyperlanes: ButtonUI = new ButtonUI(scale);
    buttonPlaceHyperlanes.getButton().setText("Place hyperlanes");

    const buttonSave: ButtonUI = new ButtonUI(scale);
    buttonSave.getButton().setText("Save map string");

    const buttonRemovePlanetCards: ButtonUI = new ButtonUI(scale);
    buttonRemovePlanetCards.getButton().setText("Clear planet cards");

    const buttonRemoveFrontierTokens: ButtonUI = new ButtonUI(scale);
    buttonRemoveFrontierTokens.getButton().setText("Clear frontier tokens");

    const buttonClearMap: ButtonUI = new ButtonUI(scale);
    buttonClearMap.getButton().setText("Clear all");

    const left: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        buttonLoad,
        buttonPlacePlanetCards,
        buttonPlaceFrontierTokens,
        buttonPlaceHyperlanes,
      ])
      .build();

    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        buttonSave,
        buttonRemovePlanetCards,
        buttonRemoveFrontierTokens,
        buttonClearMap,
      ])
      .build();

    const bottom: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([left, right])
      .build();

    const overall: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([labelUi, textBoxUi, bottom])
      .build();

    super(overall.getWidget(), overall.getSize());

    this._editText = editText;

    buttonLoad.getButton().onClicked.add(this._onMapStringLoad);
    buttonPlacePlanetCards.getButton().onClicked.add(this._onPlacePlanetCards);
    buttonPlaceFrontierTokens
      .getButton()
      .onClicked.add(this._onPlaceFrontierTokens);
    buttonPlaceHyperlanes.getButton().onClicked.add(this._onPlaceHyperlanes);
    buttonSave.getButton().onClicked.add(this._onMapStringSave);
    buttonRemovePlanetCards
      .getButton()
      .onClicked.add(this._onRemovePlanetCards);
    buttonRemoveFrontierTokens
      .getButton()
      .onClicked.add(this._onRemoveFrontierTokens);
    buttonClearMap.getButton().onClicked.add(this._onClearMap);
  }
}
