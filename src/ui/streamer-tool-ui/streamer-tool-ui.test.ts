import { Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { StreamerToolUI } from "./streamer-tool-ui";
import { MockPlayer, mockWorld } from "ttpg-mock";

it("constructor", () => {
  const playerSlot: number = 10;
  const player: Player = new MockPlayer({ slot: playerSlot });
  mockWorld._addPlayer(player);

  const scale: number = 1;
  const streamerUi: AbstractUI = new StreamerToolUI(scale, playerSlot);
  streamerUi.destroy();
});
