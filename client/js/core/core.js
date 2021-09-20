import {
    objects
} from "../world/objects.js";

import {
    core_logic
} from "../utils/logic.js";
import {
    updateFromServer
} from "../utils/logic.js";

import {
    constants
} from "../utils/constants.js";

import {
    levels
} from "../world/levels.js";
import {
    movement
} from "../utils/movement.js";

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
		objects.Level = levels;
		objects.Level.init();

		objects.loadResources();

		let engine = new renderEngine;
		movement().init();

		const userver = await updateFromServer()
		objects.gameloopInterval = setInterval(function() {

		    userver.update();
		    movement().update();
		    core_logic().logic()
		    renderEngine().update();
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
