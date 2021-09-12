export let constants =
{
    fieldOfView: 66,       
    screenWidth: 640,       
    screenHeight: 480,      
    angleBetweenRays: Number(66 / 640), 
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
        "res/bricks-gray.png",
        "res/painting.png",
        "res/wood.png",
        "res/floor.png",
    ],
    spriteFiles: [          
        "res/barrel.png",
        "res/barrel_mask.png",
        "res/pillar.png",
        "res/pillar_mask.png",
    ],
    skyImage: "res/sky.jpg",        
    debugFont: "bold 12px arial",   
    glIntervalTimeout: 50           
};
