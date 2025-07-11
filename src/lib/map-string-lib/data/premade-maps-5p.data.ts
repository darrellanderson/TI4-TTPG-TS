import { PremadeMapType } from "./premade-map-type";

export const PREMADE_MAPS_5P: Array<PremadeMapType> = [
  {
    playerCount: 5,
    name: "Ankara (The_AV8R) [5p PoK]",
    mapString:
      "77 23 68 85A0 46 41 37 31 76 48 40 88A0 65 87A0 34 64 38 28 0 62 42 0 79 21 0 32 83A0 86A0 84A0 39 0 71 24 0 63 80",
  },
  {
    playerCount: 5,
    name: "Beijing (The_AV8R) [5p PoK]",
    mapString:
      "75 61 66 85A0 49 60 65 77 79 63 78 87A2 64 88A4 74 68 39 67 0 59 62 0 70 80 0 76 83A3 86A0 84A3 45 0 72 73 0 69 40",
  },
  {
    playerCount: 5,
    name: "Learn to Play [5p PoK]",
    mapString:
      "77 40 41 85A0 39 65 67 60 70 66 74 88A0 75 87A0 68 72 73 69 0 62 76 0 79 71 0 80 83A0 86A0 84A0 63 0 64 78 0 61 59",
  },
  {
    playerCount: 5,
    name: "Learn to Play [5p Base]",
    mapString:
      "22 45 19 42 24 44 35 23 36 39 38 25 33 50 20 26 30 40 32 43 49 0 31 46 0 37 29 0 34 27 48 0 21 28 47 0",
  },
  {
    playerCount: 5,
    name: "Privateers [5p Base Chaos]",
    mapString:
      "47 41 39 85A0 40 45 27 25 29 22 35 87A2 43 88A4 38 21 37 26 0 23 30 0 20 34 0 44 84A5 86A0 83A4 24 0 36 32 0 28 33",
  },
  {
    playerCount: 5,
    name: "Race For Mecatol (C2) [5p PoK]",
    mapString:
      "{68} 0 84B0 91B4 87A1 89B2 83B0 25 72 30 39 0 43 88A2 80 0 40 33 21 67 47 74 0 64 75 35 44 65 18 66 45 38 76 26 0 71 77",
  },
  {
    playerCount: 5,
    name: "SCPT 2020 Patreon Tourney Knockout [5p Base]",
    mapString:
      "21 32 39 85A0 40 31 41 37 43 33 45 87A2 34 88A4 44 27 42 36 0 22 28 0 25 38 0 24 84A5 86A0 83A4 35 0 19 29 0 26 30",
  },

  // Atlas
  {
    author: "Jon",
    name: "Wargames 5 Player",
    mapString:
      "69 33 76 -1 37 34 27 68 66 64 35 -1 65 -1 71 67 38 26 0 46 73 0 43 49 0 45 -1 -1 -1 39 0 50 25 0 44 47",
    playerCount: 5,
    difficulty: "Intermediate",
    attributes: "PoK",
    comments: "",
  },
  {
    author: "Jon",
    name: "Big Tech",
    mapString:
      "74 22 37 -1 72 62 35 24 66 40 27 -1 65 -1 26 42 64 68 0 49 45 0 69 80 0 48 -1 -1 -1 44 0 73 46 0 34 39",
    playerCount: 5,
    difficulty: "Beginner",
    attributes: "PoK, Sliceable",
    comments: "",
  },
  {
    author: "zombiebrains , mtg.wiz[at]gmail.com",
    name: "Regicide",
    mapString:
      "{87A4} 18 20 67 27 68 60 37 45 26 31 63 32 78 23 24 74 25 44 0 66 43 50 0 29 40 0 38 85A0 71 0 39 28 0 77 80 65",
    sliceNames: "Emperor, King, Lord, Duke, Prince",
    playerCount: 5,
    difficulty: "Advanced",
    attributes: "PoK, Asymmetric",
    comments:
      "The Emperor starts off with a very significant advantage with both legendary planets, lots of influence, and being closer to Mecatol Rex but no way to reliably score victory points. In order to succeed, he must press outward much to the chagrin of the other players. The other slices feature resource heavy, interconnected slices, but petty infighting over objectives can quickly sour relationships. How can the other players work together to defeat the Emperor when only one of them can claim the throne?",
  },
  {
    author: "DaveBot777",
    name: "Max's Dream 5p",
    mapString:
      "44 39 50 85A0 45 77 66 19 64 63 26 88A0 25 87A0 30 23 74 21 69 42 46 72 43 47 71 80 83A0 90A0 84A0 49 38 79 40 27 41 48 0 24 20 73 0 28 32 37 0 62 91B4 86A0 -1 65 89B2 22 0 76 60 75 0 29 36 31",
    playerCount: 5,
    difficulty: "Beginner",
    attributes: "PoK",
    comments: "Money. Lot's of money.",
  },
  {
    author: "DaveBot777",
    name: "Warpless Zone",
    mapString:
      "45 78 22 21 61 46 25 33 34 59 71 65 38 66 27 19 77 72 41 32 0 79 50 69 0 43 37 0 40 42 0 29 48 39 0 28",
    playerCount: 5,
    difficulty: "Beginner",
    attributes: "PoK",
    comments:
      "This is a somewhat balanced 5 player map that doesn't use warp zones.",
  },
  {
    author: "DaveBot777",
    name: "Equidistant++ 5p",
    mapString:
      "40 39 45 86A0 79 48 72 61 71 19 69 88A0 73 87A0 27 21 35 63 0 77 76 0 42 37 0 44 83A0 89A5 84A0 29 0 78 31 0 49 34 -1 -1 65 -1 -1 -1 64 -1 -1 -1 -1 -1 66 -1 -1 -1 -1 -1 25 -1 -1 -1 26",
    playerCount: 5,
    difficulty: "Intermediate",
    attributes: "PoK",
    comments:
      "A non-standard map layout that adds an extra equidistant tile between each set of adjacent players. It's a good layout for player's like me that like a little more money in their galaxy and to play 14 point games.",
  },
  {
    author: "DaveBot777",
    name: "Outer Rim 5p",
    mapString:
      "78 47 49 86A0 77 40 67 27 79 37 80 88A0 66 87A0 42 72 68 38 0 64 62 0 69 71 0 34 83A0 85A0 84A0 76 0 30 22 0 29 73",
    playerCount: 5,
    difficulty: "Advanced",
    attributes: "PoK",
    comments:
      "This map forces action on the edge of the board and drives players away from the center.",
  },
  {
    author: "DaveBot777",
    name: "Large BAT 5p",
    mapString:
      "77 63 61 86A3 48 19 31 64 74 66 26 88A0 62 87A0 71 25 28 65 0 22 42 0 49 46 0 40 83A3 90A0 84A0 24 0 41 47 0 78 79 -1 50 20 29 -1 80 23 34 -1 45 91B4 85A0 -1 60 89B2 39 -1 73 32 44 -1 76 21 30",
    playerCount: 5,
    difficulty: "Advanced",
    attributes: "PoK, Asymmetric",
    comments:
      "Note on the Asymmetric comment. The map is actually decently balanced, but not everyone has access to the same stuff.   BAT stands for balance through asymmetry.",
  },
  {
    author: "DaveBot777",
    name: "All Lanes Closed",
    mapString:
      "47 23 80 50 77 48 72 79 40 38 22 46 27 64 71 26 35 68 69 0 19 34 0 39 21 44 0 28 49 37 0 43 78 0 76 24",
    playerCount: 5,
    difficulty: "Beginner",
    attributes: "PoK",
    comments: "This is a non-standard 5 player map layout without hyperlanes.",
  },
  {
    author: "DaveBot777",
    name: "Small and Rich 5p",
    mapString:
      "48 34 47 85A0 46 75 69 66 35 26 38 88A0 68 87A0 27 65 71 64 0 79 77 0 44 76 0 40 84A2 86A0 83A1 37 0 42 39 0 41 72",
    playerCount: 5,
    difficulty: "Beginner",
    attributes: "PoK",
    comments: "A standard sized map with most of the best systems in play.",
  },
  {
    author: "DaveBot777",
    name: "Teardrop",
    mapString:
      "26 47 62 80 78 77 35 38 44 27 0 46 71 24 67 0 69 45 41 40 0 37 66 73 39 43 64 42 0 59 25 72 79 65 50 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 49 22 29",
    playerCount: 5,
    difficulty: "Intermediate",
    attributes: "PoK",
    comments: "This map is weird.",
  },
  {
    author: "DaveBot777",
    name: "The infamous Double Galaxy 5p",
    mapString:
      "26 47 62 80 78 77 35 38 44 27 0 46 71 24 67 0 69 45 41 40 0 37 66 73 39 43 64 42 0 59 25 72 79 65 50 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 49 22 29",
    playerCount: 5,
    difficulty: "Expert",
    attributes: "PoK, Asymmetric",
    comments:
      "This map starts with a gamma wormhole on Mecatol Rex. This map is a trip and a half. For this map the wormhole nexus does not count as the edge of the game board and the central empty tiles in the mecatol galaxy are impassible and the adjacent systems are not treated as the edge of the game board.   When playing this map 1 of the 3 gamma wormhole tokens starts on Mecatol Rex. In addition, the agenda Nexus sovereignty and Enforced travel ban should be removed from the agenda deck.",
  },
  {
    author: "DaveBot777",
    name: "The Infamous Double Galaxy",
    mapString:
      "{-1} 47 -1 34 -1 37 0 59 -1 44 60 38 80 -1 -1 50 27 -1 77 -1 -1 -1 21 35 -1 73 0 -1 -1 -1 -1 -1 79 66 18 64 68 -1 -1 -1 -1 -1 0 69 24 42 46 -1 -1 -1 -1 -1 -1 -1 19 30 -1 65 -1 71 74 -1 -1 -1 -1 -1 -1 -1 49 40 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 78 0 75 39 63 0 45 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 48 41 -1 32 43",
    playerCount: 5,
    difficulty: "Expert",
    attributes: "PoK, Asymmetric",
    comments:
      "This map starts with a gamma wormhole on Mecatol Rex. When playing with this map the Nexus Sovereignty Agenda and Enforced Travel Ban Agendas must be removed at the start of the game and a gamma wormhole must be placed on Mecatol Rex.  I am submitting this a second time because I put in the wrong map string on the previous one. My bad.",
  },
  {
    author: "zombiebrains",
    name: "Regicide",
    mapString:
      "{87A4} 18 62 20 67 23 48 34 43 74 49 27 75 77 37 40 31 26 80 0 66 44 64 0 29 39 0 63 85A0 38 0 59 28 0 24 45 65",
    sliceNames: "The Emperor, The Duke, The Prince, The Countess, The Bishop",
    playerCount: 5,
    difficulty: "Advanced",
    attributes: "PoK, Asymmetric",
    comments:
      "I was going for an asymmetrical, almost 4 v 1 but not quite scenario. The Emperor has the strongest position with easy access to MR, 2 legendaries that produce GF, and a blue skip all in an easily defensible position. They are hindered however in the fact that they cannot score victory points without expanding which puts a lot of pressure on the other players to contain  them.   Each other slice has a wormhole with easy resources, a couple of tech skips, and a wormhole to trade. The excess should make VP's easy to score.   The Duke can score an easy 4 planet type point, but his tech skips being in danger make for a tenuous relation with the others.   The Bishop likewise suffers from proximity to the Emperor but is an a thankfully more guarded position. His RY techs might prove the difference in an all out war.   The Prince has the richest slice, and his 2 green skips allow for a potential counter to the Emperor's ground game. But who is willing to trade one tyrant for another?  The Countess's slice largely reflects the Emperor's and a BR tech path opens up options for a lot of factions. Efficient planets with lots of CC's could open up a lot of doors for potential plays.   The problem remains, with only 1 person able to claim the throne, can they work together to stop the looming threat?",
  },
  {
    author: "HektorOfTroy",
    name: "Royal Industry v2",
    mapString:
      "72 30 28 85A0 69 75 35 79 76 46 24 87A2 41 88A4 62 49 29 40 0 59 34 0 44 64 0 73 84A5 86A0 83A4 78 0 37 39 0 27 42",
    playerCount: 5,
    attributes: "PoK, Asymmetrical",
    comments:
      "Asymmetrical. Average efficient slice is 5/3 with 2 skips. 9 non-planet systems. 0 “fringe” slice(s). 0 legendary planet(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Snakes & Stones v2",
    mapString:
      "77 26 72 85A0 47 28 64 31 69 66 29 88A0 67 87A0 75 65 79 76 0 34 50 0 44 46 0 39 83A0 86A0 84A3 37 0 40 62 0 35 42",
    playerCount: 5,
    attributes: "PoK, Asymmetrical",
    comments:
      "Asymmetrical. Average efficient slice is 5/2 with 1 skip. 9 non-planet systems. 2 “fringe” slice(s). 0 legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Sprawled Dynasty",
    mapString:
      "35 40 60 85A0 43 62 78 65 71 45 48 88A0 75 87A0 66 39 47 49 0 34 79 0 76 74 0 26 83A0 86A0 84A3 25 0 37 32 0 64 41",
    playerCount: 5,
    attributes: "PoK, Asymmetrical",
    comments:
      "Asymmetrical. Average efficient slice is 5/2 with 1 skip. 10 non-planet systems. 1 “fringe” slice(s). 2 Legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Castle Peak v2",
    mapString:
      "31 77 64 85A0 71 50 35 39 66 76 37 88A0 75 87A0 59 47 28 65 0 45 69 0 48 42 0 79 83A0 86A0 84A3 25 0 78 26 0 74 40",
    playerCount: 5,
    attributes: "PoK, Asymmetrical",
    comments:
      " Asymmetrical. Average efficient slice is 6/1 with 1 skip. 10 non-planet systems. 2 “fringe” slice(s). 1 legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Set Stage v2",
    mapString:
      "31 71 20 85A0 78 32 28 65 76 40 34 88A0 75 87A0 60 39 62 41 0 47 79 0 48 42 0 26 83A0 86A0 84A3 37 0 66 44 0 64 49",
    playerCount: 5,
    attributes: "PoK, Asymmetrical",
    comments:
      " Asymmetrical. Average efficient slice is 5/1 with 1 skip. 10 non-planet systems. 1 “fringe” slice(s). 1 Legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "City on a Hill v2",
    mapString:
      "46 49 79 85A0 47 42 28 65 36 78 66 88A0 72 87A0 69 31 26 75 0 45 25 0 24 41 0 76 83A0 86A0 84A3 74 0 40 34 0 67 62",
    playerCount: 5,
    attributes: "PoK",
    comments:
      "Moderate. Average efficient slice is 5/1 with 1 skip. 9 non-planet systems. 5 “fringe” slice(s). 1 Legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Endless Void v2",
    mapString:
      "77 50 24 85A0 47 45 38 67 30 60 48 87A2 65 88A4 74 25 66 39 0 59 76 0 40 32 0 26 84A5 86A0 83A4 69 0 78 73 0 49 42",
    playerCount: 5,
    attributes: "PoK",
    comments:
      "Poor. Average efficient slice is 3/2 with 1 skip. 10 non-planet systems. 4 “fringe” slice(s). 1 Legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Capital of the Abyss v2",
    mapString:
      "49 44 40 85A0 46 42 37 28 35 65 74 88A0 67 87A0 20 75 25 47 0 64 45 0 63 78 0 26 83A0 86A0 84A3 27 0 39 34 0 73 79",
    playerCount: 5,
    attributes: "PoK, Poor",
    comments:
      "Poor. Average efficient slice is 3/1 with 1 skip. 9 non-planet systems. 5 “fringe” slice(s). 0 legendary slice(s). Hyperlanes.",
  },
  {
    author: "HektorOfTroy",
    name: "Fox Holes",
    mapString:
      "20 48 44 46 60 47 78 39 59 28 49 64 65 79 50 66 63 31 0 34 75 45 0 26 70 0 76 67 74 0 35 40 0 32 41 25",
    playerCount: 5,
    attributes: "PoK, Poor, NoLanes",
    comments:
      "Poor. Average efficient slice is 5/2 with 1 skip. 11 non-planet systems. 3 “fringe” slice(s). 1 Legendary slice(s). Notice bizarre home system placement. Experimental!",
  },
  {
    author: "HektorOfTroy",
    name: "Celestial Empire",
    mapString:
      "37 75 72 65 69 71 67 66 27 47 34 40 68 39 62 46 59 35 0 26 42 0 19 79 0 49 32 76 61 41 0 44 25 0 77 64",
    playerCount: 5,
    attributes: "PoK, Asymmetrical, NoLanes",
    comments:
      "Asymmetrical. Average efficient slice is 6/1 10 non-planet systems. 2 “fringe” slice(s). No legendary slice(s). No Hyperlanes. No TG’s to start. Notice non-standard HS placement.",
  },
  {
    author: "HektorOfTroy",
    name: "Distant Worlds",
    mapString:
      "44 29 77 65 28 62 66 25 70 79 38 40 76 39 33 64 23 47 0 37 50 0 61 49 0 74 73 75 78 21 0 48 32 0 42 26",
    playerCount: 5,
    attributes: "PoK, NoLanes",
    comments:
      "Moderate. Average efficient slice is 5/1 with 1 skips. 11 non-planet systems. 2 “fringe” slice(s). 1 legendary planet(s). No Hyperlanes. No TG’s to start. Notice non-standard HS placement.",
  },
];
