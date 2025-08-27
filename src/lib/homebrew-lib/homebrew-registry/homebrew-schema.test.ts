import { validateHomebrewModule } from "./homebrew-schema";

it("validate", () => {
  validateHomebrewModule({
    sourceAndPackageId: {
      source: "my-source",
      packageId: "my-package",
    },
  });
});
