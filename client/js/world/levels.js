
import { classes } from "../utils/classes.js"
import { objects } from "../world/objects.js"

export let levels = {

	// Wall: function(x1, y1, x2, y2, z1, z2, h1, h2, textureId) {
	walls: [




		classes.Wall(100, 10, 700, 10, 0, 0, 200, 200, 1),
		classes.Wall(10, 100, 10, 700, 0, 0, 200, 200, 1),
		classes.Wall(10, 100, 100, 10, 0, 0, 200, 200, 1),
		classes.Wall(790, 100, 790, 700, 0, 0, 200, 200, 1),
		classes.Wall(700, 10, 790, 100, 0, 0, 200, 200, 1),
		classes.Wall(100, 790, 700, 790, 0, 0, 200, 200, 1),
		classes.Wall(790, 700, 700, 790, 0, 0, 200, 200, 1),
		classes.Wall(10, 700, 100, 790, 0, 0, 200, 200, 1),

	],

	sprites: [
		//  classes.Sprite(100, 300, 0,0,0, 2),
	],
	entities: [

	],

	sceneSprites: [
		
	],
	elevations: [    
	],

	floorTextureId: 4,

	init: function() {
		objects.player.angle.setValue(340);
	}
};

