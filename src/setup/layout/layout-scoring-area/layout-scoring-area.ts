import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutObjectives } from "./layout-objectives";
import { LayoutPlayerSecrets } from "./layout-player-secrets";
import { LayoutAgendaLawsMat } from "./layout-agenda-laws-mat";
import { LayoutTimer } from "./layout-timer";

export class LayoutScoringArea {
  private readonly _layout: LayoutObjects;

  constructor(playerCount: number) {
    const layoutObjectives: LayoutObjectives = new LayoutObjectives();
    const layoutPlayerSecrets: LayoutPlayerSecrets = new LayoutPlayerSecrets(
      playerCount,
    );
    const layoutAgendaLawsMat: LayoutAgendaLawsMat = new LayoutAgendaLawsMat();

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(new LayoutTimer().getLayout())
      .add(layoutObjectives.getLayout())
      .add(layoutPlayerSecrets.getLayout())
      .add(layoutAgendaLawsMat.getLayout());
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
