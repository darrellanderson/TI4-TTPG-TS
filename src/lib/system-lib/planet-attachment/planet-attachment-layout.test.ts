import { PlanetAttachmentLayout } from "./planet-attachment-layout";

it("static _getOffset", () => {
  const offset = PlanetAttachmentLayout._getOffset(0);
  expect(offset.toString()).toBe("(X=0,Y=-1.05,Z=0)");
});

it("constructor", () => {
  new PlanetAttachmentLayout();
});
