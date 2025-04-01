import { AbstractUI } from "../abstract-ui/abtract-ui";
import { StreamerUI } from "./streamer-ui";

it("constructor", () => {
  const scale: number = 1;
  const streamerUi: AbstractUI = new StreamerUI(scale);
  streamerUi.destroy();
});
