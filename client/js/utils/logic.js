import { levels } from '../world/levels.js'

import { constants } from '../utils/constants.js'

import { objects } from '../world/objects.js'
import { classes } from '../utils/classes.js'

import { state } from '../world/state.js'
import { raycasting } from '../utils/raycasting.js'
let ws;
let deletedProjectiles = []
export function core_logic() {

	var findIntersection = function(x, y, angle)
	{
		if (constants.noClipping) {
			return false;
		}
		var objects = raycasting().findObjects(x, y, angle);
		if (objects.length > 0) {

			return objects[objects.length - 1];
		}

		return false;
	}
	let logic = function (last) {
			if (state.winner === '') {
				document.getElementById("winner").innerHTML=``
			}
			else {
				document.getElementById("winner").innerHTML=`WINNER: ${state.winner}`
			}
		const delta = 10;
		objects.Level.sprites = objects.Level.entities;
		objects.Level.entities.forEach(e => {
		var delta = raycasting().getDeltaXY(e.angle, 0.8);
		var angle = false 
			? e.angle.degrees 
			: new classes.Angle(e.angle.degrees);
		
		var intersection = findIntersection(e.x, e.y, angle);
		if (intersection && intersection.distance < 50  &&   intersection.type!=='projectile') {
				deletedProjectiles.push(e.ident)
			}
		})	


	}
	return {
		logic: logic
	};
}
export async function updateWs() {
	ws = await constants.ws
}
export async function updateFromServer() {

	await updateWs()
	if (!ws) {
		return;
	}
	
	ws.onmessage = (wsmessage) => {

		const messageBody = JSON.parse(wsmessage.data)
		if (messageBody.type === "init") {
			objects.player.id = messageBody.id

			const rx = Math.floor(Math.random() * objects.Level.spawnPoints.length);
			const ry = Math.floor(Math.random() * objects.Level.spawnPoints.length);
			objects.player.x = objects.Level.spawnPoints[rx].x
			objects.player.y = objects.Level.spawnPoints[ry].y 
		}
		
		else {
			set_game_state(messageBody)	
		}
	}
	
	let update = async function () {
		if (objects.player.id === 0) {

			ws.send(JSON.stringify({

				type:"init"
			}))
		}
		if (objects.player.gameover) {
			ws.send(JSON.stringify({
					
				type:"gameover",
				id: objects.player.id,
				name: objects.player.name
			}))
		}
		const shoot = objects.player.shoot ? "shoot" : ""
		ws.send(JSON.stringify({
			type : "update",
			action: shoot,
			x : objects.player.x,
			y : objects.player.y,
			angle: objects.player.angle,
			texId: 4,
			id : objects.player.id,
			name: objects.player.name,
			deletedProjectiles

		}))
		objects.player.shoot = false;

	}
	return {
		update: update
	};
}

function set_game_state(game_state) {
	const entities = []
	game_state.forEach((g) => {
		if (g.id !== objects.player.id && g.active) {
			let angle = g.angle
			entities.push(classes.Sprite(g.x, g.y, 0,0.8, g.angle,g.texId, 0, g.shooterId, g.ident, 'projectile'))
		if (g.winner)
			state.winner=g.winner
		}
		})
	objects.Level.entities = entities;


}
