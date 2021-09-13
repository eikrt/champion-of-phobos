import { levels } from '../world/levels.js'

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
