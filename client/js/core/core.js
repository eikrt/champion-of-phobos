import {
	objects
} from "../world/objects.js";

import {
	core_logic
} from "../utils/logic.js";
import {
	updateWs
} from "../utils/logic.js"

import {
	updateFromServer
} from "../utils/logic.js";

import {
	constants
} from "../utils/constants.js";


import {
	connectToServer
} from "../utils/constants.js";
import {
	levels
} from "../world/levels.js";
import {
	movement
} from "../utils/movement.js";

import {
	state
} from "../world/state.js";
import {
	renderEngine
} from "../utils/renderengine.js"
var Raycaster = function() {

	var engine = null;

	var start = async function(canvasId) {

		var canvas = document.getElementById(canvasId);
		canvas.width = constants.screenWidth*2;
		canvas.height = constants.screenHeight*2;
		const running = true;


		if (running) {
				objects.context = canvas.getContext("2d");
				objects.context.scale(2,2)
				objects.Level = levels[0];
				objects.Level.init();

				objects.loadResources();

				let engine = new renderEngine;
				movement().init();



			let userver;
			if (state.connected) {
				constants.ws = connectToServer(document.getElementById("serverIp").value)
				userver = await updateFromServer()

			}
				objects.gameloopInterval = setInterval(function() {

					if (!objects.player.gameover) {


						if (userver) {
							userver.update();
						}
						movement().update();
						core_logic().logic()
						renderEngine().update();
					}
					document.getElementById("connectButton").onclick = async() => {
						

						constants.ws = connectToServer(document.getElementById("serverIp").value)

						userver = await updateFromServer()
						state.connected = true;
					}
				}, constants.glIntervalTimeout);
			
		}
	}
	return {
		engine: engine,
		start: start
	};
}();


document.addEventListener("DOMContentLoaded", function() {
	Raycaster.start("raycaster");

}, true);
