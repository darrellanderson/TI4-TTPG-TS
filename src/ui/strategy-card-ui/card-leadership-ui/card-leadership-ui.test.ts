import { CardLeadershipUI } from "./card-leadership-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const isPlay: boolean = true;
  new CardLeadershipUI(scale, isPlay).destroy();
});

it("getReport", () => {
  const scale: number = 1;
  const isPlay: boolean = true;
  new CardLeadershipUI(scale, isPlay).getReport();
});
