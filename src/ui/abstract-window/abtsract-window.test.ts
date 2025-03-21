import { Window } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "./abstract-window";
import { MockCardHolder, MockPlayer } from "ttpg-mock";

it("constuctor, createWindow", () => {
  const createAbstractUI: CreateAbstractUIType = (
    params: CreateAbstractUIParams
  ): AbstractUI => {
    return new ButtonUI(params.scale);
  };
  const namespaceId = "@test/test";
  const title: string = "Test Window";
  const abstractWindow = new AbstractWindow(
    createAbstractUI,
    namespaceId,
    title
  );

  new MockPlayer({ isHost: true, slot: 1 });
  abstractWindow.addHost().getMutableWindowParams().disableClose = true;

  const playerSlots: Array<number> = [10];
  const window: Window = abstractWindow.createWindow(playerSlots);

  window.attach().detach();
});

it("constuctor, createWindow (default player slots)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const createAbstractUI: CreateAbstractUIType = (
    params: CreateAbstractUIParams
  ): AbstractUI => {
    return new ButtonUI(params.scale);
  };
  const namespaceId = "@test/test";
  const title: string = "Test Window";
  const abstractWindow = new AbstractWindow(
    createAbstractUI,
    namespaceId,
    title
  );

  abstractWindow.getMutableWindowParams().disableClose = true;

  new MockPlayer({ isHost: true, slot: 1 });
  const window: Window = abstractWindow.createWindow();

  window.attach().detach();
});
