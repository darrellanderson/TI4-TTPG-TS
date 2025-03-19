import { AbstractUI } from "ui/abstract-ui/abtract-ui";
import { AbstractStrategyCardUI } from "../abstract-strategy-card-ui/abstract-strategy-card-ui";

export class LeadershipUI extends AbstractStrategyCardUI {
  constructor(scale: number, isPlay: boolean) {
    const body: AbstractUI | undefined = undefined;
    super(scale, "Leadership", isPlay, body);
  }

  public getReport(): string | undefined {
    return "Leadership";
  }
}
