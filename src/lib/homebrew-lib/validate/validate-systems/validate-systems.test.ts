import { SourceAndPackageIdSchemaType } from "../../../system-lib/schema/basic-types-schema";
import { SystemSchemaType } from "../../../system-lib/schema/system-schema";
import { ValidateSystems } from "./validate-systems";

it("getCommandName", () => {
  const validateSystems = new ValidateSystems();
  expect(validateSystems.getCommandName()).toBe("systems");
});

it("getDescription", () => {
  const validateSystems = new ValidateSystems();
  expect(validateSystems.getDescription()).toBeDefined();
});

it("getErrors", () => {
  const errors: Array<string> = [];
  new ValidateSystems().getErrors(errors);
  expect(errors).toHaveLength(0); // Assuming no missing templates in the test environment
});

it("getErrors (missing templates)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const systemSchema: SystemSchemaType = {
    tile: 9000,
  };

  TI4.systemRegistry.load(sourceAndPackageId, [systemSchema]);

  const errors: Array<string> = [];
  new ValidateSystems().getErrors(errors);
  expect(errors).toHaveLength(1);
  expect(errors[0]).toEqual(
    "System tiles missing templates: tile.system:my-source/9000"
  );
});
