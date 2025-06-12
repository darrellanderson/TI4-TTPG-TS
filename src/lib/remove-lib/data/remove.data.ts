/**
 * When including a given source, remove the linked NSIDs (e.g., with PoK
 * remove some base game agendas).
 *
 * Include sources without remove directives, that way we can remove the source too.
 */
export const SOURCE_TO_REMOVE_NSIDS: Record<string, Array<string>> = {
  pok: [
    "card.agenda:base/research-team-warfare",
    "card.agenda:base/holy-planet-of-ixth",
    "card.agenda:base/terraforming-initiative",
    "card.agenda:base/representative-government",
    "card.agenda:base/the-crown-of-emphidia",
    "card.agenda:base/core-mining",
    "card.agenda:base/research-team-propulsion",
    "card.agenda:base/the-crown-of-thalnos",
    "card.agenda:base/senate-sanctuary",
    "card.agenda:base/research-team-cybernetic",
    "card.agenda:base/research-team-biotic",
    "card.agenda:base/shard-of-the-throne",
    "card.agenda:base/demilitarized-zone",
  ],
  ["codex.ordinian"]: [
    "card.technology.green:base/yin-spinner",
    "card.technology.green:base/x89-bacterial-weapon",
    "card.technology.blue:base/wormhole-generator",
    "card.technology.red:base/magen-defense-grid",
    "card.technology.red:base/magmus-reactor",
    "card.promissory:base/cybernetic-enhancements",
    "card.promissory:base/war-funding",
    "card.promissory:base/greyfire-mutagen",
    "card.promissory:base/stymie",
    "card.promissory:base/acquiescence",
  ],
  ["codex.affinity"]: [],
  ["codex.vigil"]: [
    "card.alliance:pok/naalu",
    "card.alliance:pok/yin",
    "card.faction-reference:base/naalu",
    "card.faction-reference:base/xxcha",
    "card.faction-reference:base/yin",
    "card.leader.agent:pok/zeu",
    "card.leader.agent:pok/brother-milor",
    "card.leader.commander:pok/maban",
    "card.leader.commander:pok/brother-omar",
    "card.leader.hero:pok/xxekir-grom",
    "card.leader.hero:pok/dannel-of-the-tenth",
    "card.leader.mech:pok/iconoclast",
    "card.objective.secret:base/make-an-example-of-their-world",
    "card.objective.secret:base/turn-their-fleets-to-dust",
    "card.objective.secret:pok/fight-with-precision",
  ],
  ["codex.liberation"]: [
    "card.technology.green:base/x89-bacterial-weapon",
    "card.technology.green:codex.ordinian/x89-bacterial-weapon.omega",
    "card.technology.red:base/magen-defense-grid",
    "card.technology.red:codex.ordinian/magen-defense-grid.omega",
  ],
};
