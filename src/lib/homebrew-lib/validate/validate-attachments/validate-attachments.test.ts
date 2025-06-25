import { PlanetAttachmentSchemaType } from "../../../system-lib/schema/planet-attachment-schema";
import { SourceAndPackageIdSchemaType } from "../../../system-lib/schema/basic-types-schema";
import { SystemAttachmentSchemaType } from "../../../system-lib/schema/system-attachment-schema";
import { ValidateAttachments } from "./validate-attachments";

it("getCommandName", () => {
  const validateAttachments = new ValidateAttachments();
  expect(validateAttachments.getCommandName()).toBe("attachments");
});

it("getDescription", () => {
  const validateAttachments = new ValidateAttachments();
  expect(validateAttachments.getDescription()).toBeDefined();
});

it("getErrors (none)", () => {
  const validateAttachments = new ValidateAttachments();
  const errors: Array<string> = [];
  validateAttachments.getErrors(errors);
  expect(errors).toBeDefined();
  expect(errors.length).toBe(0);
});

it("getErrors (exist)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };

  const planetAttachment: PlanetAttachmentSchemaType = {
    name: "my planet attachment",
    nsidName: "my-planet-attachment",
  };
  TI4.planetAttachmentRegistry.load(sourceAndPackageId, [planetAttachment]);

  const systemAttachment: SystemAttachmentSchemaType = {
    name: "my system attachment",
    nsidName: "my-system-attachment",
  };
  TI4.systemAttachmentRegistry.load(sourceAndPackageId, [systemAttachment]);

  const validateAttachments = new ValidateAttachments();
  const errors: Array<string> = [];
  validateAttachments.getErrors(errors);
  expect(errors).toBeDefined();
  expect(errors.length).toBe(1);
  expect(errors[0]).toBe(
    "Attachments missing templates: token.attachment.planet:my-source/my-planet-attachment, token.attachment.system:my-source/my-system-attachment"
  );
});
