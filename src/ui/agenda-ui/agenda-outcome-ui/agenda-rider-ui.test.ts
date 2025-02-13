import { GameObject, Widget } from "@tabletop-playground/api";
import { clickAll, MockCard, MockCardDetails, MockCardHolder } from "ttpg-mock";
import {
  AgendaRiderSchemaType,
  AgendaState,
} from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaRiderUI } from "./agenda-rider-ui";

it("static _createRiderButton", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const riderObj: GameObject = new MockCard({
    cardDetails: [
      new MockCardDetails({
        name: "longer than max characters length to force truncation",
      }),
    ],
  });

  const rider: AgendaRiderSchemaType = {
    objId: riderObj.getId(),
    seat: 0,
    outcome: 0,
  };
  const scale: number = 1;
  const button: Widget | undefined = AgendaRiderUI._createRiderButton(
    rider,
    scale
  );
  expect(button).toBeDefined();
  clickAll(button);
});

it("static _createRiderButton (missing object)", () => {
  const rider: AgendaRiderSchemaType = {
    objId: "__invalid__",
    seat: 0,
    outcome: 0,
  };
  const scale: number = 1;
  const button: Widget | undefined = AgendaRiderUI._createRiderButton(
    rider,
    scale
  );
  expect(button).toBeUndefined();
});

it("constructor, event", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const riderObj: GameObject = new MockCard();

  const agendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  new AgendaRiderUI(agendaState, outcomeIndex, scale);

  const seatIndex: number = 0;
  agendaState.addRider(seatIndex, riderObj.getId(), outcomeIndex);

  agendaState.onAgendaStateChanged.trigger(agendaState);
});
