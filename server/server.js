const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });


const clients = new Map();

wss.on('connection', (ws) => {


		
	ws.on('message', (messageAsString) => {
      		const message = JSON.parse(messageAsString);
	      	const metadata = clients.get(ws);
		if (metadata)
	      		message.sender = metadata.id;
		if (message.type === "update") {

				
		const outbound = JSON.stringify(message);
			
	      clients.forEach((client) => {
		      		if (client.id === message.id) {// state update
		      			client.x = message.x
		      			client.y = message.y
				}
		              ws.send(JSON.stringify(client));
	            });
		}
		else if (message.type === "init") {
	    		const id = uuidv4();
    	    		const md = {
		    		id: id,
			   	 x: 0,
			   	 y: 0};
    	    		clients.set(ws, md);
			ws.send(JSON.stringify({type: "init",
			id: md.id}))
		}
	})

	 ws.on("close", () => {
		       clients.delete(ws);
	     })
	})



function uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	      return v.toString(16);
	    });
}
