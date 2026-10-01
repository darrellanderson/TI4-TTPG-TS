import { GameObject, Package, Rotator, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPackage, mockWorld } from "ttpg-mock";
import { RUN_SCRIPT_NSID, RunInjectScript } from "./run-inject-script";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MOCK_IMP_TYPE = (...args: unknown[]) => any;

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
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined,
  ) => GameObject | undefined = globalThis.TI4.spawn.spawn;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockImp: MOCK_IMP_TYPE = ((
    nsid: string,
    position?: Vector | [x: number, y: number, z: number] | undefined,
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined,
  ): GameObject | undefined => {
    if (nsid === RUN_SCRIPT_NSID) {
      return new MockGameObject();
    }
    return origSpawn(nsid, position, rotation);
  }) as MOCK_IMP_TYPE;

  jest.spyOn(globalThis.TI4.spawn, "spawn").mockImplementation(mockImp);

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
