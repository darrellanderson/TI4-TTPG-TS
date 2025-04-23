import {
  HorizontalBox,
  LayoutBox,
  Text,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import {
  GameData,
  PerPlayerGameData,
} from "../../lib/game-data-lib/game-data/game-data";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { CONFIG } from "../config/config";

class StatsEntry {
  private readonly _name: Text;
  private readonly _resources: Text;
  private readonly _influence: Text;
  private readonly _tradegoods: Text;
  private readonly _commandTokens: Text;

  private readonly _abstractUI: AbstractUI;

  constructor(scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    this._name = new Text().setFontSize(fontSize);
    this._resources = new Text().setFontSize(fontSize);
    this._influence = new Text().setFontSize(fontSize);
    this._tradegoods = new Text().setFontSize(fontSize);
    this._commandTokens = new Text().setFontSize(fontSize);

    const panel: Widget = new HorizontalBox()
      .addChild(this._name, 3)
      .addChild(this._resources, 2)
      .addChild(this._influence, 2)
      .addChild(this._tradegoods, 2)
      .addChild(this._commandTokens, 3);
    const size: UI_SIZE = { w: 100 * scale, h: 20 * scale };
    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(panel);
    this._abstractUI = new AbstractUI(box, size);
  }

  updateAsHeader(): void {
    this._name.setText("Player");
    this._resources.setText("Res");
    this._influence.setText("Inf");
    this._tradegoods.setText("TGs");
    this._commandTokens.setText("Tokens");
  }

  getAbstractUI(): AbstractUI {
    return this._abstractUI;
  }

  update(player: PerPlayerGameData): void {
    this._name.setText(player.name ?? "");
    this._resources.setText(
      [
        `${player.planetTotals?.resources.avail ?? ""}`,
        `${player.planetTotals?.resources.total ?? ""}`,
      ].join("/")
    );
    this._influence.setText(
      [
        `${player.planetTotals?.influence.avail ?? ""}`,
        `${player.planetTotals?.influence.total ?? ""}`,
      ].join("/")
    );
    this._tradegoods.setText(`${player.tradeGoods ?? ""}`);
    this._commandTokens.setText(
      [
        player.commandTokens?.tactics,
        player.commandTokens?.fleet,
        player.commandTokens?.strategy,
      ].join("/")
    );
  }
}

export class StatsUI extends AbstractUI {
  private readonly _statsEntries: Array<StatsEntry>;

  private readonly _onGameData = (gameData: GameData): void => {
    this.update(gameData);
  };

  constructor(scale: number) {
    const statsEntries: Array<StatsEntry> = [];
    for (let i = 0; i < TI4.config.playerCount; i++) {
      const statsEntryUI: StatsEntry = new StatsEntry(scale);
      statsEntries.push(statsEntryUI);
    }

    const uis: Array<AbstractUI> = statsEntries.map(
      (entry: StatsEntry): AbstractUI => {
        return entry.getAbstractUI();
      }
    );

    // Add header
    const header: StatsEntry = new StatsEntry(scale);
    header.updateAsHeader();
    uis.unshift(header.getAbstractUI());

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(0 * scale)
      .addUIs(uis)
      .build();
    super(abstractUi.getWidget(), abstractUi.getSize());
    this._statsEntries = statsEntries;

    TI4.events.onGameData.add(this._onGameData);
  }

  destroy(): void {
    TI4.events.onGameData.remove(this._onGameData);
    super.destroy();
  }

  update(gameData: GameData): void {
    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const statsEntry: StatsEntry | undefined =
          this._statsEntries[seatIndex];
        if (statsEntry) {
          statsEntry.update(player);
        }
      }
    );
  }
}
