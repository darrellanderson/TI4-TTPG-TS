import {
  Button,
  LayoutBox,
  MultilineTextBox,
  Player,
  TextBox,
  TextJustification,
  Widget,
} from "@tabletop-playground/api";
import {
  Broadcast,
  NamespaceId,
  ThrottleClickHandler,
  Window,
} from "ttpg-darrell";

import { MapPlaceFrontierTokens } from "../../lib/map-string-lib/map-place/map-place-frontier-tokens";
import { MapPlacePlanetCards } from "../../lib/map-string-lib/map-place/map-place-planet-cards";
import { MapRemoveAllNonHomeSystems } from "../../lib/map-string-lib/map-remove/map-remove-all-non-home-systems";
import { MapRemoveFrontierTokens } from "../../lib/map-string-lib/map-remove/map-remove-frontier-tokens";
import { MapRemovePlanetCards } from "../../lib/map-string-lib/map-remove/map-remove-planet-cards";
import { MapStringLoad } from "../../lib/map-string-lib/map-string/map-string-load";
import { MapStringSave } from "../../lib/map-string-lib/map-string/map-string-save";
import { MapStringHyperlanes } from "../../lib/map-string-lib/map-string/map-string-hyperlanes";
import { MoveGenericHomeSystemLocations } from "../../lib/map-string-lib/map-home-system-locations/move-generic-home-systems";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { DraftStartWindow } from "../draft/draft-start-ui/draft-start-window";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { MapPremadeUI } from "../map-premade-ui/map-premade-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { CONFIG } from "../config/config";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../abstract-window/abstract-window";
import { DraftBagWindow } from "../draft/draft-bag-ui/draft-bag-window";

export class MapToolUI extends AbstractUI {
  private readonly _editText: MultilineTextBox;
  private _premadeMapWindow: Window | undefined = undefined;

  private readonly _onUsePremadeMap = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const namespaceId: NamespaceId | undefined = undefined;
      const windowTitle: string = "Premade Maps";
      const abstractWindow: AbstractWindow = new AbstractWindow(
        this._createMapPremadeUI,
        namespaceId,
        windowTitle
      );
      this._premadeMapWindow = abstractWindow
        .createWindow([playerSlot])
        .attach();
    }
  ).get();

  private readonly _onUseSliceDraft = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      new DraftStartWindow().createAndAttachWindow(playerSlot);
    }
  ).get();

  private readonly _onUseBagDraft = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      new DraftBagWindow().createAndAttachWindow(playerSlot);
    }
  ).get();

  private readonly _onMapStringLoad = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Map string loaded by ${playerName}`;
      Broadcast.chatAll(msg);

      const mapString: string = this._editText.getText();

      // Move generic home systems first.
      const mover = new MoveGenericHomeSystemLocations();
      mover.moveGenerics(mapString);

      new MapStringLoad().load(mapString);
    }
  ).get();

  private readonly _onMapStringSave = new ThrottleClickHandler<Button>(
    (): void => {
      const mapString: string = new MapStringSave().save();
      this._editText.setText(mapString);
    }
  ).get();

  private readonly _onPlacePlanetCards = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Planet cards placed by ${playerName}`;
      Broadcast.chatAll(msg);

      new MapPlacePlanetCards().placePlanetCards();
    }
  ).get();

  private readonly _onPlaceFrontierTokens = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Frontier tokens placed by ${playerName}`;
      Broadcast.chatAll(msg);

      new MapRemoveFrontierTokens().removeFrontierTokens();
      new MapPlaceFrontierTokens().placeFrontierTokens();
    }
  ).get();

  private readonly _onRemovePlanetCards = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Planet cards removed by ${playerName}`;
      Broadcast.chatAll(msg);

      new MapRemovePlanetCards().removePlanetCards();
    }
  ).get();

  private readonly _onRemoveFrontierTokens = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Frontier tokens removed by ${playerName}`;
      Broadcast.chatAll(msg);

      new MapRemoveFrontierTokens().removeFrontierTokens();
    }
  ).get();

  private readonly _onPlaceHyperlanes = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Hyperlanes placed by ${playerName}`;
      Broadcast.chatAll(msg);

      const playerCount: number = TI4.config.playerCount;
      const mapString: string = MapStringHyperlanes.get(playerCount);
      new MapStringLoad().load(mapString);
    }
  ).get();

  private readonly _onClearMap = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `Map cleared by ${playerName}`;
      Broadcast.chatAll(msg);

      new MapRemovePlanetCards().removePlanetCards();
      new MapRemoveFrontierTokens().removeFrontierTokens();
      new MapRemoveAllNonHomeSystems().removeAllNonHomeSystems();
      this._editText.setText("");
    }
  ).get();

  constructor(scale: number) {
    const labelUi: LabelUI = new LabelUI(scale);
    labelUi.getText().setText("Map string:");
    labelUi.getText().setJustification(TextJustification.Right);

    const buttonPremadeMap: ButtonUI = new ButtonUI(scale);
    buttonPremadeMap.getButton().setText("Use premade map...");

    const buttonSliceDraft: ButtonUI = new ButtonUI(scale);
    buttonSliceDraft.getButton().setText("Use slice draft...");

    const empty: LabelUI = new LabelUI(scale);
    empty.getText().setText("");

    const buttonBagDraft: ButtonUI = new ButtonUI(scale);
    buttonBagDraft.getButton().setText("Use bag draft...");

    const editText: TextBox = new TextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setMaxLength(1000);
    const textBoxSize: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
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
        buttonPremadeMap,
        empty, // spacer
        labelUi,
        buttonLoad,
        buttonPlacePlanetCards,
        buttonPlaceFrontierTokens,
        buttonPlaceHyperlanes,
      ])
      .build();

    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        buttonSliceDraft,
        buttonBagDraft,
        textBoxUi,
        buttonSave,
        buttonRemovePlanetCards,
        buttonRemoveFrontierTokens,
        buttonClearMap,
      ])
      .build();

    const overall: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([left, right])
      .build();

    super(overall.getWidget(), overall.getSize());

    this._editText = editText;

    buttonPremadeMap.getButton().onClicked.add(this._onUsePremadeMap);
    buttonSliceDraft.getButton().onClicked.add(this._onUseSliceDraft);
    buttonBagDraft.getButton().onClicked.add(this._onUseBagDraft);
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

  _createMapPremadeUI: CreateAbstractUIType = (
    params: CreateAbstractUIParams
  ): AbstractUI => {
    const mapPremadeUi: MapPremadeUI = new MapPremadeUI(params.scale);
    mapPremadeUi.onMapString.add((mapString: string): void => {
      this._editText.setText(mapString);
      if (this._premadeMapWindow) {
        this._premadeMapWindow.detach();
        this._premadeMapWindow = undefined;
      }
    });
    return mapPremadeUi;
  };
}
