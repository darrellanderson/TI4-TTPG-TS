// Faction leaders, promissories, etc are just the nsid-name portion;
// they do not track the source.  Perhaps they should, for now use a
// lookaside table.
export const REWRITE_NSIDS: Record<string, string> = {
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

  // Codex updates from thunder's edge.
  "card.leader.hero:pok/planetary-defense-nexus":
    "card.leader.hero:codex.vigil/planetary-defense-nexus",
  "card.leader.hero:pok/quantum-dissemination":
    "card.leader.hero:codex.vigil/quantum-dissemination",

  // alliances.
  "card.alliance:pok/yin.omega": "card.alliance:codex.vigil/yin.omega",
  "card.alliance:pok/naalu.omega": "card.alliance:codex.vigil/naalu.omega",

  // promissories.
  "card.promissory:base/greyfire-mutagen.omega":
    "card.promissory:codex.ordinian/greyfire-mutagen.omega",
  "card.promissory:base/cybernetic-enhancements.omega":
    "card.promissory:codex.ordinian/cybernetic-enhancements.omega",
  "card.promissory:base/war-funding.omega":
    "card.promissory:codex.ordinian/war-funding.omega",
  "card.promissory:base/acquiescence.omega":
    "card.promissory:codex.ordinian/acquiescence.omega",
  "card.promissory:base/stymie.omega":
    "card.promissory:codex.ordinian/stymie.omega",
};
