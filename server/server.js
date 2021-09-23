const WebSocket = require('ws');
const wss = new WebSocket.Server({
	port: 7071
});


const clients = new Map();
let projectiles = []
let winner = ''
wss.on('connection', (ws) => {



	ws.on('message', (messageAsString) => {
		const message = JSON.parse(messageAsString);
		const metadata = clients.get(ws);
		if (metadata)
			message.sender = metadata.id;
		if (message.type === "update") {

			tick()
			const outbound = JSON.stringify(message)
			message.deletedProjectiles.forEach(dp => {
			/*projectiles = projectiles.filter(function( obj ) {
				  return obj.ident !== dp;
					
			

			})*/
			projectiles.forEach(p => {

				if (p.ident === dp) {

					p.active = false;
				}
			})
			});
			clients.forEach((client) => {
				if (client.id === message.id) { // state update
					client.x = message.x
					client.y = message.y
					client.winner=winner
					client.active = message.active
					client.name = message.name
					client.angle = message.angle
					client.type = 'player'
				}
			});
			if (message.action === "shoot") {
				shoot(message.x, message.y, message.angle, message.id)
			}
			let array = Array.from(clients.values())
			array = [...array, ...projectiles]
			ws.send(JSON.stringify(array))
		} else if (message.type === "init") {
			const id = uuidv4();
			const md = {
				id: id,
				texId: 4,
				x: 0,
				y: 0,
				winner: ''

			};
			clients.set(ws, md);
			ws.send(JSON.stringify({
				type: "init",
				id: md.id
			}))
		} else if (message.type === "gameover") {
					winner=message.name
		}
	})

	ws.on("close", () => {
		clients.delete(ws);
	})
})

function shoot(x, y, angle, id) {
	projectiles.push({
		x: x,
		y: y,
		z: 5,
		velocity: 0.3,
		angle: angle,
		texId: 0,
		yoff: 0,
		shooterId: id,
		timer: 200,
		active: true,
		type: 'projectile',
		ident: uuidv4()})

}
function tick() {

	const delta = 10
	projectiles.forEach(s => {
		s.timer -= delta;
		s.x += (Math.cos(s.angle.radians) * s.velocity / delta)*1000;
		s.y -= (Math.sin(s.angle.radians) * s.velocity / delta)*1000

		if (s.timer <= 0) {
			//s.active=false;
		}
	})


}
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
