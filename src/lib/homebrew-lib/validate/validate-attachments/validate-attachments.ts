import { AbstractValidate } from "../abstract-validate/abstract-validate";

export class ValidateAttachments extends AbstractValidate {
  getCommandName(): string {
    return "attachments";
  }

  getDescription(): string {
    return "Verify attachment objects exist";
  }

  getErrors(errors: Array<string>): void {
    const missingTemplateNsids: Array<string> = [];
    let nsids: Array<string>;

    nsids = this._getPlanetAttachmentNsids();
    for (const nsid of nsids) {
      if (!TI4.spawn.has(nsid)) {
        missingTemplateNsids.push(nsid);
      }
    }

    nsids = this._getSystemAttachmentNsids();
    for (const nsid of nsids) {
      if (!TI4.spawn.has(nsid)) {
        missingTemplateNsids.push(nsid);
      }
    }

    if (missingTemplateNsids.length > 0) {
      errors.push(
        `Attachments missing templates: ${missingTemplateNsids.join(", ")}`
      );
    }
  }

  _getPlanetAttachmentNsids(): Array<string> {
    return TI4.planetAttachmentRegistry.getAllNsids();
  }

  _getSystemAttachmentNsids(): Array<string> {
    return TI4.systemAttachmentRegistry.getAllNsids();
  }
}
