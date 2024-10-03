import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleTokenAttachment } from "./recycle-token-attachment";

it("recycle", () => {
  const token = MockGameObject.simple(
    "token.attachment.planet:my-source/my-name"
  );
  new MockContainer({
    id: "my-container-id",
    templateMetadata: "container.token:base/attachment",
  });

  expect(token.getContainer()).toBeUndefined();

  const recycle = new RecycleTokenAttachment();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(true);

  expect(token.getContainer()?.getId()).toEqual("my-container-id");
});

it("recycle (no container)", () => {
  const token = MockGameObject.simple(
    "token.attachment.planet:my-source/my-name"
  );
  expect(token.getContainer()).toBeUndefined();

  const recycle = new RecycleTokenAttachment();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(false);
});

it("recycle (frontier token handled elsewhere)", () => {
  const token = MockGameObject.simple("token.attachment.system:pok/frontier");
  const recycle = new RecycleTokenAttachment();
  expect(recycle.canRecycle(token)).toBe(false);
});
