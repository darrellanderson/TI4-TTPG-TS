import { HomebrewRegistry } from "./homebrew-registry";

it("load", () => {
  const homebrewRegistry = new HomebrewRegistry();
  homebrewRegistry.load({
    sourceAndPackageId: {
      source: "test-source",
      packageId: "test-package",
    },
    factions: [],
    systems: [],
    planetAttachments: [],
    systemAttachments: [],
    unitAttrs: [],
    unitModifiers: [],
    remove: [],
    nsidToTemplateId: { ["card.action:homebrew/0"]: "templateId" },
    technologies: [],
  });
});
