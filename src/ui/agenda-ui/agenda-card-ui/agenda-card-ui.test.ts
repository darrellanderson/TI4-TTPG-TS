import { Card } from "@tabletop-playground/api";
import { MockCard } from "ttpg-mock";
import { AgendaCardUI } from "./agenda-card-ui";

it("constructor", () => {
  const agendaCard: Card = new MockCard();
  const scale = 1;
  new AgendaCardUI(agendaCard, scale);
});
