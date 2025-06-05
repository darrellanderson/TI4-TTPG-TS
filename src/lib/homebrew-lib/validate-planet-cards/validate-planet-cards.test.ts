import { Card, GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { ValidatePlanetCards } from "./validate-planet-cards";
import { MockCard, MockCardDetails } from "ttpg-mock";
import { Spawn } from "ttpg-darrell";

it("getCommandName", () => {
  const commandName: string = new ValidatePlanetCards().getCommandName();
  expect(commandName).toBe("planet-cards");
});

it("getDescription", () => {
  const description: string = new ValidatePlanetCards().getDescription();
  expect(description).toBeDefined();
});

it("getErrors", () => {
  const deckNsid: string = "card.planet:my-source";
  const templateId: string = "abcd1234";
  Spawn.inject({ [deckNsid]: templateId });

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
        if (nsid === deckNsid) {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.planet:my-source/my-name",
              }),
            ],
          });
        }
        return origSpawn(nsid, position, rotation);
      }
    );

  const errors: Array<string> = [];
  new ValidatePlanetCards().getErrors(errors);
  expect(errors).toHaveLength(2);
});

it("_getRegisteredPlanetCardNsids", () => {
  const nsids: Set<string> =
    new ValidatePlanetCards()._getRegisteredPlanetCardNsids();
  expect(nsids).toContain("card.planet:base/jord");
});

it("_getDeckPlanetCards", () => {
  const deck: Card | undefined =
    new ValidatePlanetCards()._getDeckPlanetCards();
  expect(deck).toBeDefined();
});

it("_getDeckPlanetCardNsids", () => {
  const deck: Card = new MockCard({
    cardDetails: [new MockCardDetails({ metadata: "card.planet:base/jord" })],
  });
  const nsids: Set<string> = new ValidatePlanetCards()._getDeckPlanetCardNsids(
    deck
  );
  expect(nsids).toContain("card.planet:base/jord");
});

it("_getSrcMissingFromDst", () => {
  const src: Set<string> = new Set<string>([
    "card.planet:base/jord",
    "card.planet:base/nar",
  ]);
  const dst: Set<string> = new Set<string>(["card.planet:base/jord"]);
  const missing: Array<string> =
    new ValidatePlanetCards()._getSrcMissingFromDst(src, dst);
  expect(missing).toEqual(["card.planet:base/nar"]);
});
