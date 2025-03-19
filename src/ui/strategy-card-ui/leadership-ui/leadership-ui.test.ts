import { LeadershipUI } from "./leadership-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const isPlay: boolean = true;
  new LeadershipUI(scale, isPlay).destroy();
});

it("getReport", () => {
  const scale: number = 1;
  const isPlay: boolean = true;
  new LeadershipUI(scale, isPlay).getReport();
});
