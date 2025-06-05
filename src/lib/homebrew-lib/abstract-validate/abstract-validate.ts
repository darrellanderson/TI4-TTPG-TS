export abstract class AbstractValidate {
  abstract getCommandName(): string;

  abstract getDescription(): string;

  /**
   * Get the errors from the validation.
   * @param errors The array to populate with errors.
   */
  abstract getErrors(errors: Array<string>): void;
}
