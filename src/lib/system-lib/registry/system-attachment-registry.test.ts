import { SystemAttachmentRegistry } from "./system-attachment-registry";

it("constuctor", () => {
  const registry = new SystemAttachmentRegistry();
  expect(registry).toBeInstanceOf(SystemAttachmentRegistry);
});
