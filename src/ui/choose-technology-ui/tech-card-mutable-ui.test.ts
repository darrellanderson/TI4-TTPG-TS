import { Card, GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { MockCard, MockCardDetails, world } from "ttpg-mock";
import { TechCardMutableUI, ZoomedTechCardUI } from "./tech-card-mutable-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  new TechCardMutableUI(scale).destroy();
});

it("set/clear Card", () => {
  const scale: number = 1;
  const ui: TechCardMutableUI = new TechCardMutableUI(scale);

  const card: Card = new MockCard();
  ui.setCard(card);
  ui.clearCard();
  ui.destroy();
});

it("setCardNsid", () => {
  const origSpawn: (
    nsid: string,
    position?: Vector | [x: number, y: number, z: number] | undefined,
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined
  ) => GameObject | undefined = Spawn.spawn;
  jest
    .spyOn(Spawn, "spawn")
    .mockImplementation(
      (
        nsid: string,
        position?: Vector | [x: number, y: number, z: number] | undefined,
        rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        if (nsid === "card.technology.blue:base/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.technology.blue:base/antimass-deflectors",
              }),
              new MockCardDetails({
                metadata: "x",
              }),
              new MockCardDetails({
                metadata: "y",
              }),
            ],
          });
        }
        return origSpawn(nsid, position, rotation);
      }
    );

  const scale: number = 1;
  const ui: TechCardMutableUI = new TechCardMutableUI(scale);

  ui.setCardNsid("card.technology.blue:base/antimass-deflectors");
  ui.destroy();
});

it("ZoomedTechCardUI", () => {
  const scale: number = 1;
  const cardJson: string = "x";

  jest
    .spyOn(world, "createObjectFromJSON")
    .mockImplementation(
      (
        _json: string,
        _position: Vector | [x: number, y: number, z: number] | undefined,
        _rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        return new MockCard({
          cardDetails: [
            new MockCardDetails({
              metadata: "card.technology.blue:base/antimass-deflectors",
            }),
            new MockCardDetails({
              metadata: "x",
            }),
            new MockCardDetails({
              metadata: "y",
            }),
          ],
        });
      }
    );

  const _zoomedTechCardUi = new ZoomedTechCardUI(scale, cardJson);
});
