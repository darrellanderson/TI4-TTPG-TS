import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import { AgendaChooseTypeUI } from "./agenda-choose-type-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { clickAll } from "ttpg-mock";

it("constructor", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const scale: number = 1;
  const abstractUi: AbstractUI = new AgendaChooseTypeUI(agendaState, scale);
  clickAll(abstractUi.getWidget());
});
