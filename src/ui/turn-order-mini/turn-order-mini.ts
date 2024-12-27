import {
  Border,
  Color,
  HorizontalAlignment,
  LayoutBox,
  Panel,
  Player,
  Text,
  TextJustification,
  VerticalAlignment,
  VerticalBox,
  Widget,
  world,
} from "@tabletop-playground/api";
import { TurnOrder } from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class TurnOrderMini extends AbstractUI {
  private readonly _entries: Array<{ text: Text; bg: Border }> = [];

  private readonly _onTurnOrderChanged = (): void => {
    const order: Array<number> = TI4.turnOrder.getTurnOrder();
    const current: number = TI4.turnOrder.getCurrentTurn();
    order.forEach((playerSlot: number, index: number) => {
      const playerColor: Color =
        TI4.playerColor.getSlotWidgetColorOrThrow(playerSlot);
      const otherColor: Color = new Color(0, 0, 0, 1);

      const fg: Color = playerSlot === current ? otherColor : playerColor;
      const bg: Color = playerSlot === current ? playerColor : otherColor;

      let playerName: string = `Player ${playerSlot + 1}`;
      const player: Player | undefined = world.getPlayerBySlot(playerSlot);
      if (player) {
        playerName = player.getName();
      }

      const entry: { text: Text; bg: Border } | undefined =
        this._entries[index];

      if (entry) {
        entry.text.setText(playerName).setTextColor(fg);
        entry.bg.setColor(bg);
      }
    });
  };

  constructor(scale: number) {
    const entrySize: UI_SIZE = { w: 200 * scale, h: 30 * scale };
    const fontSize: number = entrySize.h * 0.4;

    const playerCount: number = TI4.config.playerCount;
    const panelSize: UI_SIZE = { w: entrySize.w, h: entrySize.h * playerCount };
    const panel: Panel = new VerticalBox();

    const entries: Array<{ text: Text; bg: Border }> = [];
    for (let i: number = 0; i < playerCount; i++) {
      const text: Text = new Text()
        .setBold(true)
        .setFontSize(fontSize)
        .setJustification(TextJustification.Center);

      const bg: Border = new Border();
      bg.setChild(text);

      entries.push({ text, bg });
      panel.addChild(bg, 1);
    }

    const box: Widget = new LayoutBox()
      .setOverrideWidth(panelSize.w)
      .setOverrideHeight(panelSize.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(panel);
    super(box, panelSize);

    this._entries = entries;
    TurnOrder.onTurnStateChanged.add(this._onTurnOrderChanged);
    this._onTurnOrderChanged();
  }

  destroy(): void {
    TurnOrder.onTurnStateChanged.remove(this._onTurnOrderChanged);
    super.destroy();
  }
}
