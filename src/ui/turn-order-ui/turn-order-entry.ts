import {
  Border,
  Canvas,
  Color,
  GameObject,
  ImageWidget,
  Text,
  TextJustification,
} from "@tabletop-playground/api";
import { TurnEntryWart, TurnEntryWidget } from "ttpg-darrell";

import {
  InitiativeEntry,
  InitiativeOrder,
} from "../../lib/strategy-card-lib/initiative-order/initiative-order";

export class TurnOrderEntry extends TurnEntryWart {
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

  update(playerSlot: number, fgColor: Color, _bgColor: Color): void {
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

    const initiativeEntries: Array<InitiativeEntry> =
      new InitiativeOrder().get();
    let strategyCards: Array<GameObject> = [];

    for (const initiativeEntry of initiativeEntries) {
      if (initiativeEntry.playerSlot === playerSlot) {
        strategyCards = initiativeEntry.strategyCards;
      }
    }

    const strategyCard1: GameObject | undefined = strategyCards[0];
    const strategyCard2: GameObject | undefined = strategyCards[1];

    if (strategyCards.length === 1 && strategyCard1) {
      const name: string = strategyCard1.getName();
      this._strategyCardSolo.setText(name);
      this._strategyCardSolo.setVisible(true);
    }
    if (strategyCards.length === 2 && strategyCard1 && strategyCard2) {
      const name1: string = strategyCard1.getName();
      const name2: string = strategyCard2.getName();
      this._strategyCardLeft.setText(name1);
      this._strategyCardLeft.setVisible(true);
      this._strategyCardRight.setText(name2);
      this._strategyCardRight.setVisible(true);
    }
  }
}
