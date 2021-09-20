import { levels } from '../world/levels.js'

import { constants } from '../utils/constants.js'

import { objects } from '../world/objects.js'
import { classes } from '../utils/classes.js'
import { state } from '../world/state.js'
let ws;
export function core_logic() {

	let logic = function (last) {
			if (state.winner === '') {
				document.getElementById("winner").innerHTML=``
			}
			else {
				document.getElementById("winner").innerHTML=`WINNER: ${state.winner}`
			}
		const delta = 10;
		objects.Level.sprites = levels.entities;
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

			const rx = Math.floor(Math.random() * levels.spawnPoints.length);
			const ry = Math.floor(Math.random() * levels.spawnPoints.length);
			console.log(rx)
			objects.player.x = levels.spawnPoints[rx].x 
			objects.player.y = levels.spawnPoints[ry].y 
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
			name: objects.player.name
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
		if (g.id !== objects.player.id) {
			entities.push(classes.Sprite(g.x, g.y, 0,0,0,g.texId, 0, g.shooterId, 'projectile'))
		if (g.winner)
			state.winner=g.winner
		}
		})
	levels.entities = entities;


}
