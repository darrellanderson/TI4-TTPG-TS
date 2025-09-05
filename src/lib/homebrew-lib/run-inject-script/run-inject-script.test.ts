import { GameObject, Package, Rotator, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPackage, mockWorld } from "ttpg-mock";
import { RUN_SCRIPT_NSID, RunInjectScript } from "./run-inject-script";

it("constructor/init", () => {
  new RunInjectScript().init();
});

it("package at init time", () => {
  const mockConsole = jest
    .spyOn(global.console, "log")
    .mockImplementation(() => {});

  const pkg: Package = new MockPackage({
    isAllowed: true,
    scriptFiles: ["inject.js", "foo/inject.js"],
  });
  expect(pkg.getScriptFiles()).toEqual(["inject.js", "foo/inject.js"]);
  mockWorld._reset({
    packages: [pkg],
  });

  const origSpawn: (
    nsid: string,
    position?: Vector | [x: number, y: number, z: number] | undefined,
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined
  ) => GameObject | undefined = globalThis.TI4.spawn.spawn;
  jest
    .spyOn(globalThis.TI4.spawn, "spawn")
    .mockImplementation(
      (
        nsid: string,
        position?: Vector | [x: number, y: number, z: number] | undefined,
        rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        if (nsid === RUN_SCRIPT_NSID) {
          return new MockGameObject();
        }
        return origSpawn(nsid, position, rotation);
      }
    );

  new RunInjectScript().init();
  process.flushTicks();

  mockConsole.mockRestore();
});

it("package added later", () => {
  const mockConsole = jest
    .spyOn(global.console, "log")
    .mockImplementation(() => {});

  const pkg: Package = new MockPackage({
    isAllowed: true,
    scriptFiles: ["inject.js"],
  });
  const runInjectScript = new RunInjectScript();
  runInjectScript.init();
  runInjectScript._onPackageAdded(pkg);
  process.flushTicks();

  mockConsole.mockRestore();
});
