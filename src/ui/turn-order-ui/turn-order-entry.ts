import {
  Border,
  Canvas,
  Color,
  GameObject,
  ImageWidget,
  refPackageId,
  Text,
  TextJustification,
} from "@tabletop-playground/api";
import { Facing, TurnEntryWart, TurnEntryWidget } from "ttpg-darrell";

import { Faction } from "../../lib/faction-lib/faction/faction";
import {
  InitiativeEntry,
  InitiativeOrder,
} from "../../lib/strategy-card-lib/initiative-order/initiative-order";
import { Scoreboard } from "../../lib/score-lib/scoreboard/scoreboard";

// Shared map, resets when updating the first entry in the turn order list.
const __playerSlotToFaction: Map<number, Faction> = new Map();
const __playerSlotToScore: Map<number, number> = new Map();
const __playerSlotToStrategyCards: Map<number, Array<GameObject>> = new Map();

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
      .setBold(true)
      .setJustification(TextJustification.Center)
      .setText("FACTION");
    this._score = new Text()
      .setFontSize(26)
      .setBold(true)
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

  _updatePlayerSlotToFaction(): void {
    __playerSlotToFaction.clear();
    for (const [
      playerSlot,
      faction,
    ] of TI4.factionRegistry.getPlayerSlotToFaction()) {
      __playerSlotToFaction.set(playerSlot, faction);
    }
  }

  _updatePlayerSlotToScore(): void {
    __playerSlotToScore.clear();
    for (const [playerSlot, score] of this._scoreboard.getPlayerSlotToScore()) {
      __playerSlotToScore.set(playerSlot, score);
    }
  }

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

  update(playerSlot: number, fgColor: Color, _bgColor: Color): void {
    // Reset shared state when updating the first entry in the turn order list.
    if (playerSlot === TI4.turnOrder.getTurnOrder()[0]) {
      this._updatePlayerSlotToFaction();
      this._updatePlayerSlotToScore();
      this._updatePlayerSlotToStrategyCards();
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

    // Faction.
    const faction: Faction | undefined = __playerSlotToFaction.get(playerSlot);
    const factionName: string = faction?.getName() ?? "N/A";
    const factionIcon: string =
      faction?.getIcon() ?? "icon/token/circle-outline-only.png";
    const factionIconPackageId: string =
      faction?.getIconPackageId() ?? refPackageId;
    this._factionName.setText(factionName);
    this._factionIcon.setImage(factionIcon, factionIconPackageId);

    // Score.
    const score: number = __playerSlotToScore.get(playerSlot) ?? 0;
    this._score.setText(score.toString());

    // Strategy cards.
    const strategyCards: Array<GameObject> | undefined =
      __playerSlotToStrategyCards.get(playerSlot);

    const strategyCard1: GameObject | undefined = strategyCards?.[0];
    const strategyCard2: GameObject | undefined = strategyCards?.[1];

    if (!strategyCards) {
      this._strategyCardSolo.setText("–");
      this._strategyCardSolo.setVisible(true);
    } else if (strategyCards.length === 1 && strategyCard1) {
      const name: string = strategyCard1.getName().toUpperCase();
      const active: boolean = Facing.isFaceUp(strategyCard1);
      this._strategyCardSolo.setText(name);
      this._strategyCardSolo.setVisible(true);
      this._strategyCardSoloOverlay.setVisible(!active);
    } else if (strategyCards.length === 2 && strategyCard1 && strategyCard2) {
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
