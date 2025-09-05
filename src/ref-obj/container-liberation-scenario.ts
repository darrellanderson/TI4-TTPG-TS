import {
  Card,
  Container,
  GameObject,
  refContainer,
} from "@tabletop-playground/api";
import { CardUtil, Find } from "ttpg-darrell";

/**
 * Codex 4: Liberation of Ordinian
 */
class ContainerLiberationScenario {
  private readonly _container: Container;

  private readonly _onStartGameComplete = (): void => {
    const find: Find = new Find();
    const cardUtil: CardUtil = new CardUtil();

    // Move ordinian system tile, planet and legendary card here.
    const ordinianSystemTile: GameObject | undefined = find.findGameObject(
      "tile.system:codex.liberation/1800"
    );
    if (ordinianSystemTile) {
      this._addToContainer(ordinianSystemTile);
    }

    const ordinianPlanet: Card | undefined = cardUtil.fetchCard(
      "card.planet:codex.liberation/ordinian"
    );
    if (ordinianPlanet) {
      this._addToContainer(ordinianPlanet);
    }

    const ordinianLegendary: Card | undefined = cardUtil.fetchCard(
      "card.legendary-planet:codex.liberation/barren-husk"
    );
    if (ordinianLegendary) {
      this._addToContainer(ordinianLegendary);
    }

    // Spawn leaders.
    const leaders: GameObject | undefined = TI4.spawn.spawn(
      "card.leader:codex.liberation/0"
    );
    if (leaders) {
      this._addToContainer(leaders);
    }

    // Spawn techs.
    const redTechs: GameObject | undefined = TI4.spawn.spawn(
      "card.technology.red:codex.liberation/0"
    );
    if (redTechs) {
      this._addToContainer(redTechs);
    }
    const yellowTechs: GameObject | undefined = TI4.spawn.spawn(
      "card.technology.yellow:codex.liberation/null-reference"
    );
    if (yellowTechs) {
      this._addToContainer(yellowTechs);
    }

    // Spawn objectives.
    const public1: GameObject | undefined = TI4.spawn.spawn(
      "card.objective.public-1:codex.liberation/liberate-ordinian"
    );
    if (public1) {
      this._addToContainer(public1);
    }
    const public2: GameObject | undefined = TI4.spawn.spawn(
      "card.objective.public-2:codex.liberation/control-ordinian"
    );
    if (public2) {
      this._addToContainer(public2);
    }
  };

  constructor(gameObject: GameObject) {
    if (!(gameObject instanceof Container)) {
      throw new Error(
        "ContainerLiberationScenario requires a Container object."
      );
    }
    this._container = gameObject;

    TI4.events.onStartGameComplete.add(this._onStartGameComplete);
  }

  _addToContainer(gameObject: GameObject): void {
    const inside: Container | undefined = gameObject.getContainer();
    if (inside) {
      const above = inside.getPosition().add([0, 0, 10]);
      inside.take(gameObject, above);
    }
    this._container.addObjects([gameObject]);
  }
}

new ContainerLiberationScenario(refContainer);
