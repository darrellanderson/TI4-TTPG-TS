import { DivUI } from "./div-ui";

it("constructor, horizontal", () => {
  const scale: number = 1;
  const scaledLength: number = 10;
  new DivUI(scale, scaledLength, "horizontal");
});

it("constructor, vertical", () => {
  const scale: number = 1;
  const scaledLength: number = 10;
  new DivUI(scale, scaledLength, "vertical");
});
