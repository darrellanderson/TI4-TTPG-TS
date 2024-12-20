export class ParseLabels {
  parseLabels(config: string): Array<string> | undefined {
    let index: number;

    const prefix = "labels=";
    index = config.indexOf(prefix);
    if (index !== -1) {
      config = config.substring(index + prefix.length);
    } else {
      // labels= MUST exist to find them.
      return undefined;
    }

    const suffix = "&";
    index = config.indexOf(suffix);
    if (index !== -1) {
      config = config.substring(0, index);
    }

    const labels: Array<string> = config
      .split("|")
      .filter((label) => label.length > 0);
    return labels.length > 0 ? labels : undefined;
  }
}
