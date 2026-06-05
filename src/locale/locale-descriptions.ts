import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { IGlobal, NSID } from "ttpg-darrell";
import { NSID_TO_DESCRIPTION } from "./extracted-descriptions";

export const LOCALE_DESCRIPTIONS: { [key: string]: string } = {
  "card.action:base/plague": "Type '/plague #' in chat to roll # plague dice",

  "card.action:thunders-edge/hack-election":
    "Place this card faceup in your play area BEFORE the voting phase",

  "card.leader.hero:thunders-edge/entity-4x41a-apollo":
    "Right click the galvanize token with the unit still on it to activate",

  "card.technology.yellow:codex.vigil/executive-order":
    "Shift-drag from the Agenda deck to draw the bottom card",
};

export class ApplyLocaleDescriptions implements IGlobal {
  _onObjectCreated = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    let description: string | undefined = LOCALE_DESCRIPTIONS[nsid];
    if (!description) {
      description = NSID_TO_DESCRIPTION[nsid];
    }
    if (description) {
      obj.setDescription(description);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.remove(this._onObjectCreated);
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._onObjectCreated(obj);
    }
  }
}
