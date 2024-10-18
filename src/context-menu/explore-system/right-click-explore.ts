import {
  Card,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  DeletedItemsContainer,
  Find,
  IGlobal,
  NSID,
} from "ttpg-darrell";

import { Planet } from "../../lib/system-lib/planet/planet";
import { System } from "../../lib/system-lib/system/system";
import { TraitSchemaType } from "../../lib/system-lib/schema/basic-types-schema";

export class RightClickExplore implements IGlobal {
  private readonly _find: Find = new Find();

  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === "*Explore Frontier") {
      this._exploreFrontierToken(obj, player);
      return;
    }

    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    if (system) {
      const parts: string[] = identifier.split(" ");
      let trait: string | undefined = parts.pop();
      parts.shift(); // remove "*Explore"
      const planetName: string = parts.join(" ");
      if (trait && planetName) {
        trait = trait.substring(1, trait.length - 1); // remove parens
        for (const planet of system.getPlanets()) {
          if (planet.getName() === planetName) {
            this._explorePlanet(planet, trait as TraitSchemaType, player);
          }
        }
      }
    }
  };

  init(): void {
    const skipContained = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeSetCustomActions(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeSetCustomActions(obj);
    });
  }

  _maybeSetCustomActions(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.system:")) {
      this._setSystemCustomActions(obj);
    } else if (nsid === "token.attachment.system:pok/frontier") {
      this._setFrontierTokenCustomActions(obj);
    }
  }

  _setSystemCustomActions(systemTileObj: GameObject) {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      systemTileObj.getId()
    );
    if (system) {
      systemTileObj.onCustomAction.remove(this._customActionHandler);
      systemTileObj.onCustomAction.add(this._customActionHandler);
      for (const planet of system.getPlanets()) {
        const planetName: string = planet.getName();
        for (const trait of ["cultural", "hazardous", "industrial"]) {
          const actionName: string = `*Explore ${planetName} (${trait})`;
          systemTileObj.removeCustomAction(actionName);
          if (planet.getTraits().includes(trait)) {
            systemTileObj.addCustomAction(actionName);
          }
        }
      }
    }
  }

  _setFrontierTokenCustomActions(frontierTokenObj: GameObject) {
    frontierTokenObj.onCustomAction.remove(this._customActionHandler);
    frontierTokenObj.onCustomAction.add(this._customActionHandler);
    const actionName: string = `*Explore Frontier`;
    frontierTokenObj.removeCustomAction(actionName);
    frontierTokenObj.addCustomAction(actionName);
  }

  _getExploreDeck(trait: TraitSchemaType | "frontier"): Card | undefined {
    const deckTag: string = `deck-exploration-${trait}`;
    const discardTag: string = `discard-exploration-${trait}`;
    const shuffleDiscard: boolean = true;
    const deck: Card | undefined = this._find.findDeckOrDiscard(
      deckTag,
      discardTag,
      shuffleDiscard
    );
    return deck;
  }

  _explorePlanet(planet: Planet, trait: TraitSchemaType, player: Player): void {
    let deck: Card | undefined = this._getExploreDeck(trait);
    let card: Card | undefined = undefined;
    if (deck) {
      if (deck.getStackSize() > 1) {
        card = deck.takeCards(1);
      } else if (deck.getStackSize() === 1) {
        card = deck;
        deck = undefined;
      }
    }
    if (card) {
      const pos: Vector = planet.getPosition();
      const animSpeed: number = 1;
      card.setPosition(pos.add([0, 0, 10]), animSpeed);
      card.setRotation([0, 0, 180]);
      card.snapToGround();

      const playerName: string = player.getName();
      const planetName: string = planet.getName();
      const cardName: string = card.getCardDetails().name;
      const msg: string = `${playerName} explored ${planetName} (${trait}): ${cardName}`;
      Broadcast.chatAll(msg, player.getPlayerColor());
    }
  }

  _exploreFrontierToken(frontierTokenObj: GameObject, player: Player): void {
    let deck: Card | undefined = this._getExploreDeck("frontier");
    let card: Card | undefined = undefined;
    if (deck) {
      if (deck.getStackSize() > 1) {
        card = deck.takeCards(1);
      } else if (deck.getStackSize() === 1) {
        card = deck;
        deck = undefined;
      }
    }
    if (card) {
      const pos: Vector = frontierTokenObj.getPosition();
      const animSpeed: number = 1;
      card.setPosition(pos.add([0, 0, 10]), animSpeed);
      card.setRotation([0, 0, 180]);
      card.snapToGround();

      const playerName: string = player.getName();
      const cardName: string = card.getCardDetails().name;
      const msg: string = `${playerName} explored frontier: ${cardName}`;
      Broadcast.chatAll(msg, player.getPlayerColor());

      DeletedItemsContainer.destroyWithoutCopying(frontierTokenObj);
    }
  }
}
