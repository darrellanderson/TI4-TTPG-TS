Twilight Imperium 4th Edition for Tabletop Playground
=====================================================

Typescript source

This repository uses TRH's ttpg-scripts package.  To build a dev / testing candidate:

`yarn` (just once to load everything, this might not be necessary)

`yarn dev`

optionally, to detect src file changes and update the dev candidate in real time:

`yarn watch`

To build a release candidate:

`yarn clean` (to remove dev candidate)

`yarn build`

`yarn purge -y` (afterward, to remove build candidate)
