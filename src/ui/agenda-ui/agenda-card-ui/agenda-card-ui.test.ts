import { Card } from "@tabletop-playground/api";
import { MockCard } from "ttpg-mock";
import { AgendaCardFaceDownUI, AgendaCardUI } from "./agenda-card-ui";

it("constructor", () => {
  const agendaCard: Card = new MockCard();
  const scale = 1;
  new AgendaCardUI(agendaCard, scale);
});

it("_getCreateZoomedUI", () => {
  const agendaCard: Card = new MockCard();
  const scale = 1;
  const createZoomedUI = AgendaCardUI._getCreateZoomedUI(agendaCard, scale);
  createZoomedUI();
});

it("constructor face down", () => {
  const scale = 1;
  new AgendaCardFaceDownUI(scale);
});
