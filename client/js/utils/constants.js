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
			"res/painting.png",
			"res/wood.png",
			"res/floor.png",

		],
		spriteFiles: [          
			"res/plasma.png",
			"res/plasma.png",
			"res/pillar.png",
			"res/pillar_mask.png",
			"res/lizard.png",
			"res/lizard.png"
		],
		skyImage: "res/sky.jpg",        
		debugFont: "bold 12px arial",   
		glIntervalTimeout: 50,       
		ws: connectToServer(),

	};

async function connectToServer() {
	const ws = new WebSocket('ws://localhost:7071/ws');



	return new Promise((resolve, reject) => {
		const timer = setInterval(() => {
			if(ws.readyState === 1) {
				clearInterval(timer)
				resolve(ws);
			}
		}, 10);})

}

