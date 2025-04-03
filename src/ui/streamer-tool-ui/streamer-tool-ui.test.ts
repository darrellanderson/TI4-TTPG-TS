import { Player, TextBox } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { StreamerToolUI } from "./streamer-tool-ui";
import { clickAll, MockPlayer, MockTextBox, mockWorld } from "ttpg-mock";

it("constructor", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  const streamerUi: AbstractUI = new StreamerToolUI(scale, playerSlot);
  streamerUi.destroy();
});

it("clickAll", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  const player: Player = new MockPlayer({ slot: playerSlot });
  mockWorld._addPlayer(player);

  const streamerUi: AbstractUI = new StreamerToolUI(scale, playerSlot);
  clickAll(streamerUi.getWidget());
  clickAll(streamerUi.getWidget()); // again (flip checkboxes)
  streamerUi.destroy();
});

it("_editableTimestampCommitted", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  const streamerUi: StreamerToolUI = new StreamerToolUI(scale, playerSlot);

  const textBox: TextBox = new MockTextBox();
  const player: Player = new MockPlayer({ slot: playerSlot });
  streamerUi._editableTimestampCommitted(textBox, player, "text", true);
  streamerUi.destroy();
});
