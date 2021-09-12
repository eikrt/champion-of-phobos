
import { classes } from "./raycaster.classes.js"
import { objects } from "./raycaster.objects.js"

export let levels = {
    walls: [
        classes.Wall(100, 10, 700, 10, 0, 0, 200, 200, 1),
        classes.Wall(10, 100, 10, 700, 0, 0, 200, 200, 1),
        classes.Wall(10, 100, 100, 10, 0, 0, 200, 200, 1),
        classes.Wall(790, 100, 790, 700, 0, 0, 200, 200, 1),
        classes.Wall(700, 10, 790, 100, 0, 0, 200, 200, 1),
        classes.Wall(100, 790, 700, 790, 0, 0, 200, 200, 1),
        classes.Wall(790, 700, 700, 790, 0, 0, 200, 200, 1),
        classes.Wall(10, 700, 100, 790, 0, 0, 200, 200, 1),
        
        classes.Wall(340, 300, 380, 320, 0, 0, 64, 64, 0),
        classes.Wall(380, 320, 420, 360, 0, 0, 64, 64, 0),
        classes.Wall(420, 360, 420, 424, 0, 0, 64, 64, 2),
        classes.Wall(420, 424, 400, 440, 0, 0, 64, 64, 0),
        classes.Wall(400, 440, 400, 470, 0, 0, 64, 64, 0),
        classes.Wall(400, 470, 430, 510, 0, 0, 64, 64, 0),
        classes.Wall(430, 510, 500, 530, 0, 0, 64, 64, 0),
        classes.Wall(500, 530, 560, 530, 0, 0, 64, 64, 0),
        classes.Wall(560, 530, 580, 500, 0, 0, 64, 64, 0),
        classes.Wall(580, 500, 560, 280, 0, 0, 64, 64, 0),
        classes.Wall(560, 280, 500, 220, 0, 0, 64, 64, 0),
        classes.Wall(500, 220, 340, 190, 0, 0, 64, 64, 0),
        classes.Wall(340, 190, 340, 300, 0, 0, 64, 64, 0),
        
        classes.Wall(240, 10, 300, 84, 0, 0, 128, 128, 1),
        classes.Wall(300, 84, 410, 84, 0, 0, 128, 128, 1),
        classes.Wall(410, 84, 470, 10, 0, 0, 128, 128, 1)
    ],
    
    sprites: [
        classes.Sprite(355, 171, 0, 2),
        classes.Sprite(355, 137, 0, 2),
        classes.Sprite(355, 103, 0, 2),
        classes.Sprite(320, 230, 0, 0),
        classes.Sprite(320, 247, 30, 0),
        classes.Sprite(320, 265, 0, 0)
    ],
    
    elevations: [    
    ],
    
    floorTextureId: 4,
    
    init: function() {
        objects.player.angle.setValue(340);
    }
};

