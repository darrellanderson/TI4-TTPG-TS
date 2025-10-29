import { IGlobal } from "ttpg-darrell";
import { TFUnpackFaction } from "../../lib/twilights-fall-lib/tf-unpack-faction/tf-unpack-faction";
import { TFUnpackHomeSystem } from "../../lib/twilights-fall-lib/tf-unpack-home-system/tf-unpack-home-system";
import { TFUnpackStartingUnits } from "../../lib/twilights-fall-lib/tf-unpack-starting-units/tf-unpack-starting-units";
import { TFSetupDecks } from "../../lib/twilights-fall-lib/setup/tf-setup-decks";
import { TFSetupStrategyCards } from "../../lib/twilights-fall-lib/setup/tf-setup-strategy-cards";
import { TFSetupFactionSheets } from "../../lib/twilights-fall-lib/setup/tf-setup-faction-sheets";
import { TFSetupPrune } from "../../lib/twilights-fall-lib/setup/tf-setup-prune";

export class OnStartTwilightsFall implements IGlobal {
  init(): void {
    TI4.events.onStartGameComplete.add(() => {
      if (TI4.config.sources.includes("twilights-fall")) {
        this._addContextMenus();
        this._setup();
      }
    });

    // If loading an in-progress save game add some listeners.
    if (TI4.config.sources.includes("twilights-fall")) {
      this._addContextMenus();
    }
  }

  _addContextMenus(): void {
    TFUnpackFaction.addContextMenuToFactionSheets();
    TFUnpackHomeSystem.addContextMenuToFactionReferenceCards();
    TFUnpackStartingUnits.addContextMenuToFactionReferenceCards();
  }

  _setup(): void {
    new TFSetupDecks().setup();
    new TFSetupStrategyCards().setup();
    new TFSetupFactionSheets().setup();
    new TFSetupPrune().setup();
  }
}
