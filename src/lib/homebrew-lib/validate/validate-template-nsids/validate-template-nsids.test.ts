import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { ValidateTemplateNsids } from "./validate-template-nsids";
import { Spawn } from "ttpg-darrell";

it("getCommandName", () => {
  const commandName: string = new ValidateTemplateNsids().getCommandName();
  expect(commandName).toBe("template-nsids");
});

it("getDescription", () => {
  const description: string = new ValidateTemplateNsids().getDescription();
  expect(description).toBeDefined();
});

it("getErrors", () => {
  const myNsid: string = "type:source/name";
  globalThis.TI4.spawn.inject({ [myNsid]: "my-template-id" });

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
        if (nsid === myNsid) {
          return new MockGameObject({
            templateMetadata: "my-bad-nsid",
          });
        }
        return origSpawn.apply(spawnInstance, [nsid, position, rotation]);
      }
    );

  globalThis.TI4.spawn.inject({ "my-nsid": "abc123", default: "aaaaa" });

  const errors: Array<string> = [];
  new ValidateTemplateNsids().getErrors(errors);
  expect(errors).toEqual([
    'Registered NSID "type:source/name" creates object with NSID "my-bad-nsid"',
    'NSID "my-nsid" does not spawn an object',
  ]);
});
