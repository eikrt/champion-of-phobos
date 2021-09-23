export let constants =
	{
		fieldOfView: 70,       
		screenWidth: 480,       
		screenHeight: 320,      
		angleBetweenRays: Number(70 / 480), 
		movementStep: 25,        
		turningStep: 9,        
		startFadingAt: 100,    
		playerStartAngle: 273,  
		playerStartPos: {      
			x: 80,
			y: 160,
			z: 0
		},
		distanceToViewport: 0,  
		noClipping: false,    
		displayDebugInfo: false,
		texturesFiles: [       
			"res/bricks-brown.png",
			"res/cliff.png",

		],
		spriteFiles: [          
			"res/plasma.png",
			"res/plasma.png",
			"res/lizard.png",
			"res/lizard.png",
			"res/lizard2.png",
			"res/lizard2.png",
			"res/lizard3.png",
			"res/lizard3.png",
			"res/lizard4.png",
			"res/lizard4.png",
			"res/grass.png",
			"res/grass.png",
			"res/medkit.png",
			"res/medkit.png",

		],
		skyImage: "res/sky.jpg",        
		debugFont: "bold 12px arial",   
		glIntervalTimeout: 50,       
		ws: connectToServer,


	};

export async function connectToServer(ip) {

	let ws = null;
	try {
		ws = new WebSocket(`ws://${ip}/ws`);
	} catch(err) {
	}
	ws.onerror = function (error) {
		return;
	}
	return new Promise((resolve, reject) => {
		const timer = setInterval(() => {
			if(ws && ws.readyState === 1) {
				clearInterval(timer)
				resolve(ws);
			}
		}, 10);})

}
