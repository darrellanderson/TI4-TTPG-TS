import {
  Card,
  Container,
  GameObject,
  refContainer,
} from "@tabletop-playground/api";
import { CardUtil } from "ttpg-darrell";

/**
 * Codex 4: Liberation of Ordinian
 */
class ContainerLiberationScenario {
  private readonly _container: Container;

  private readonly _onStartGameComplete = (): void => {
    let nsid: string = "";
    const cardUtil: CardUtil = new CardUtil();

    // Move ordinian system tile, planet and legendary card here.
    nsid = "tile.system:codex.liberation/1800";
    const ordinianSystemTile: GameObject | undefined = TI4.spawn.spawn(nsid);
    if (ordinianSystemTile) {
      this._addToContainer(ordinianSystemTile);
    }

    nsid = "card.planet:codex.liberation/ordinian";
    const ordinianPlanet: Card | undefined = cardUtil.fetchCard(nsid);
    if (ordinianPlanet) {
      this._addToContainer(ordinianPlanet);
    }

    nsid = "card.legendary-planet:codex.liberation/barren-husk";
    const ordinianLegendary: Card | undefined = cardUtil.fetchCard(nsid);
    if (ordinianLegendary) {
      this._addToContainer(ordinianLegendary);
    }

    // Spawn leaders.
    nsid = "card.leader:codex.liberation/0";
    const leaders: GameObject | undefined = TI4.spawn.spawn(nsid);
    if (leaders) {
      this._addToContainer(leaders);
    }

    // Spawn techs.
    nsid = "card.technology.red:codex.liberation/0";
    const redTechs: GameObject | undefined = TI4.spawn.spawn(nsid);
    if (redTechs) {
      this._addToContainer(redTechs);
    }

    nsid = "card.technology.yellow:codex.liberation/null-reference";
    const yellowTechs: GameObject | undefined = TI4.spawn.spawn(nsid);
    if (yellowTechs) {
      this._addToContainer(yellowTechs);
    }

    // Spawn objectives.
    nsid = "card.objective.public-1:codex.liberation/liberate-ordinian";
    const public1: GameObject | undefined = TI4.spawn.spawn(nsid);
    if (public1) {
      this._addToContainer(public1);
    }

    nsid = "card.objective.public-2:codex.liberation/control-ordinian";
    const public2: GameObject | undefined = TI4.spawn.spawn(nsid);
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
