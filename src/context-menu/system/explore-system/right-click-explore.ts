import {
  Button,
  Card,
  Container,
  GameObject,
  globalEvents,
  Player,
  Rotator,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  DeletedItemsContainer,
  Find,
  GarbageContainer,
  HexType,
  IGlobal,
  NSID,
} from "ttpg-darrell";

import { Planet } from "../../../lib/system-lib/planet/planet";
import { System } from "../../../lib/system-lib/system/system";
import { TraitSchemaType } from "../../../lib/system-lib/schema/basic-types-schema";
import { PlanetAttachment } from "../../../lib/system-lib/planet-attachment/planet-attachment";
import { SystemAttachment } from "../../../lib/system-lib/system-attachment/system-attachment";

export class RightClickExplore implements IGlobal {
  private readonly _find: Find = new Find();
  private _isDistantSuns: boolean = false;

  static _checkIsDistantSuns(): boolean {
    for (const faction of TI4.factionRegistry
      .getPlayerSlotToFaction()
      .values()) {
      if (
        faction.getAbilityNsids().includes("faction-ability:pok/distant-suns")
      ) {
        return true;
      }
    }
    return false;
  }

  private readonly _onFactionsChanged = (): void => {
    const before: boolean = this._isDistantSuns;
    this._isDistantSuns = RightClickExplore._checkIsDistantSuns();

    // If the Distant Suns ability was added or removed, update tiles.
    if (this._isDistantSuns !== before) {
      const skipContained = false;
      for (const obj of world.getAllObjects(skipContained)) {
        this._maybeSetCustomActions(obj);
      }
    }
  };

