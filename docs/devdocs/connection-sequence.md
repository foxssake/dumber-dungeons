# Connection Sequence Design

As described in [#17].

## Overview

The feature can be broken down to the following major points:

1. Create a session
1. Players join the session
1. Player setup
1. Session start

## Session management

When the host player opens the game on their main screen, the application
creates a new game session and displays instructions on how to join.

---

Sessions are objects that have an ID and a list of players that are currently
in the session.

Session IDs are randomly generated, to ensure all IDs are unique. This property
can be useful for scaling horizontally as well - instances can generate IDs for
a shared storage independently of each other.

Players in this case represent the user *as part of the session*. Players do
not exist outside of game sessions.

Players also have a randomly generated ID, and in addition, a name and a
readiness flag.

For convenience, players may have globally unique IDs, but they must always
belong to a game session.

> TODO: Is the TV a player?

## Joining the session

When a player opens the session - i.e. opens its link in a browser -, they
connect to the game through WebSocket. This will be used to send actions to the
server, and to receive state updates from it.

Initially, the server creates a Player object, and sends its data to the
browser. The browser can then use this data to authenticate as the player
itself.

On the server, the specified Session is validated ( i.e. does it exist? ), and
if so, a Player is created and added to the list of players in the Session.
This event is broadcast to the players already in the session.

### Data storage

For starters, we can keep Session and Player objects in memory, in a simple
dictionary and do lookups based on ID.

Later we can move on to keeping these objects in an actual database, so game
data is not tied to a single running instance, enabling horizontal scaling.

## Player setup

After successfully joining, players are presented with the player setup screen.
For the scope of this epic, players can edit their own names and toggle their
readiness.

During this phase, on the main screen, all players and their state is displayed
next to the join instructions. This is updated in real-time, as players join or
update their settings.

Player actions ( changing name or readiness ) are submitted through WebSocket.

### Authentication

* WebSocket object
    * Players can be associated with a specific WebSocket connection object
    * pros: Simple?
    * cons: Not scalable, Potentially hacky
* Authentication tokens
    * Aside from IDs, Player objects also get an Auth token
    * This auth token is only handed out to the player actor during creation
    * The auth token can be used to perform actions on the Player object
    * pros: Relatively simple, Scalable
    * cons: Extra network traffic

## Session start

During every readiness change, the server checks if all players are ready in
the affected session. If so, it broadcasts a session start event.

Clients lock the player settings and display a message that the session has
started.

> TODO: WS message routing?

[#17]: https://github.com/foxssake/dumber-dungeons/issues/17
