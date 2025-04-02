import { AbstractUI } from "../abstract-ui/abtract-ui";
import { StreamerToolUI } from "./streamer-tool-ui";

it("constructor", () => {
  const scale: number = 1;
  const streamerUi: AbstractUI = new StreamerToolUI(scale);
  streamerUi.destroy();
});