  private readonly _onSystemChanged = (system: System): void => {
    this._setSystemCustomActions(system.getObj());
  };

  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === "*Explore Frontier") {
      const frontierTokenObj: GameObject | undefined =
        this._getFrontierToken(obj);
      if (frontierTokenObj) {
        this._exploreFrontierToken(frontierTokenObj, player);
      } else {
        const msg: string = "Explore failed: missing frontier token";
        Broadcast.chatOne(player, msg);
      }
      return;
    }

    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    if (system) {
      const parts: string[] = identifier.split(" ");
      const actionPart: string | undefined = parts.shift(); // remove "*Explore"
      let trait: string | undefined = parts.pop();
      const planetName: string = parts.join(" ");
      if (actionPart && trait && planetName) {
        trait = trait.substring(1, trait.length - 1); // remove parens
        for (const planet of system.getPlanets()) {
          if (planet.getName() === planetName) {
            if (actionPart === "*Explore") {
              this._explorePlanet(
                system,
                planet,
                trait as TraitSchemaType,
                player
              );
            }
            if (actionPart === "*Distant-Suns") {
              this._exploreDistantSuns(
                system,
                planet,
                trait as TraitSchemaType,
                player
              );
            }
          }
        }
      }
    }
  };

  init(): void {
    this._isDistantSuns = RightClickExplore._checkIsDistantSuns();
    const skipContained = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeSetCustomActions(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeSetCustomActions(obj);
    });
    TI4.events.onSystemChanged.add(this._onSystemChanged);

    TI4.events.onFactionChanged.add(this._onFactionsChanged);
  }

  _maybeSetCustomActions(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.system:")) {
      this._setSystemCustomActions(obj);
    }
  }

  _setSystemCustomActions(systemTileObj: GameObject) {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      systemTileObj.getId()
    );
    if (system) {
      systemTileObj.onCustomAction.remove(this._customActionHandler);
      systemTileObj.onCustomAction.add(this._customActionHandler);

      const allTraits: boolean =
        system.getObj().getSavedData("minorFactionsTraits") === "true";

      // Regular explore actions.
      for (const planet of system.getPlanets()) {
        const planetName: string = planet.getName();
        for (const trait of ["cultural", "hazardous", "industrial"]) {
          const actionName: string = `*Explore ${planetName} (${trait})`;
          systemTileObj.removeCustomAction(actionName);
          if (planet.getTraits().includes(trait) || allTraits) {
            systemTileObj.addCustomAction(actionName);
          }
        }
      }

      // Add Distant Suns actions.
      for (const planet of system.getPlanets()) {
        const planetName: string = planet.getName();
        for (const trait of ["cultural", "hazardous", "industrial"]) {
          const actionName: string = `*Distant-Suns ${planetName} (${trait})`;
          const tooltip: string = "Naaz-Rokha with mech: draw 2, choose 1";
          systemTileObj.removeCustomAction(actionName);
          if (this._isDistantSuns && planet.getTraits().includes(trait)) {
            systemTileObj.addCustomAction(actionName, tooltip);
          }
        }
      }

      // Frontier exploration.
      const actionFrontier: string = `*Explore Frontier`;
      systemTileObj.removeCustomAction(actionFrontier);
      if (
        system.getSystemTileNumber() > 0 &&
        system.getPlanets().filter((planet: Planet): boolean => {
          return !planet.isSpaceStation();
        }).length === 0
      ) {
        systemTileObj.addCustomAction(actionFrontier);
      }
    }
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

  _getFrontierToken(systemTileObj: GameObject): GameObject | undefined {
    const pos: Vector = systemTileObj.getPosition();
    const systemHex: HexType = TI4.hex.fromPosition(pos);
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "token.attachment.system:pok/frontier") {
        const objHex: HexType = TI4.hex.fromPosition(obj.getPosition());
        if (systemHex === objHex) {
          return obj;
        }
      }
    }
  }

  _explorePlanet(
    system: System,
    planet: Planet,
    trait: TraitSchemaType,
    player: Player
  ): void {
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
      this._applyExploreCardToPlanet(card, trait, system, planet, player);
    }
  }

  _applyExploreCardToPlanet(
    card: Card,
    trait: TraitSchemaType,
    system: System,
    planet: Planet,
    player: Player
  ): void {
    const cardNsid: string = NSID.get(card);
    this._maybeAddPlanetAttachment(planet, cardNsid);
    this._maybeAddSystemAttachment(system, cardNsid);

    const pos: Vector = planet.getPosition();
    const animSpeed: number = 1;
    card.setPosition(pos.add([0, 0, 10]), animSpeed);
    card.setRotation([0, 0, 180]);
    card.snapToGround();

    const playerName: string = TI4.playerName.getByPlayer(player);
    const planetName: string = planet.getName();
    const cardName: string = card.getCardDetails().name;
    const msg: string = `${playerName} explored ${planetName} (${trait}): ${cardName}`;
    Broadcast.chatAll(msg, player.getPlayerColor());
  }

  _exploreFrontierToken(frontierTokenObj: GameObject, player: Player): void {
    const pos: Vector = frontierTokenObj.getPosition();
    DeletedItemsContainer.destroyWithoutCopying(frontierTokenObj);

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
      const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
      if (system) {
        const cardNsid: string = NSID.get(card);
        this._maybeAddSystemAttachment(system, cardNsid);
      }

      const animSpeed: number = 1;
      card.setPosition(pos.add([0, 0, 10]), animSpeed);
      card.setRotation([0, 0, 180]);
      card.snapToGround();

      const playerName: string = TI4.playerName.getByPlayer(player);
      const cardName: string = card.getCardDetails().name;
      const msg: string = `${playerName} explored frontier: ${cardName}`;
      Broadcast.chatAll(msg, player.getPlayerColor());
    }
  }

  _maybeAddPlanetAttachment(planet: Planet, exploreCardNsid: string): void {
    const planetAttachment: PlanetAttachment | undefined =
      TI4.planetAttachmentRegistry.getByCardNsid(exploreCardNsid);
    if (planetAttachment) {
      const container: Container | undefined = planetAttachment
        .getObj()
        .getContainer();
      const pos = planet.getPosition().add([0, 0, 10]);
      if (container && container.take(planetAttachment.getObj(), pos)) {
        planetAttachment.getObj().snapToGround();
        const success: boolean = planetAttachment.attach();
        if (success) {
          planetAttachment.doLayout();
        }
      }
    }
  }

  _maybeAddSystemAttachment(system: System, exploreCardNsid: string): void {
    const systemAttachment: SystemAttachment | undefined =
      TI4.systemAttachmentRegistry.getByCardNsid(exploreCardNsid);
    if (systemAttachment) {
      const pos = system.getObj().getPosition().add([0, 0, 10]);
      const container: Container | undefined = systemAttachment
        .getObj()
        .getContainer();
      if (container && container.take(systemAttachment.getObj(), pos)) {
        systemAttachment.getObj().snapToGround();
        const success: boolean = systemAttachment.attach();
        if (success) {
          systemAttachment.doLayout();
        }
      }
    }
  }

  _exploreDistantSuns(
    system: System,
    planet: Planet,
    trait: TraitSchemaType,
    player: Player
  ): void {
    let deck: Card | undefined = this._getExploreDeck(trait);
    let card1: Card | undefined = undefined;
    let card2: Card | undefined = undefined;
    if (deck) {
      if (deck.getStackSize() > 1) {
        card1 = deck.takeCards(1);
      } else if (deck.getStackSize() === 1) {
        card1 = deck;
        deck = undefined;
      }
    }
    if (deck) {
      if (deck.getStackSize() > 1) {
        card2 = deck.takeCards(1);
      } else if (deck.getStackSize() === 1) {
        card2 = deck;
        deck = undefined;
      }
    }
    if (card1 && !card2) {
      this._applyExploreCardToPlanet(card1, trait, system, planet, player);
    } else if (card1 && card2) {
      const pos: Vector = planet.getPosition();
      const d: number = 2;
      const left: Vector = pos.add([0, -d, 3]);
      const right: Vector = pos.add([0, d, 3]);

      card1.setPosition(left, 1);
      card1.setRotation([0, 0, 180]);
      card1.snapToGround();

      card2.setPosition(right, 1);
      card2.setRotation([0, 0, 180]);
      card2.snapToGround();

      this._addChoice(card1, (): void => {
        this._removeUIs(card1);
        this._removeUIs(card2);
        this._applyExploreCardToPlanet(card1, trait, system, planet, player);
        GarbageContainer.tryRecycle(card2, player);
      });
      this._addChoice(card2, (): void => {
        this._removeUIs(card1);
        this._removeUIs(card2);
        this._applyExploreCardToPlanet(card2, trait, system, planet, player);
        GarbageContainer.tryRecycle(card1, player);
      });
    }
  }

  _addChoice(card: Card, callback: () => void): void {
    const scale: number = 2;

    const button: Button = new Button()
      .setFontSize(7 * scale)
      .setText("Choose");
    button.onClicked.add(callback);

    const ui = new UIElement();
    ui.widget = button;

    const extent = card.getExtent(false, false);
    ui.position = new Vector(-extent.x, 0, -extent.z - 0.1);
    ui.rotation = new Rotator(180, 180, 0);
    ui.scale = 1 / scale;

    card.addUI(ui);
  }

  _removeUIs(card: Card): void {
    for (const ui of card.getUIs()) {
      card.removeUIElement(ui);
    }
  }
}
