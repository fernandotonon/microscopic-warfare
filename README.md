Web Based Game for Ludum Dare 54

# Microscopic Warfare
The game is set in a petri dish. The player controls a colony of bacteria fighting against other colonies for limited space and resources.

# Game Concept:
In "Microscopic Warfare", the player will be in control of a bacterial colony inside a petri dish. The objective is to become the dominant bacterial colony by consuming resources and out-competing rival colonies.
### Resource Collection:
* Random resources (e.g., represented by ASCII #) appear on the grid.
* The player's bacteria need to move to these resources to consume them.
* Consuming resources helps the player's bacteria grow and multiply.

### Bacterial Movement:
* Player's bacteria can move in all directions.
* Movement can be controlled using arrow keys or WASD.

### Bacterial Multiplication:
* After consuming a certain amount of resources, the player's bacteria can multiply, spawning a new bacterium adjacent to them.

### Rival Colonies:
* Rival bacterial colonies (e.g., represented by ASCII characters like x, o, @, etc.) will also spawn on the grid.
* They will move towards resources and try to consume them before the player.
* If a rival bacterium reaches a resource before the player, it consumes the resource and might multiply.
* Rival bacteria can also "attack" or "consume" the player's bacteria if they outnumber them in an adjacent tile.

### End game conditions:
Player or Rival Can't Move: If either the player or the rival is surrounded and can't make any valid moves, the game ends. The one who can't move loses.
Dominance: If either the player or the rival occupies a significant majority of the board (e.g., 80% or more), that entity is declared the winner.
Stalemate: If a certain number of moves go by without any new bacteria being created and without any resources being collected, the game could be declared a draw.

## Potential Advanced Mechanics:
### Upgrades:
* As the player's bacteria consume resources, they accumulate points.
* Points can be spent on upgrades, such as faster movement, faster multiplication, or defense against rival colonies.

### Different Types of Resources:
* Some resources could provide more growth, while others might enable special abilities for a limited time.

### Environmental Hazards:
* Parts of the petri dish could become contaminated, posing a threat to all bacteria.
* The player must navigate their bacteria away from these hazards.

### Tactics:
* The player can split their colony to pursue multiple resources or to flank rival colonies.
* Introduce a "stasis" mode where the player's bacteria can remain stationary, acting as a blockade or defense.

## Player Interaction:
The player will primarily use keyboard inputs to move their bacteria. They'll strategize on how to quickly consume resources, when to multiply, when to engage or avoid rival colonies, and how to best spend their points on upgrades.

The challenge for the player lies in quick decision-making, anticipating rival movements, and efficiently navigating the petri dish environment.