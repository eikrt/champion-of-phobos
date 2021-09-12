import { classes } from "./raycaster.classes.js"
import { objects } from "./raycaster.objects.js"
import { constants } from "./raycaster.constants.js"
import { drawing } from "./raycaster.drawing.js"
import { raycasting } from "./raycaster.raycasting.js"
export function renderEngine()
{
        let lastFpsUpdate = new Date().getTime();
    
    constants.distanceToViewport = Math.round(constants.screenWidth / 2 / Math.tan(constants.fieldOfView / 2 * (Math.PI / 180)));
    constants.angleBetweenRays   = Number(constants.fieldOfView / constants.screenWidth);
    
    
    
    var drawSky = function()
    {
        if (objects.settings.renderSky()) {
            var skyX = objects.skyImage.width - parseInt(objects.player.angle.degrees * (objects.skyImage.width / 360)),
                skyWidth = constants.screenWidth,
                leftOverWidth = 0;
                
            if (skyX + skyWidth > objects.skyImage.width) {
                leftOverWidth = skyX + skyWidth - objects.skyImage.width;
                skyWidth -= leftOverWidth;
            }
            
            if (skyWidth > 0) {
                objects.context.drawImage(objects.skyImage,
                                  skyX, 0, skyWidth, constants.screenHeight / 2,
                                  0, 0, skyWidth, constants.screenHeight / 2);
            }

            if (leftOverWidth > 0) {
                objects.context.drawImage(objects.skyImage,
                                  0, 0, leftOverWidth, constants.screenHeight / 2,
                                  skyWidth, 0, leftOverWidth, constants.screenHeight / 2);
            }
        }
    }
    
    var drawFloorGradient = function()
    {
        var context = objects.context,
            gradient = context.createLinearGradient(0, constants.screenHeight / 2, 0, constants.screenHeight);
        
        gradient.addColorStop(0, drawing.colorRgb(20, 20, 20));
        gradient.addColorStop(0.25, drawing.colorRgb(40, 40, 40));
        gradient.addColorStop(0.6, drawing.colorRgb(100, 100, 100));
        gradient.addColorStop(1, drawing.colorRgb(130, 130, 130));
        
        context.fillStyle = gradient;
        context.fillRect(0, constants.screenHeight / 2, constants.screenWidth, constants.screenHeight / 2);
    }
    
    var drawFloor = function(vscan, startY, intersection)
    {
        var step = 1;
        
        if (objects.settings.renderFloor() && vscan % step == 0) {
            
            var floorTexture = objects.textures[objects.Level.floorTextureId];
            
            for (var y = startY; y < constants.screenHeight; y += step) {
                var curdist = constants.screenHeight / (2 * y - constants.screenHeight);
            
                var weight = curdist / intersection.distance,
                    floorX = weight * intersection.x + (1 - weight) * objects.player.x,
                    floorY = weight * intersection.y + (1 - weight) * objects.player.y,
                    textureX = parseInt(floorX * floorTexture.width) % floorTexture.width,
                    textureY = parseInt(floorY * floorTexture.height) % floorTexture.height;
                    
                context.drawImage(floorTexture, 
                                  textureX, textureY, 1, 1,
                                  vscan, y, step, step);
                
            }
        }
    };
    var drawObjects = function(vscan, angle)
    {
        var intersections = raycasting().findObjects(angle, vscan);
        
        for (var i = 0; i < intersections.length; i++) {
            var intersection = intersections[i];
            if (intersection.isSprite) {
                drawSprite(vscan, intersection);
            }
            else {
                drawWall(vscan, intersection);
            }
        }
        
    }
    
    var drawWall = function(vscan, intersection)
    {
        var drawParams = intersection.drawParams;
            
        if (objects.settings.renderTextures()) {
            objects.context.drawImage(drawParams.texture, 
                              intersection.textureX, drawParams.sy1, 1, drawParams.sy2 - drawParams.sy1,
                              vscan, drawParams.dy1, 1, drawParams.dy2 - drawParams.dy1);
        }
        else {
            drawing.lineSquare(vscan, drawParams.dy1,  1, drawParams.dy2, drawing.colorRgb(128, 0, 0));
        }
        
        if (objects.settings.renderLighting() && intersection.distance > constants.startFadingAt) {
            drawing.lineSquare(vscan, drawParams.dy1, 1, drawParams.dy2, drawing.colorRgba(0, 0, 0, calcDistanceOpacity(intersection.distance)))
        }
    }
    
    var drawSprite = function(vscan, intersection)
    {
        if (objects.settings.renderSprites()) {
            var drawParams = intersection.drawParams;
                
            objects.context.drawImage(drawParams.texture, 
                              intersection.textureX, drawParams.sy1, 1, drawParams.sy2 - drawParams.sy1,
                              vscan, drawParams.dy1, 1, drawParams.dy2 - drawParams.dy1);

            if (objects.settings.renderLighting() && intersection.distance > constants.startFadingAt) {
                var opacity = calcDistanceOpacity(intersection.distance);
                
                if (opacity > 0) {
                    objects.context.globalAlpha = opacity;
                    objects.context.drawImage(objects.sprites[intersection.resourceIndex + 1], 
                                      intersection.textureX, drawParams.sy1, 1, drawParams.sy2 - drawParams.sy1,
                                      vscan, drawParams.dy1, 1, drawParams.dy2 - drawParams.dy1);
                    objects.context.globalAlpha = 1;
                }
            }
        }
    }
    
    var calcDistanceOpacity = function(distance) 
    {
        var colorDivider = Number(distance / (constants.startFadingAt * 1.5)); 
        colorDivider = (colorDivider > 5) ? 5 : colorDivider;
        
        return Number(1 - 1 / colorDivider);
    };
    
    var drawWorld = function()
    {
        drawing.clear();
        drawing.square(0, 0, constants.screenWidth, constants.screenHeight / 2, drawing.colorRgb(60, 60, 60));
        drawing.square(0, constants.screenHeight / 2, constants.screenWidth, constants.screenHeight / 2, drawing.colorRgb(120, 120, 120));
        
        drawSky();
        drawFloorGradient();
        
        var angle = new classes.Angle(objects.player.angle.degrees + constants.fieldOfView / 2);
        
        for (var vscan = 0; vscan < constants.screenWidth; vscan++)  {
            drawObjects(vscan, angle);
            angle.turn(-constants.angleBetweenRays);
        }
    };
    
    var updateElevation = function() 
    {
        for (var i in objects.Level.elevations) {
            var elevation = objects.Level.elevations[i],
                area = elevation.area;

            if (objects.player.x >= area.x1 && objects.player.x <= area.x2 &&   
                objects.player.y >= area.y1 && objects.player.y <= area.y2) 
            {
                objects.player.z = elevation.height;
                return;
            }
        }
        
        objects.player.z = 0;
    };
    
    var redraw = function()
    {
        objects.redrawScreen = true;
    }
    
    var update = function()
    {
        if (objects.redrawScreen) {
            updateElevation();
            drawWorld();
            objects.redrawScreen = false;
        }
    }
    return {
        redraw: redraw,
        update: update
    };
};
