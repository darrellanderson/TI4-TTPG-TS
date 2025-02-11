import { Card } from "@tabletop-playground/api";
import { MockCard } from "ttpg-mock";
import { CreateZoomedCardUI } from "./create-zoomed-card-ui";
import { CreateZoomedUiType } from "./zoomable-ui";

it("constructor, get", () => {
  const card: Card = new MockCard();
  const createZoomedCardUI = new CreateZoomedCardUI(card);

  const create: CreateZoomedUiType = createZoomedCardUI.get();

  const scale: number = 1;
  create(scale);
});
