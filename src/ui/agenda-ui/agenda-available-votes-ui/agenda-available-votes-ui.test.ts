import { MockCardHolder } from "ttpg-mock";
import { AgendaAvailableVotesUI } from "./agenda-available-votes-ui";

it("static getAvailableVotesRichText", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const result: string = AgendaAvailableVotesUI.getAvailableVotesRichText(14);
  expect(result).toEqual("[b][color=#00c702][size=14]0[/size][/color][/b]");
});

it("constructor", () => {
  const scaledWidth: number = 100;
  const scale: number = 1;
  new AgendaAvailableVotesUI(scaledWidth, scale);
});
