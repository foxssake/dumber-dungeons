# Investigate rendering tech

To determine which library to use for displaying game state, we've created a
small prototype with multiple packages. Each prototype displayed moving
characters on a static background.

The main concern was performance on our target hardware - TVs. Three libraries were tested:

- [Phaser] ( [#20] )
- [pixi.js] ( [#9] )
- [three.js] ( [#11] )

[Phaser]: https://phaser.io/
[#20]: https://github.com/foxssake/dumber-dungeons/pull/20
[pixi.js]: https://pixijs.com/
[#9]: https://github.com/foxssake/dumber-dungeons/pull/9
[three.js]: https://threejs.org/
[#11]: https://github.com/foxssake/dumber-dungeons/pull/11

## Performance

Each prototype was tested both on PC and TV. The main metrics were number of
characters for a smooth 60+ fps - *steady* case -, and for ~30 fps - *stress*
case.

|          |     PC Steady |     PC Stress |    TV Steady |    TV Stress |
|----------|--------------:|--------------:|-------------:|-------------:|
| Phaser   | 16384 @ 71fps | 32768 @ 31fps | 1024 @ 60fps | 2048 @ 30fps |
| pixi.js  |  8192 @ 60fps | 16384 @ 40fps |  512 @ 60fps | 1024 @ 46fps |
| three.js |  4096 @ 60fps |  8192 @ 32fps |  256 @ 50fps |  512 @ 43fps |

Phaser appears to smooth the delta time passed to its callback, which explains
it always gravitating to either 60 or 30 fps.

three.js didn't go above 50fps even with 4 characters.

### Resolution

Note that each prototype rendered to a 512x512 canvas. This is comparable to a
2x zoom in full HD. 

While the numbers would be certainly lower at native resolution, they are
comparable nonetheless.

In addition, rendering at lower than native resolution can support the game's
pixel art style.

## Verdict

**three.js**

Even though it is the slowest of the tested libraries, it fast *enough*. We do
not expect to have 256 characters continuously running around on the screen.

As benefit, three.js provides a full 3D viewport, which can simplify asset
creation for our particular team.

There is also desire from the team to learn 3D technologies, which was a big
factor in the decision.

## Testing hardware

### TV

Samsung 55" Crystal UHD TU7100 4K Smart TV ( model number UE55TU7102KXXH )

Running on the TV's browser

### PC

- CPU: AMD Ryzen 5 3600
- GPU: nVidia GeForce GTX 1050 Ti
- RAM: 16GB DDR4 @ 2667MHz
- Browser: Firefox 132.0.2
- OS: Linux Mint 21.3
