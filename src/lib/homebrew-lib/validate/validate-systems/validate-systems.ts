import { AbstractValidate } from "../abstract-validate/abstract-validate";

export class ValidateSystems extends AbstractValidate {
  getCommandName(): string {
    return "systems";
  }

  getDescription(): string {
    return "Verify system tiles have objects";
  }

  getErrors(errors: Array<string>): void {
    const tileNumbers: Array<number> =
      TI4.systemRegistry.getAllSystemTileNumbers();

    const missingTemplateNsids: Array<string> = [];

    for (const tileNumber of tileNumbers) {
      const nsid: string | undefined =
        TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
      if (nsid && !TI4.spawn.has(nsid)) {
        missingTemplateNsids.push(nsid);
      }
    }

    if (missingTemplateNsids.length > 0) {
      errors.push(
        `System tiles missing templates: ${missingTemplateNsids.join(", ")}`
      );
    }
  }
}
