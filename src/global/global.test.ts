import { GameWorld } from "ttpg-mock";
import { registerErrorHandler, TI4Class } from "./global";

it("globalThis.TI4 is set", () => {
  expect(TI4).toBeInstanceOf(TI4Class);
});

it("executionReason not unittest", () => {
  const mockConsole = jest
    .spyOn(global.console, "log")
    .mockImplementation(() => {});
  const mockGameWorld = jest
    .spyOn(GameWorld, "getExecutionReason")
    .mockImplementation(() => "not unittest");

  registerErrorHandler();

  mockGameWorld.mockRestore();
  mockConsole.mockRestore();
});
