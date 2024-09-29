import { Package } from "@tabletop-playground/api";
import { ValidateImages } from "./validate-images";
import { MockPackage, mockWorld } from "ttpg-mock";

it("validateOrThrow (valid)", () => {
  const myPackage: Package = new MockPackage({
    textureFiles: ["my-img"],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  const validateImages = new ValidateImages();
  validateImages.add("my-img", "my-package-id");
  validateImages.validateOrThrow();
});

it("validateOrThrow (missing package)", () => {
  const validateImages = new ValidateImages();
  validateImages.add("my-img", "my-package-id");
  expect(() => validateImages.validateOrThrow()).toThrow(
    "Package id my-package-id not found",
  );
});

it("validateOrThrow (has package, missing img)", () => {
  const myPackage: Package = new MockPackage({
    textureFiles: [""],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  const validateImages = new ValidateImages();
  validateImages.add("my-img", "my-package-id");
  expect(() => validateImages.validateOrThrow()).toThrow(
    "Image my-img not found in package my-package-id",
  );
});
