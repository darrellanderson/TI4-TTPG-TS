import {
  Card,
  CardHolder,
  DrawingLine,
  GameObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
} from "ttpg-mock";
import { NSID, Spawn } from "ttpg-darrell";
import { ChangeColor } from "./change-color";

it("constructor", () => {
  new ChangeColor(10);
});

it("changeColor", () => {
  new ChangeColor(10).changeColor("red", "#ff0000");
});

it("changeColor (invalid)", () => {
  expect(() => {
    new ChangeColor(10).changeColor("__invalid__", "#ff0000");
  }).toThrow();
});

it("_shouldChangeColor (false)", () => {
  const obj: GameObject = MockGameObject.simple("bad-nsid");
  expect(new ChangeColor(10)._shouldChangeColor(obj)).toBe(false);
});

it("_recolor", () => {
  const objs: Array<GameObject> = [
    MockGameObject.simple("mat:base/status-pad"),
    MockGameObject.simple("sheet:base/command"),
    MockGameObject.simple("sheet:pok/leader"),
    MockGameObject.simple("unit:base/carrier"),
    MockGameObject.simple("unit:pok/mech"),
    MockGameObject.simple("token.command:base/arborec"),
    MockGameObject.simple("token.control:base/arborec"),
  ];
  for (const obj of objs) {
    obj.setOwningPlayerSlot(10);
    expect(obj.getPrimaryColor().toHex()).not.toBe("FE2221FF");
  }

  new ChangeColor(10).changeColor("red", "#ff0000");

  for (const obj of objs) {
    expect(obj.getPrimaryColor().toHex()).toBe("FE2221FF");
  }
});

it("_recolorPlayerAreaBorderLines", () => {
  let drawingLine: DrawingLine | undefined = new DrawingLine();
  drawingLine.tag = "player-area-10";
  world.addDrawingLine(drawingLine);

  expect(drawingLine.color).not.toBe("FE0808FF");

  new ChangeColor(10).changeColor("red", "#ff0000");

  drawingLine = world.getDrawingLines()[0];
  expect(drawingLine?.color.toHex()).toBe("FE0808FF");
});

it("_recolorGenericPromissoryCards", () => {
  const held: Card = MockCard.simple("card.promissory.white:base/ceasefire", {
    isHeld: true,
  });
  const inHolder: Card = MockCard.simple(
    "card.promissory.white:base/political-secret"
  );
  const holder: CardHolder = new MockCardHolder({ cards: [inHolder] });

  expect(globalThis.TI4.playerColor.getSlotColorName(15)).toBe("white");
  expect(held.isValid()).toBe(true);
  expect(inHolder.isValid()).toBe(true);

  // Spawns some decks to find cards.
  const spawnInstance: Spawn = globalThis.TI4.spawn;
  const origSpawn: (
    nsid: string,
    position?: Vector | [x: number, y: number, z: number] | undefined,
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined
  ) => GameObject | undefined = spawnInstance.spawn;
  jest
    .spyOn(spawnInstance, "spawn")
    .mockImplementation(
      (
        nsid: string,
        position?: Vector | [x: number, y: number, z: number] | undefined,
        rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        if (nsid === "card.promissory:base/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.promissory.red:base/ceasefire",
              }),
              new MockCardDetails({
                metadata: "card.promissory.red:base/political-secret",
              }),
              new MockCardDetails({
                metadata: "card.promissory.red:base/__other__",
              }),
              new MockCardDetails({
                metadata: "card.promissory.white:base/ceasefire",
              }),
              new MockCardDetails({
                metadata: "card.promissory.white:base/ceasefire", // illegal duplicate
              }),
            ],
          });
        }
        return origSpawn.apply(spawnInstance, [nsid, position, rotation]);
      }
    );
  new ChangeColor(15).changeColor("red", "#ff0000");

  expect(held.isValid()).toBe(false);
  expect(inHolder.isValid()).toBe(false);

  expect(holder.getCards().map((card) => NSID.get(card))).toEqual([
    "card.promissory.red:base/political-secret",
  ]);

  expect(() => {
    new ChangeColor(15).changeColor("white", "#ffffff");
  }).toThrow();
});
