
import { constants } from "../utils/constants.js"

import { classes } from "../utils/classes.js"


export let objects =
	{
		player: 
		{
			x: constants.playerStartPos.x,
			y: constants.playerStartPos.y,
			z: constants.playerStartPos.z,
			angle: new classes.Angle(constants.playerStartAngle),
			height: 48,
			width: 0,
			shoot: false,
			id: 0,
			name: 'player',
			hp: 100,
			armor: 0,
			gameover: false
		},

		settings:
		{
			renderTextures: function() {
				return true;

			},
			renderLighting: function() {
				return true;
			},
			renderSky: function() {

				return true;
			},
			renderFloor: function() {
				return false;
			},
			renderSprites: function() {
				return true;
			},
			selectedLevel: function() {
				var selected = 0;

				if (location.hash) {

					if (index) {
						selected = index;
					}
				}

				return selected;
			},
			selectedResolution: function() {
				var selected = { w: 320, h: 240 };

				if (location.hash) {
					var settings = location.hash.split("#")[1];
					var res = parseInt(settings.split(",")[1]);

					if (res == 320) {
						selected = { w: 320, h: 240 };
					}
					else {
					}
				}

				return selected;
			}
		},

		keys: {
			arrowLeft: classes.KeyButton(37),
			arrowUp: classes.KeyButton(38),
			arrowRight: classes.KeyButton(39),
			arrowDown: classes.KeyButton(40),
			lessThan: classes.KeyButton(188),
			greaterThan: classes.KeyButton(190),
			esc: classes.KeyButton(27),
			shift: classes.KeyButton(16),
			charR: classes.KeyButton(82),
			charA: classes.KeyButton(65),
			charZ: classes.KeyButton(90),
			charQ: classes.KeyButton(81),
			charW: classes.KeyButton(87),
			charE: classes.KeyButton(69),
			charS: classes.KeyButton(83),
			charD: classes.KeyButton(68),

			charX: classes.KeyButton(88),
			space: classes.KeyButton(32)
		},

		context: null,         
		bufferctx: null,
		gameloopInterval: null, 
		redrawScreen: true,     
		textures: null,         
		sprites: null,          
		skyImage: new Image(),  

		loadResources: function() 
		{

			this.textures = new Array();
			for (var i = 0; i < constants.texturesFiles.length; i++) {
				objects.textures[i] = new Image();
				objects.textures[i].src = constants.texturesFiles[i];
				objects.textures[i].onload = function() {
					objects.redrawScreen = true;
				};
			}

			objects.sprites = new Array();
			for (var i = 0; i < constants.spriteFiles.length; i++) {
				objects.sprites[i] = new Image();
				objects.sprites[i].src = constants.spriteFiles[i];
			}

			objects.skyImage.src = constants.skyImage;
			objects.skyImage.onload = function() {
				objects.redrawScreen = true;
			};
		}
	}
