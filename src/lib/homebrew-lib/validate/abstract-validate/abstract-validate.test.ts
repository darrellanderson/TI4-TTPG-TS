import { Card, GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { AbstractValidate } from "./abstract-validate";
import { MockCard, MockCardDetails } from "ttpg-mock";
import { Spawn } from "ttpg-darrell";

class MyAbstractValidate extends AbstractValidate {
  getCommandName(): string {
    return "my-command-name";
  }
  getDescription(): string {
    return "my description";
  }
  getErrors(_errors: Array<string>): void {}
}

it("getCardNsids (no decks)", () => {
  // Spawn logs to console when nothing matches (probably an error).
  const mock = jest.spyOn(global.console, "log").mockImplementation(() => {});
  const nsids: Set<string> = new MyAbstractValidate().getCardNsids(
    "card.my-type:"
  );
  expect(nsids.size).toBe(0);
  mock.mockRestore();
});

it("getCardNsids", () => {
  const deck: Card = new MockCard({
    cardDetails: [new MockCardDetails({ metadata: "card.my-type:base/jord" })],
  });
  Spawn.inject({
    "card.my-type:": "abcd1234",
  });

  jest
    .spyOn(Spawn, "spawn")
    .mockImplementation(
      (
        _nsid: string,
        _position?: Vector | [x: number, y: number, z: number] | undefined,
        _rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        return deck;
      }
    );

  const obj: GameObject | undefined = Spawn.spawn("a");
  expect(obj).toBe(deck);

  const nsids: Set<string> = new MyAbstractValidate().getCardNsids(
    "card.my-type:"
  );
  expect(nsids).toContain("card.my-type:base/jord");
});

it("getSrcMissingFromDst", () => {
  const src: Set<string> = new Set<string>([
    "card.planet:base/jord",
    "card.planet:base/nar",
  ]);
  const dst: Set<string> = new Set<string>(["card.planet:base/jord"]);
  const missing: Array<string> = new MyAbstractValidate().getSrcMissingFromDst(
    src,
    dst
  );
  expect(missing).toEqual(["card.planet:base/nar"]);
});
