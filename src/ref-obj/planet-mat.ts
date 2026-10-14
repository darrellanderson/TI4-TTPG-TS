import {
  Card,
  GameObject,
  Player,
  refObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { CardUtil, NSID } from "ttpg-darrell";
import { System } from "../lib/system-lib/system/system";

export class PlanetMat {
  private readonly _obj: GameObject;
  private readonly _actionNameToPlanetCardNsid: Map<string, string> = new Map();

  private readonly _onSystemActivatedHandler = (
    system: System,
    _player: Player,
  ) => {
    for (const actionName of this._actionNameToPlanetCardNsid.keys()) {
      this._obj.removeCustomAction(actionName);
    }
    for (const planet of system.getPlanets()) {
      const actionName: string = "*Fetch " + planet.getName();
      const nsid: string = planet.getPlanetCardNsid();
      this._actionNameToPlanetCardNsid.set(actionName, nsid);
      this._obj.addCustomAction(actionName);
    }
  };

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
            planetCard.snapToGround();

            const planetName = actionName.substring("*Fetch ".length);
            const token = world
              .getAllObjects()
              .find((candidateObj: GameObject): boolean => {
                return (
                  NSID.get(candidateObj).startsWith("token.space-station:") &&
                  candidateObj.getName() === planetName
                );
              });
            if (token) {
              token.setPosition(pos.add([0, 0, 5]));
              token.snapToGround();
            }
          }
        }
      },
    );

    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);

    this._obj.onDestroyed.add(() => {
      TI4.events.onSystemActivated.remove(this._onSystemActivatedHandler);
    });
  }
}

new PlanetMat(refObject);
