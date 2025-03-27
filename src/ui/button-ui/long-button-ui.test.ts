import { LongButtonUI } from "./long-button-ui";

it("getButton", () => {
  new LongButtonUI(1, 1).getButton();
});

it("destroy", () => {
  new LongButtonUI(1, 1).destroy();
});
