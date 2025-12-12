import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { IGlobal, NSID } from "ttpg-darrell";

export const LOCALE_DESCRIPTIONS: { [key: string]: string } = {
  "card.leader.hero:thunders-edge/entity-4x41a-apollo":
    "Right click the galvanize token with the unit still on it to activate",
  "card.action:thunders-edge/hack-election":
    "Place this card faceup in your play area BEFORE the voting phase",
  "card.action:base/plague": "Type '/plague #' in chat to roll # plague dice",
};

export class ApplyLocaleDescriptions implements IGlobal {
  _onObjectCreated = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const description: string | undefined = LOCALE_DESCRIPTIONS[nsid];
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
