import { Card, Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, HexType, NSID, PlayerSlot } from "ttpg-darrell";
import { Planet } from "../../system-lib/planet/planet";

export class AgendaAvailableVotes {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  _getPlayerSlotToPerPlanetBonus(): Map<PlayerSlot, number> {
    const playerSlotToPerPlanetBonus = new Map<PlayerSlot, number>();

    let nsid: string;
    let card: Card | undefined;

    // Xxcha commander.
    nsid = "card.leader.commander:pok/elder-qanoj";
    card = this._find.findCard(nsid);
    const allowFaceDown: boolean = false;
    let xxchaCommanderUnlocked: boolean = card === undefined; // enable if missing (e.g. minor factions)
    if (card && this._cardUtil.isLooseCard(card, allowFaceDown)) {
      const pos: Vector = card.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      playerSlotToPerPlanetBonus.set(playerSlot, 1);
      xxchaCommanderUnlocked = true;
    }

    nsid = "card.alliance:pok/xxcha";
    card = this._find.findCard(nsid);
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown) &&
      xxchaCommanderUnlocked
    ) {
      const pos: Vector = card.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      playerSlotToPerPlanetBonus.set(playerSlot, 1);
    }

    return playerSlotToPerPlanetBonus;
  }

  _isRepresentativeGovernment(): boolean {
    const nsids: Array<string> = [
      "card.agenda:pok/representative-government",
      "card.agenda:base/representative-government",
    ];

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.includes(nsid) && obj instanceof Card) {
        const allowFaceDown: boolean = false;
        const rejectSnapPointTags: Array<string> = [
          "discard-agenda",
          "active-agenda",
        ];
        if (
          this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  _getXxekirGromOmegaPlayerSlots(): Set<PlayerSlot> {
    const playerSlots: Set<PlayerSlot> = new Set<PlayerSlot>();

    const skipContained: boolean = true;
    const xxcekirNsid: string =
      "card.leader.hero:codex.vigil/xxekir-grom.omega";
    const allowFaceDown: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === xxcekirNsid &&
        obj instanceof Card &&
        this._cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        playerSlots.add(playerSlot);
      }
    }

    return playerSlots;
  }

  _getArchonsGiftPlayerSlots(): Set<PlayerSlot> {
    const playerSlots: Set<PlayerSlot> = new Set<PlayerSlot>();

    const skipContained: boolean = true;
    const archonsGiftNsid: string =
      "card.breakthrough:thunders-edge/archons-gift";
    const allowFaceDown: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === archonsGiftNsid &&
        obj instanceof Card &&
        this._cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        playerSlots.add(playerSlot);
      }
    }

    return playerSlots;
  }

  _getFaceUpPlanetCards(): Array<Card> {
    const cards: Array<Card> = [];

    // Ignore planet cards on system tiles.
    const systemHexes: Set<HexType> = new Set<HexType>();
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs()) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      systemHexes.add(hex);
    }

    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = ["deck-planet"];

    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (
        (nsid.startsWith("card.planet:") ||
          nsid.startsWith("card.deepwrought-ocean:")) &&
        obj instanceof Card &&
        this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags) &&
        !systemHexes.has(TI4.hex.fromPosition(obj.getPosition()))
      ) {
        const planet: Planet | undefined =
          TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
        if (planet) {
          cards.push(obj);
        }
      }
    }
    return cards;
  }

  getPlayerSlotToAvailableVotes(): Map<PlayerSlot, number> {
    const playerSlotToAvailableVotes = new Map<PlayerSlot, number>();
    const playerSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);

    // Representative government: 1 vote per player.
    if (this._isRepresentativeGovernment()) {
      for (const playerSlot of playerSlots) {
        playerSlotToAvailableVotes.set(playerSlot, 1);
      }
      return playerSlotToAvailableVotes;
    }

    const playerSlotToPerPlanetBonus = this._getPlayerSlotToPerPlanetBonus();

    // Xxekir Grom Omega: add planet resources to influence.
    const xxekirGromOmegaPlayerSlots: Set<PlayerSlot> =
      this._getXxekirGromOmegaPlayerSlots();
    const archonsGiftPlayerSlots: Set<PlayerSlot> =
      this._getArchonsGiftPlayerSlots();

    const faceUpPlanetCards: Array<Card> = this._getFaceUpPlanetCards();
    for (const planetCard of faceUpPlanetCards) {
      const nsid: string = NSID.get(planetCard);
      const pos: Vector = planetCard.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);

      const planet: Planet | undefined =
        TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
      if (planet) {
        let votes: number = playerSlotToAvailableVotes.get(playerSlot) ?? 0;
        let influence: number = planet.getInfluence();
        if (archonsGiftPlayerSlots.has(playerSlot)) {
          influence = Math.max(planet.getResources(), influence);
        }
        votes += influence;
        const bonus: number | undefined =
          playerSlotToPerPlanetBonus.get(playerSlot);
        if (bonus !== undefined) {
          votes += bonus;
        }
        if (xxekirGromOmegaPlayerSlots.has(playerSlot)) {
          votes += planet.getResources();
        }
        playerSlotToAvailableVotes.set(playerSlot, votes);
      } else if (nsid.startsWith("card.deepwrought-ocean:")) {
        let votes: number = playerSlotToAvailableVotes.get(playerSlot) ?? 0;
        votes += 1;
        playerSlotToAvailableVotes.set(playerSlot, votes);
      }
    }

    // Add zero votes for any player slots not already in the map.
    for (const playerSlot of playerSlots) {
      if (!playerSlotToAvailableVotes.has(playerSlot)) {
        playerSlotToAvailableVotes.set(playerSlot, 0);
      }
    }

    return playerSlotToAvailableVotes;
  }
}
