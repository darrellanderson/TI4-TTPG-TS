import { MockContainer, MockDrawingLine, MockGameObject } from "ttpg-mock";
import { scrubAll } from "./scrub-all";
import { world } from "@tabletop-playground/api";

it("scrub", () => {
  MockGameObject.simple("nsid");
  new MockContainer({ items: [MockGameObject.simple("nsid")] });
  world.addDrawingLine(new MockDrawingLine());
  world.createZone([0, 0, 0]);

  scrubAll(undefined);
});
