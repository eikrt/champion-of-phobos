import { levels } from '../world/levels.js'

import { constants } from '../utils/constants.js'

import { objects } from '../world/objects.js'
import { classes } from '../utils/classes.js'

export function core_logic() {

	let logic = function (last) {
		const delta = 10;
		objects.Level.sprites = levels.entities;
		//console.log(objects.Level.sprites[objects.Level.sprites.length-1].type)
	}
	return {
		logic: logic
	};
}


export async function updateFromServer() {

	const ws = await constants.ws


	ws.onmessage = (wsmessage) => {

		const messageBody = JSON.parse(wsmessage.data)
		if (messageBody.type === "init") {
			objects.player.id = messageBody.id
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
		const shoot = objects.player.shoot ? "shoot" : ""
		ws.send(JSON.stringify({
			type : "update",
			action: shoot,
			x : objects.player.x,
			y : objects.player.y,
			angle: objects.player.angle,
			id : objects.player.id
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
				
		}
		})
	levels.entities = entities;



}
