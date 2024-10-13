import {
  Border,
  Canvas,
  Color,
  GameObject,
  ImageWidget,
  Text,
  TextJustification,
} from "@tabletop-playground/api";
import { Facing, TurnEntryWart, TurnEntryWidget } from "ttpg-darrell";

import {
  InitiativeEntry,
  InitiativeOrder,
} from "../../lib/strategy-card-lib/initiative-order/initiative-order";
import { Scoreboard } from "../../lib/score-lib/scoreboard/scoreboard";

// Shared map, resets when updating the first entry in the turn order list.
const __playerSlotToStrategyCards: Map<number, Array<GameObject>> = new Map();
const __playerSlotToScore: Map<number, number> = new Map();

export class TurnOrderEntry extends TurnEntryWart {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  private readonly _factionIcon: ImageWidget;
  private readonly _factionName: Text;
  private readonly _score: Text;
  private readonly _strategyCardSolo: Text;
  private readonly _strategyCardSoloOverlay: Border;
  private readonly _strategyCardLeft: Text;
  private readonly _strategyCardLeftOverLay: Border;
  private readonly _strategyCardRight: Text;
  private readonly _strategyCardRightOverLay: Border;

  constructor(turnEntryWidget: TurnEntryWidget) {
    super();

    this._factionIcon = new ImageWidget().setImageSize(40, 40);
    this._factionName = new Text()
      .setFontSize(6)
      .setJustification(TextJustification.Center)
      .setText("N/A");
    this._score = new Text()
      .setFontSize(26)
      .setJustification(TextJustification.Center)
      .setText("14");
    this._strategyCardSolo = new Text()
      .setFont("handel-gothic-regular.ttf")
      .setFontSize(11)
      .setJustification(TextJustification.Center)
      .setText("LEADERSHIP");
    this._strategyCardSoloOverlay = new Border();
    this._strategyCardLeft = new Text()
      .setFont("handel-gothic-regular.ttf")
      .setFontSize(6)
      .setJustification(TextJustification.Center)
      .setText("LEADERSHIP");
    this._strategyCardLeftOverLay = new Border();
    this._strategyCardRight = new Text()
      .setFont("handel-gothic-regular.ttf")
      .setFontSize(6)
      .setJustification(TextJustification.Center)
      .setText("LEADERSHIP");
    this._strategyCardRightOverLay = new Border();

    const canvas: Canvas = turnEntryWidget.getCanvas();

    // 220x58
    canvas
      .addChild(this._factionIcon, 4, 4, 40, 40)
      .addChild(this._factionName, 0, 44, 48, 15)
      .addChild(this._score, 175, 3, 45, 45)
      .addChild(this._strategyCardSolo, 45, 31, 130, 29)
      .addChild(this._strategyCardSoloOverlay, 50, 39, 120, 2)
      .addChild(this._strategyCardLeft, 45, 36, 65, 29)
      .addChild(this._strategyCardLeftOverLay, 45, 39, 60, 1)
      .addChild(this._strategyCardRight, 110, 36, 65, 29)
      .addChild(this._strategyCardRightOverLay, 110, 39, 60, 1);
  }

  destroy(): void {}

  _updatePlayerSlotToStrategyCards(): void {
    __playerSlotToStrategyCards.clear();
    const initiativeEntries: Array<InitiativeEntry> =
      new InitiativeOrder().get();
    for (const initiativeEntry of initiativeEntries) {
      __playerSlotToStrategyCards.set(
        initiativeEntry.playerSlot,
        initiativeEntry.strategyCards
      );
    }
  }

  _updatePlayerSlotToScore(): void {
    __playerSlotToScore.clear();

    const playerSlotToToken: Map<number, GameObject> =
      this._scoreboard.getPlayerSlotToLeadControlToken();
    for (const [playerSlot, controlToken] of playerSlotToToken) {
      const score: number | undefined = this._scoreboard.posToScore(
        controlToken.getPosition()
      );
      if (score !== undefined) {
        __playerSlotToScore.set(playerSlot, score);
      }
    }
  }

  update(playerSlot: number, fgColor: Color, _bgColor: Color): void {
    // Reset shared state when updating the first entry in the turn order list.
    if (playerSlot === TI4.turnOrder.getTurnOrder()[0]) {
      this._updatePlayerSlotToStrategyCards();
      this._updatePlayerSlotToScore();
    }

    this._factionName.setTextColor(fgColor);
    this._score.setTextColor(fgColor);
    this._strategyCardSolo.setTextColor(fgColor);
    this._strategyCardSoloOverlay.setColor(fgColor);
    this._strategyCardLeft.setTextColor(fgColor);
    this._strategyCardLeftOverLay.setColor(fgColor);
    this._strategyCardRight.setTextColor(fgColor);
    this._strategyCardRightOverLay.setColor(fgColor);

    this._strategyCardSolo.setVisible(false);
    this._strategyCardLeft.setVisible(false);
    this._strategyCardRight.setVisible(false);
    this._strategyCardSoloOverlay.setVisible(false);
    this._strategyCardLeftOverLay.setVisible(false);
    this._strategyCardRightOverLay.setVisible(false);

    const strategyCards: Array<GameObject> | undefined =
      __playerSlotToStrategyCards.get(playerSlot);

    const strategyCard1: GameObject | undefined = strategyCards?.[0];
    const strategyCard2: GameObject | undefined = strategyCards?.[1];

    if (strategyCards?.length === 1 && strategyCard1) {
      const name: string = strategyCard1.getName().toUpperCase();
      const active: boolean = Facing.isFaceUp(strategyCard1);
      this._strategyCardSolo.setText(name);
      this._strategyCardSolo.setVisible(true);
      this._strategyCardSoloOverlay.setVisible(!active);
    }
    if (strategyCards?.length === 2 && strategyCard1 && strategyCard2) {
      const name1: string = strategyCard1.getName().toUpperCase();
      const name2: string = strategyCard2.getName().toUpperCase();
      const active1: boolean = Facing.isFaceUp(strategyCard1);
      const active2: boolean = Facing.isFaceUp(strategyCard2);
      this._strategyCardLeft.setText(name1);
      this._strategyCardLeft.setVisible(true);
      this._strategyCardRight.setText(name2);
      this._strategyCardRight.setVisible(true);
      this._strategyCardLeftOverLay.setVisible(!active1);
      this._strategyCardRightOverLay.setVisible(!active2);
    }
  }
}
