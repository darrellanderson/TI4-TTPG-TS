import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
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
  globalThis.TI4.spawn.inject({ [deckNsid]: templateId });

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
        if (nsid === deckNsid) {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.planet:my-source/my-name",
              }),
            ],
          });
        }
        return origSpawn.apply(spawnInstance, [nsid, position, rotation]);
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
