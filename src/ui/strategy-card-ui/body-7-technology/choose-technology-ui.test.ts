import { ChooseTechologyUI } from "./choose-technology-ui";

it("constructor", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ChooseTechologyUI(scale, playerSlot).destroy();
});
