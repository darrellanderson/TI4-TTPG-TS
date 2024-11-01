export class ParseLabels {
  parseLabels(config: string): Array<string> {
    let index: number;

    const prefix = "labels=";
    index = config.indexOf(prefix);
    if (index !== -1) {
      config = config.substring(index + prefix.length);
    } else {
      return [];
    }

    const suffix = "&";
    index = config.indexOf(suffix);
    if (index !== -1) {
      config = config.substring(0, index);
    }

    const labels: Array<string> = config.split("|");
    return labels;
  }
}
