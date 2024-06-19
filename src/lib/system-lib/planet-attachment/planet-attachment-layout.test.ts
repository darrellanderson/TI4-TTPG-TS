import { MockGameObject } from "ttpg-mock";
import { Planet } from "../planet/planet";
import { PlanetAttachmentLayout } from "./planet-attachment-layout";
import { PlanetAttachment } from "./planet-attachment";
import { Vector } from "@tabletop-playground/api";

it("static _getOffset", () => {
  let offset: Vector;

  offset = PlanetAttachmentLayout._getOffset(0);
  expect(offset.toString()).toBe("(X=0,Y=-1.05,Z=0)");

  offset = PlanetAttachmentLayout._getOffset(1);
  expect(offset.toString()).toBe("(X=-0.909,Y=0.525,Z=0)");
});

it("constructor", () => {
  new PlanetAttachmentLayout();
});

it("layout", () => {
  const planet = new Planet(
    new MockGameObject(),
    { source: "my-source", packageId: "my-package-id" },
    { name: "my-planet", nsidName: "my-planet-nsid-name" }
  );
  for (let i = 0; i < 6; i++) {
    const attachment = new PlanetAttachment(
      new MockGameObject({
        templateMetadata:
          "token.attachment.planet:my-source/my-attachment-nsid-name",
      }),
      { source: "my-source", packageId: "my-package-id" },
      { name: "my-attachment", nsidName: "my-attachment-nsid-name" }
    );
    planet.addAttachment(attachment);
  }
  new PlanetAttachmentLayout().layout(planet);
});
