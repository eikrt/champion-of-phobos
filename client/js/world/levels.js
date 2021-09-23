
import { classes } from "../utils/classes.js"
import { objects } from "../world/objects.js"





let map = 	[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
		[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[1,0,2,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,0,2,0,1,],
		[1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,1,],
		[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,1,],
		[1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,],
		[1,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,0,1,],
		[1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,],
		[1,0,1,1,1,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,1,],
		[1,0,1,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,1,],
		[1,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,1,],
		[1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,],
		[1,0,0,0,1,0,1,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1,],
		[1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,1,],
		[1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,],
		[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,1,],
		[1,0,1,1,1,1,1,0,0,0,0,1,0,2,0,0,0,0,0,0,0,1,0,1,],
		[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,],
		[1,0,1,1,0,0,1,1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,1,],
		[1,0,1,0,0,2,0,1,0,2,0,1,0,0,0,1,0,0,1,0,0,1,0,1,],
		[1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]]
/*map = [
	[1,1,1,1,1],
	[1,0,0,0,1],
	[1,0,2,1,1],
	[1,3,0,0,1],
	[1,1,1,1,1],

]*/
const WALL_SIZE = 128

export let levels = [
	{
		walls: generateMap() 
		,
		spawnPoints: generateSpawnPoints(),
		sprites: [
		],
		entities: [

		],

		sceneSprites: [
			
		],
		elevations: [    
		],
		foliage: generateFoliage(),	
		props: generateProps(),
		floorTextureId: 4,

		init: function() {
			objects.player.angle.setValue(340);
		}
		}
	,
	{

		walls: generateMap() 
		,
		spawnPoints: generateSpawnPoints(),
		sprites: [
		],
		foliage: [
			
			classes.Sprite(50, 50, 0,0, 0,11, 0, 0, 0, 'foliage')
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
}]
function generateMap() {
	let walls = []

	for (let i = 0; i < map.length; i++) {

		for (let j = 0; j < map.length; j++) {
			if (map[j+1]) {
				if (map[j][i] === 1 && map[j+1][i] === 1){ 
					walls.push(classes.Wall(j*WALL_SIZE, i*WALL_SIZE, (j+1)*WALL_SIZE, i*WALL_SIZE, 0, 0, 200, 200, 1))
				}
			}

			if (map[j][i+1]) {
				if (map[j][i] === 1 && map[j][i] === 1){ 
					walls.push(classes.Wall(j*WALL_SIZE, i*WALL_SIZE, (j)*WALL_SIZE, (i+1)*WALL_SIZE, 0, 0, 200, 200, 1))
				}
			}
		}}
	return walls;
		}



	
function generateProps() {
	let props = []
	for (let i = 0; i < map.length; i++) {

		for (let j = 0; j < map.length; j++) {
			if (map[j][i] === 3) {
				props.push(	
					classes.Sprite(j*WALL_SIZE, i*WALL_SIZE, 0,0, 0,12, 0, 0, 0, 'prop'))
			}
		}

	}

		return props;
}
function generateSpawnPoints() {
	let spawnPoints = [];
	for (let i = 0; i < map.length; i++) {

		for (let j = 0; j < map.length; j++) {

			if (map[j][i] === 2) {
				spawnPoints.push(
					{x: j*WALL_SIZE,
					 y: i*WALL_SIZE})
			}
		}

	}
	return spawnPoints
}

function generateFoliage() {

	let foliage = []
	const foliageNumber = map.length / 2
	for (let i = 0; i < foliageNumber; i++) {
		const x =  Math.floor(Math.random() * (map.length*WALL_SIZE))
		const y =  Math.floor(Math.random() * (map.length*WALL_SIZE));
		foliage.push(classes.Sprite(x, y, 0,0, 0,10, 0, 0, 0, 'foliage'))
	}
	return foliage;

}
