const WebSocket = require('ws');
const wss = new WebSocket.Server({
	port: 7071
});


const clients = new Map();
const projectiles = []
let winner = ''
wss.on('connection', (ws) => {



	ws.on('message', (messageAsString) => {
		const message = JSON.parse(messageAsString);
		const metadata = clients.get(ws);
		if (metadata)
			message.sender = metadata.id;
		if (message.type === "update") {

			tick()
			const outbound = JSON.stringify(message);

			clients.forEach((client) => {
				if (client.id === message.id) { // state update
					client.x = message.x
					client.y = message.y
					client.winner=winner
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
		velocity: 0.2,
		angle: angle,
		texId: 0,
		yoff: 0,
		shooterId: id})

}
function tick() {

	const delta = 10
	projectiles.forEach(s => {
		s.x += (Math.cos(s.angle.radians) * s.velocity / delta)*1000;
		s.y -= (Math.sin(s.angle.radians) * s.velocity / delta)*1000})

}
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
