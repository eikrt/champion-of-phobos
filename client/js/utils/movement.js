
import { classes } from "./classes.js"

import { objects } from "../world/objects.js"
import { levels } from "../world/levels.js"

import { constants } from "./constants.js"

import { renderEngine } from "./renderengine.js"
import { raycasting } from "./raycasting.js"


let time = 100;
let change = 0;
let damageTime = 100;
let damageChange = 0;
export function movement () {
	var player = objects.player;


	var findIntersection = function(angle)
	{
		if (constants.noClipping) {
			return false;
		}

		var objects = raycasting().findObjects(angle);

		if (objects.length > 0) {

			return objects[objects.length - 1];
		}

		return false;
	}

	var turn = function(angle)
	{
		player.angle.turn(angle);
		renderEngine().redraw();
	};
	var collision = function(forward) {


		var angle = forward 
			? player.angle 
			: new classes.Angle(player.angle.degrees + 180);

		var intersection = findIntersection(angle);
		if (intersection && intersection.distance < 75  &&   intersection.type!=='projectile') {

		}
		else if (intersection && intersection.type === 'projectile' && intersection.distance < 125) {
			damageChange += 10
			if (intersection.ownerId && intersection.ownerId !== objects.player.id && damageChange > damageTime) {
				objects.player.hp -= 25;
				document.getElementById("hp").innerHTML=`HP: ${objects.player.hp}`
				damageChange = 0;
			}
		}

	}
	var walk = function(forward)
	{

		let step = forward ? constants.movementStep : -constants.movementStep;

		var delta = raycasting().getDeltaXY(player.angle, step);

		var angle = forward 
			? player.angle 
			: new classes.Angle(player.angle.degrees + 180);

		var intersection = findIntersection(angle);
		if (intersection && intersection.distance < 75  &&   intersection.type!=='projectile') {

		}
		else {

			player.x = Math.round(player.x + delta.x);
			player.y = Math.round(player.y - delta.y);

		}

		renderEngine().redraw();
	};

	var elevate = function(up)
	{
		let step = up ? constants.movementStep : -constants.movementStep;
		player.z += step;

		if (player.z < 0) {
			player.z = 0;
		}

		renderEngine().redraw();
	};

	var strafe = function(left)
	{
		var angle = left 
			? new classes.Angle(player.angle.degrees + 90)
			: new classes.Angle(player.angle.degrees - 90);

		var delta = raycasting().getDeltaXY(angle, constants.movementStep);
		let  intersection = findIntersection(angle);

		if (!intersection || intersection.distance > 20) {
			player.x = Math.round(player.x + delta.x);
			player.y = Math.round(player.y - delta.y);
		}

		renderEngine().redraw();
	};

	var update = function()
	{
		change += 10;
		collision(true)
		if (objects.player.hp <= 0) {
			objects.player.gameover=true;
		}
		if (objects.keys.space.pressed) {
			if (!objects.player.shoot && change > time) {	
				objects.player.shoot=true;
				change = 0;
			}
		}
		if (objects.keys.arrowLeft.pressed || objects.keys.charQ.pressed) {
			turn(constants.turningStep);
		}
		else if (objects.keys.arrowRight.pressed || objects.keys.charE.pressed) {
			turn(-constants.turningStep);
		}

		if (objects.keys.arrowUp.pressed || objects.keys.charW.pressed) {
			walk(true);
		}
		else if (objects.keys.arrowDown.pressed || objects.keys.charS.pressed) {
			walk(false);
		}

		if (objects.keys.charA.pressed) {
			strafe(true);
		}
		else if (objects.keys.charD.pressed) {
			strafe(false);
		}

		if (objects.keys.esc.pressed) {
			clearInterval(objects.gameloopInterval);
		}

		if (objects.keys.charR.pressed) {
			objects.player.angle.setValue(objects.player.angle.degrees - 180);
			objects.keys.charR.pressed = false;
			renderEngine.redraw();
		}

		if (objects.keys.charZ.pressed) {
			elevate(true);
		}

		if (objects.keys.charX.pressed) {
			elevate(false);
		}
	}

	let init = function()
	{
		var preventDefault = function(e) 
		{
			e.preventDefault 
				? e.preventDefault() 
				: e.returnValue = false;
		};

		var keyDownHandler = function (e) 
		{
			var keyCode = e.keyCode || e.which;

			for (var name in objects.keys) {
				if (objects.keys[name].code == keyCode) {
					objects.keys[name].pressed = true;
					preventDefault(e);
				}
			}
		};

		var keyUpHandler = function (e) 
		{
			var keyCode = e.keyCode || e.which;

			for (var name in objects.keys) {
				if (objects.keys[name].code == keyCode) {
					objects.keys[name].pressed = false;
					preventDefault(e);
				}
			}
		};

		window.addEventListener("keydown", keyDownHandler, false);

		window.addEventListener("keyup", keyUpHandler, false);

		var keys = document.getElementsByClassName("keys");

		for (var i = 0, n = keys.length; i < n; ++i) {
			var key = keys[i];
			var keyCode = parseInt(key.getAttribute("data-code"), 0);

			(function(k, kc) {
				k.addEventListener("mouseover", function() {
					keyDownHandler({ keyCode: kc });
					return false;
				}, false);
				k.addEventListener("mouseout", function() {
					keyUpHandler({ keyCode: kc });
					return false;
				}, false);
			}(key, keyCode));
		}

	};

	return {
		update: update,
		init: init
	};
};

