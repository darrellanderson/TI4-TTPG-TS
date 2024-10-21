// Faction leaders are just the nsid-name portion; they do not track the source.
// Perhaps they should, for now use a lookaside table.
export const REWRITE_LEADER: Record<string, string> = {
  "card.leader.agent:pok/zeu.omega": "card.leader.agent:codex.vigil/zeu.omega",
  "card.leader.commander:pok/maban.omega":
    "card.leader.commander:codex.vigil/maban.omega",
  "card.leader.mech:pok/iconoclast.omega":
    "card.leader.mech:codex.vigil/iconoclast.omega",
  "card.leader.hero:pok/xxekir-grom.omega":
    "card.leader.hero:codex.vigil/xxekir-grom.omega",
  "card.leader.agent:pok/brother-milor.omega":
    "card.leader.agent:codex.vigil/brother-milor.omega",
  "card.leader.commander:pok/brother-omar.omega":
    "card.leader.commander:codex.vigil/brother-omar.omega",
  "card.leader.hero:pok/dannel-of-the-tenth.omega":
    "card.leader.hero:codex.vigil/dannel-of-the-tenth.omega",
};
