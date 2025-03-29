import { ChooseTechnologyUI } from "./choose-technology-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ChooseTechnologyUI(scale, playerSlot).destroy();
});
