import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { ValidateTemplateNsids } from "./validate-template-nsids";

it("getErrors", () => {
  const myNsid: string = "type:source/name";
  Spawn.inject({ [myNsid]: "my-template-id" });

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
        if (nsid === myNsid) {
          return new MockGameObject({
            templateMetadata: "my-bad-nsid",
          });
        }
        return origSpawn(nsid, position, rotation);
      }
    );

  const errors: Array<string> = [];
  new ValidateTemplateNsids().getErrors(errors);
  expect(errors).toEqual([
    'Registered NSID "type:source/name" creates object with NSID "my-bad-nsid"',
  ]);
});
