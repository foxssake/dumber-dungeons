# Dumber Dungeons

DnD meets Jackbox - a multiplayer, turn-based dungeon-crawling party RPG, right
in your browser!

## Overview

Players gather in front of a big screen, get comfy, maybe acquire some snacks,
and get to it. The game's overview is displayed on the big screen ( TV, PC
display, projector, what have you ), while players can input their actions from
their phone.

The adventure consists of the classical RPG tropes, including casting spells,
executing calculated moves, looting items, discovering dungeons, and upgrading
their characters.

The game's tone is centered around wizard-related shitposting, akin to
[r/wizardposting].

The game is browser based, and functions much like a regular webapp, with more
graphic visuals.

The game can eventually be structured as a role-playing engine, i.e. content (
spells, maps, etc. ) can be plugged in or swapped in the form of mods.

### Why play

The game experience would focus on the following core pillars:

- Cooperative gameplay
- Non-serious tone
- Replayability

Dumber Dungeons can be played remotely, or from a TV / PC / laptop / tablet
around which people gather to play.

### Why develop

Dumber Dungeon will be an open source reference piece that solves a few
interesting problems and integrations, e.g.:

- Performant rendering - [three.js] / [pixi.js]
- Realtime communication - WebSockets
- Managing current and multiple hypothetical game states to visualize drafted
  actions
- Moddable architecture to decouple core game engine and content

## Game flow

### Lobby

Players open the app on their big screen ( TV from here on out ). A new game
session is created, and the TV displays a code that players can use to join.
The first player to join becomes the session's admin.

The TV will display a short summary of each player's character.

Meanwhile, players can setup their characters on their phones - including name,
class, and ( potentially ) stat points.

> NOTE: If stat points are included, a button should be included to setup
> stats. This is for players who just want to get into the game ASAP or are
> new.

### Intermission

Once all players are ready, the game starts.

The TV might display a short loading screen or similar, while the game is set
up.

Phones will do something similar to indicate that character creation is now
done.

### First turn

The TV will display the game map around the characters and a list on the right,
indicating move order.

The phones will display a screen with possible moves - including buttons for
moving to nearby tiles ( depending on player move range ) and using abilities.

Players can draft their moves using these, which are also displayed on the TV,
so players are aware of eachother's moves.

Once all players confirm their moves, they are played out in order.

## Game mechanics

### Map

Maps are tile-based and generated on the fly. Each map has an entrance, around
which players are spawned, and an exit.

Once a player moves to the exit, they are removed from the turn. Once all
players move to the exit, the map is complete and players can move on the the
next level.

Maps are procedurally generated.

### Characters

Characters have basic stats to govern their gameplay, including:

- HP, max HP
- Mana, max mana
- Armor - TBA
- Move speed - how many tiles to move per turn
  - Generally one or a few tiles per turn

Potential stats:

- HP and mana regen
  - Or just go for potions to encourage looting and discourage turtling?
- Action points
  - How many abilities can a player use per turn
  - Or just leave it uncapped? So players can go all out, and then suffer the
    consequences of no mana

### Inventory

Characters can pick up loot and retain it for later use. Inventories are
limited to slots, each item takes up a single slots. Items may be stackable (
e.g. potions ).

Characters can pick up a limited amount of bags during gameplay, to increase
inventory size. Bags are limited to a fixed numbers, but smaller bags can be
swapped out for bigger ones.

### Items

Items can be dropped by enemies, or found in chests. Picking up, dropping or
using items are done as part of a turn.

Potential mechanics:

- Equipping for stats
- Binding items - can't be unequipped
- Cursed items - has a negative effect, only revealed upon equip/use

### Abilities

Characters can have different abilities and spells. Basic attacks are also
considered abilities.

Abilities can have stat costs ( e.g. health or mana ), and cooldowns.

For abilities targeting given unit(s), the phones can display a list of
targetable units for players to pick. Units are identified by names ( displayed
both on TV and on phones ).

For directional abilities, players can just pick a direction on phone.

For point cast abilities, can draft the target point by using directional
buttons on phone, and watching the draft cast on the TV.

### Classes

Classes determine what abilities a character has, and by extension, the
character's role in the team.

- Battle Mage - Tank / Melee DPS
- Arcane Mage - Ranged DPS
- Axemancer - Melee DPS, mobility
- Spice Mage - Debuff, ranged dps
- Ordained Mage - Support
- ? Paladin - Tank, support

Other classes may be added as the game evolves.

### Enemies

Enemies lurk around the map for players to engage.

Enemies should generally have deterministic behaviour, so players can plan
around them. This can be fixed movement patterns, or fixed responses to given
situations.

Enemies may drop loot.

### Bosses

Every n-th level is a boss level. These can be pre-made.

Boss levels are designed to test the players' skills before moving on.

Bosses have higher stats to challenge the full party, and have multiple special
abilities.

Bosses should also be mostly deterministic - the challenge isn't in not knowing
what's going to happen, but counter-playing the special abilities.

> NOTE: Some variability is OK though, so it's not a fixed timeline.

## Maybe-mechanics

- Weapons
  - Players can equip different weapons
  - Each weapon may have stat requirements
  - Weapon's damage may be based on stats

## Design considerations

- ? Target audience
- The game is to be kept semi-casual, so most players can enjoy the game
  without too much of a learning curve
- We can have more spells, since the game is turn based, but not too much to
  not overwhelm the player - somewhere between 4-8?

## Tech considerations

- Typescript + Bun
- Testing + `bun:test`
- eslint, jsdoc
- CI / CD - GitHub Actions
- Docker
- Staging environment eventually
- Don't break availability during updates
  - Save game states to some DB, read on restart, clients reconnect
  - State and game versioning

## Workflow considerations

- Conventional commits + Semver
- Feature dev: Github issues + projects -> PR -> review -> main
- After go-live, add a dev branch, main would autodeploy to prod

[r/wizardposting]: https://www.reddit.com/r/wizardposting/
[three.js]: https://threejs.org/
[pixi.js]: https://pixijs.com/
