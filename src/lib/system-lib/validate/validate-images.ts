import { world } from "@tabletop-playground/api";

export class ValidateImages {
  private readonly _imgToPackageId: Map<string, string> = new Map();

  add(img: string, packageId: string): this {
    this._imgToPackageId.set(img, packageId);
    return this;
  }

  validate(errors: Array<string>): boolean {
    // Get package images as sets.
    const packageIdToImgFiles: Map<string, Set<string>> = new Map();
    for (const packageRef of world.getAllowedPackages()) {
      const packageId: string = packageRef.getUniqueId();
      packageIdToImgFiles.set(
        packageId,
        new Set<string>(packageRef.getTextureFiles()),
      );
    }

    // Verify each image/packageId pair.
    const origErrorsLength: number = errors.length;
    for (const [img, packageId] of this._imgToPackageId.entries()) {
      const imgFiles: Set<string> | undefined =
        packageIdToImgFiles.get(packageId);
      if (!imgFiles) {
        errors.push(`Package id ${packageId} not found`);
      } else if (!imgFiles.has(img)) {
        errors.push(`Image ${img} not found in package ${packageId}`);
      }
    }
    return errors.length === origErrorsLength;
  }

  validateOrThrow(): void {
    const errors: Array<string> = [];
    if (!this.validate(errors)) {
      throw new Error(errors.join("\n"));
    }
  }
}
