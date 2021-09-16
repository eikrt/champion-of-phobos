import { levels } from '../world/levels.js'

import { constants } from '../utils/constants.js'

import { objects } from '../world/objects.js'
import { classes } from '../utils/classes.js'

export function core_logic() {
	
	let logic = function (last) {
		const delta = 10;
		levels.sprites.forEach(s => {
			s.x += (Math.cos(s.angle) * s.velocity / delta)*1000;
			s.y -= (Math.sin(s.angle) * s.velocity / delta)*1000})
	}
	return {
		logic: logic
	};
}


export async function updateFromServer() {

		const ws = await constants.ws
		let id = 0;
		
		ws.onmessage = (wsmessage) => {
			
		const messageBody = JSON.parse(wsmessage.data)
			if (messageBody.type === "init") {
				id = messageBody.id
			}
			else {

				set_game_state(messageBody)	
			}	
		}
	let update = async function () {

		if (id === 0) {


			ws.send(JSON.stringify({

				type:"init"
			}))
		}
		ws.send(JSON.stringify({
			type : "update",
			x : objects.player.x,
			y : objects.player.y,
			id : id
		}))	
		
	}
	return {
		update: update
	};
}

function set_game_state(game_state) {
	const entities = []
	game_state.forEach((g) => {
		entities.push(g.x, g.y, 0,0,0,2)
	})
    levels.entities = entities;
//        classes.Sprite(100, 300, 0,0,0, 2),
	
    

}
