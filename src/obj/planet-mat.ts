import {
  Card,
  GameObject,
  Player,
  refObject,
  Vector,
} from "@tabletop-playground/api";
import { CardUtil } from "ttpg-darrell";
import { System } from "../lib/system-lib/system/system";

export class PlanetMat {
  private readonly _obj: GameObject;
  private readonly _actionNameToPlanetCardNsid: Map<string, string> = new Map();

  constructor(obj: GameObject) {
    this._obj = obj;

    this._obj.onCustomAction.add(
      (_obj: GameObject, _player: Player, actionName: string) => {
        const nsid: string | undefined =
          this._actionNameToPlanetCardNsid.get(actionName);
        if (nsid) {
          const cardUtil: CardUtil = new CardUtil();
          const planetCard: Card | undefined = cardUtil.fetchCard(nsid);
          if (planetCard) {
            const pos: Vector = this._obj.getPosition().add([0, 0, 10]);
            planetCard.setPosition(pos);
            planetCard?.snapToGround();
          }
        }
      }
    );

    TI4.events.onSystemActivated.add((system: System, _player: Player) => {
      for (const actionName of this._actionNameToPlanetCardNsid.keys()) {
        this._obj.removeCustomAction(actionName);
      }
      for (const planet of system.getPlanets()) {
        const actionName: string = "*Fetch " + planet.getName();
        const nsid: string = planet.getPlanetCardNsid();
        this._actionNameToPlanetCardNsid.set(actionName, nsid);
        this._obj.addCustomAction(actionName);
      }
    });
  }
}

new PlanetMat(refObject);
