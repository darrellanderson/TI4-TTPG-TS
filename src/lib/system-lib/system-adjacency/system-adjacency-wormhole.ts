import { Adjacency, CardUtil, Find, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { GameObject, Vector } from "@tabletop-playground/api";

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
    adjacency: Adjacency
  ): void {
    for (const wormhole of SystemAdjacencyWormhole.WORMHOMES) {
      adjacency.addLink(wormhole, wormhole);
    }

    // Add wormholes in systems (inclues attachments).
    for (const [hex, system] of hexToSystem) {
      for (const wormhole of system.getWormholes()) {
        adjacency.addNodeTags(hex, [wormhole]);
      }
    }

    this._applyCreussFlagship(adjacency);
    this._applyCards(adjacency);
  }

  _applyCreussFlagship(adjacency: Adjacency): void {
    const nsid: string = "unit.flagship:base/creuss";
    const creussFlagship: GameObject | undefined =
      this._find.findGameObject(nsid);
    if (creussFlagship) {
      const pos: Vector = creussFlagship.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      adjacency.addNodeTags(hex, ["delta"]);
    }
  }

  _applyCards(adjacency: Adjacency): void {
    let card: GameObject | undefined;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = [
      "discard.card.action",
      "discard.card.agenda",
    ];

    card = this._find.findGameObject(
      "card.agenda:base/wormhole_reconstruction"
    );
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink("alpha", "beta");
    }

    card = this._find.findGameObject("card.action:base/lost_star_chart");
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink("alpha", "beta");
    }

    // Creuss agent, can be applied for any player.
    // "After a player activates a system that contains a non-delta
    // wormhole: You may exhaust this card; if you do, that system is
    // adjacent to all other systems that contain a wormhole during
    // this tactical action."
    card = this._find.findGameObject(
      "card.leader.agent.creuss:pok/emissary_taivra"
    );
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      // TODO XXX: is card active?
      for (const a of SystemAdjacencyWormhole.WORMHOMES) {
        for (const b of SystemAdjacencyWormhole.WORMHOMES) {
          adjacency.addLink(a, b);
        }
      }
    }
  }
}
