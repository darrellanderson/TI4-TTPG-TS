import { Card, GameObject, Vector } from "@tabletop-playground/api";
import { Adjacency, CardUtil, Find, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";
import { Faction } from "../../faction-lib/faction/faction";

export class SystemAdjacencyWormhole {
  public static WORMHOMES: Array<string> = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
  ];

  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency,
    faction: Faction | undefined
  ): void {
    // Add wormholes in systems (inclues attachments).
    for (const [hex, system] of hexToSystem) {
      for (const wormhole of system.getWormholes()) {
        // System into wormhole.
        adjacency.addLink({
          src: hex,
          dst: wormhole,
          distance: 0.5,
          isTransit: true,
        });

        // Wormhole into system.
        adjacency.addLink({
          src: wormhole,
          dst: hex,
          distance: 0.5,
          isTransit: false,
        });
      }
    }

    if (faction) {
      this._applyFaction(faction, adjacency);
    }
    this._applyCreussFlagship(adjacency);
    this._applyCards(adjacency);
  }

  _applyFaction(faction: Faction, adjacency: Adjacency): void {
    if (
      faction
        .getAbilityNsids()
        .includes("faction-ability:base/quantum-entanglement")
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }
  }

  _applyCreussFlagship(adjacency: Adjacency): void {
    const nsid: string = "unit.flagship:base/creuss";
    const playerSlot: number = -1;
    const skipContained: boolean = true;
    const creussFlagship: GameObject | undefined = this._find.findGameObject(
      nsid,
      playerSlot,
      skipContained
    );
    if (creussFlagship) {
      const pos: Vector = creussFlagship.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      adjacency.addLink({
        src: hex,
        dst: "delta",
        distance: 0.5,
        isTransit: true,
      });
      adjacency.addLink({
        src: "delta",
        dst: hex,
        distance: 0.5,
        isTransit: false,
      });
    }
  }

  _applyCards(adjacency: Adjacency): void {
    let card: Card | undefined;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = [
      "discard-agenda",
      "discard-action",
    ];

    card = this._find.findCard("card.agenda:base/wormhole-reconstruction");
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }

    card = this._find.findCard("card.action:base/lost-star-chart");
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }

    // Creuss agent, can be applied for any player.
    // "After a player activates a system that contains a non-delta
    // wormhole: You may exhaust this card; if you do, that system is
    // adjacent to all other systems that contain a wormhole during
    // this tactical action."
    card = this._find.findCard("card.leader.agent:pok/emissary-taivra");
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags) &&
      UnitModifierActiveIdle.isActive(card)
    ) {
      for (const a of SystemAdjacencyWormhole.WORMHOMES) {
        for (const b of SystemAdjacencyWormhole.WORMHOMES) {
          if (a !== b) {
            adjacency.addLink({
              src: a,
              dst: b,
              distance: 0,
              isTransit: true,
            });
          }
        }
      }
    }
  }
}
