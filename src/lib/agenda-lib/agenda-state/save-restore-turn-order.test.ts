import { SaveRestoreTurnOrder } from "./save-restore-turn-order";

it("save", () => {
  TI4.turnOrder.setTurnOrder([10, 11, 12, 13], "forward", 10);
  TI4.turnOrder.setPassed(12, true);
  TI4.turnOrder.setPassed(13, true);

  const json: string = SaveRestoreTurnOrder.save();
  expect(json).toBe(
    '{"order":[10,11,12,13],"currentTurn":10,"passed":[12,13]}',
  );
  expect(JSON.parse(json)).toEqual({
    order: [10, 11, 12, 13],
    currentTurn: 10,
    passed: [12, 13],
  });
});

it("save (no passed)", () => {
  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);

  const json: string = SaveRestoreTurnOrder.save();
  expect(JSON.parse(json)).toEqual({
    order: [10, 11],
    currentTurn: 10,
    passed: [],
  });
});

it("save (empty turn order)", () => {
  const json: string = SaveRestoreTurnOrder.save();
  expect(JSON.parse(json)).toEqual({
    order: [],
    currentTurn: -1,
    passed: [],
  });
});

it("saveAndClearPassed", () => {
  TI4.turnOrder.setTurnOrder([10, 11, 12, 13], "forward", 10);
  TI4.turnOrder.setPassed(12, true);
  TI4.turnOrder.setPassed(13, true);

  const json: string = SaveRestoreTurnOrder.saveAndClearPassed();
  expect(JSON.parse(json).passed).toEqual([12, 13]);

  // Passed is cleared on every player in the turn order.
  expect(TI4.turnOrder.getPassed(10)).toBe(false);
  expect(TI4.turnOrder.getPassed(11)).toBe(false);
  expect(TI4.turnOrder.getPassed(12)).toBe(false);
  expect(TI4.turnOrder.getPassed(13)).toBe(false);
});

it("restore", () => {
  const json: string = JSON.stringify({
    order: [10, 11, 12, 13],
    currentTurn: 11,
    passed: [12],
  });

  SaveRestoreTurnOrder.restore(json);

  expect(TI4.turnOrder.getTurnOrder()).toEqual([10, 11, 12, 13]);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
  expect(TI4.turnOrder.getPassed(10)).toBe(false);
  expect(TI4.turnOrder.getPassed(11)).toBe(false);
  expect(TI4.turnOrder.getPassed(12)).toBe(true);
  expect(TI4.turnOrder.getPassed(13)).toBe(false);
});

it("restore (round trip with saveAndClearPassed)", () => {
  TI4.turnOrder.setTurnOrder([10, 11, 12, 13], "forward", 11);
  TI4.turnOrder.setPassed(12, true);
  TI4.turnOrder.setPassed(13, true);

  const json: string = SaveRestoreTurnOrder.saveAndClearPassed();
  SaveRestoreTurnOrder.restore(json);

  expect(TI4.turnOrder.getTurnOrder()).toEqual([10, 11, 12, 13]);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
  expect(TI4.turnOrder.getPassed(12)).toBe(true);
  expect(TI4.turnOrder.getPassed(13)).toBe(true);
});

it("restore (empty turn order)", () => {
  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);

  const json: string = JSON.stringify({
    order: [],
    currentTurn: -1,
    passed: [],
  });
  SaveRestoreTurnOrder.restore(json);

  expect(TI4.turnOrder.getTurnOrder()).toEqual([]);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(-1);
});

it("restore (direction forced to forward)", () => {
  const order: Array<number> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "reverse", 11);

  SaveRestoreTurnOrder.restore(
    JSON.stringify({ order, currentTurn: 11, passed: [] }),
  );

  expect(TI4.turnOrder.getDirection()).toBe("forward");
});

it("restore (bad json throws)", () => {
  expect(() => {
    SaveRestoreTurnOrder.restore("bad json");
  }).toThrow("Failed to restore turn order state");
});

it("restore (missing field throws)", () => {
  const json: string = JSON.stringify({ order: [10], currentTurn: 10 });
  expect(() => {
    SaveRestoreTurnOrder.restore(json);
  }).toThrow("Failed to restore turn order state");
});

it("restore (unknown field throws, strict schema)", () => {
  const json: string = JSON.stringify({
    order: [10],
    currentTurn: 10,
    passed: [],
    extra: 1,
  });
  expect(() => {
    SaveRestoreTurnOrder.restore(json);
  }).toThrow("Failed to restore turn order state");
});

it("restore (wrong field type throws)", () => {
  const json: string = JSON.stringify({
    order: [10],
    currentTurn: "10",
    passed: [],
  });
  expect(() => {
    SaveRestoreTurnOrder.restore(json);
  }).toThrow("Failed to restore turn order state");
});
