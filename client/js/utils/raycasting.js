
import { classes } from "./classes.js"
import { objects } from "../world/objects.js"
import { constants } from "./constants.js"
import { drawing } from "./drawing.js"
export function raycasting()
{
        let fishbowlFixValue = 0;
    
    var correctQuadrant = function(intersection, angle)
    {
        var deltaX = objects.player.x - intersection.x,
            deltaY = objects.player.y - intersection.y,

            quadrant = 0;
        
        var roundedAngle = ~~ (0.5 + angle.degrees);
        if (roundedAngle == 0 || roundedAngle == 360) {
            return deltaX < 0;
        }
        else if (roundedAngle == 90) {
            return deltaY > 0;
        }
        else if (roundedAngle == 180) {
            return deltaX > 0;
        }
        else if (roundedAngle == 270) {
            return deltaY < 0;
        }
        
        if (deltaX < 0 && deltaY >= 0) quadrant = 1;
        if (deltaX >= 0 && deltaY > 0) quadrant = 2;
        if (deltaX > 0 && deltaY <= 0) quadrant = 3;
        if (deltaX <= 0 && deltaY < 0) quadrant = 4;
        
        return quadrant == angle.getQuadrant();
    }
    
    var getHypotenuseLength = function(adjacentLength, oppositeLength)
    {
        return Math.sqrt(Math.pow(Math.abs(adjacentLength), 2) + Math.pow(Math.abs(oppositeLength), 2));
    }
    
    var setFishbowlFixValue = function(vscan)
    {
        var distortRemove = new classes.Angle(constants.fieldOfView / 2);
        distortRemove.turn(-constants.angleBetweenRays * vscan);
        
        fishbowlFixValue = Math.cos(distortRemove.radians);
    };
    
    var getIntersection = function(line, angle, dontRoundCoords) 
    {
        var px1 = objects.player.x,
            py1 = objects.player.y,
            px2 = px1 + Math.cos(angle.radians),
            py2 = py1 - Math.sin(angle.radians);
        
        var f1 = ((line.x2 - line.x1) * (py1 - line.y1) - (line.y2 - line.y1) * (px1 - line.x1)) /
                 ((line.y2 - line.y1) * (px2 - px1) - (line.x2 - line.x1) * (py2 - py1));
        
        var i = classes.Intersection();
            i.x = px1 + f1 * (px2 - px1),
            i.y = py1 + f1 * (py2 - py1);
        
        var hit = true,
            intersX = i.x,
            intersY = i.y,
            linex1 = line.x1,
            linex2 = line.x2,
            liney1 = line.y1,
            liney2 = line.y2;
                
        if (!dontRoundCoords) {
            intersX = ~~ (0.5 + i.x);
            intersY = ~~ (0.5 + i.y);
        }
        
        hit = (linex1 >= linex2) 
            ? intersX <= linex1 && intersX >= linex2
            : intersX >= linex1 && intersX <= linex2;
        if (hit) {
            hit = (liney1 >= liney2)
                ? intersY <= liney1 && intersY >= liney2
                : intersY >= liney1 && intersY <= liney2;
        }
        
        if (!correctQuadrant(i, angle) || !hit) {
            return false;
        }
        
        var deltaX = objects.player.x - i.x,
            deltaY = objects.player.y - i.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            i.distance = Math.abs(deltaX / Math.cos(angle.radians));
        }
        else {
            i.distance = Math.abs(deltaY / Math.sin(angle.radians));
        }
        
        if (!dontRoundCoords) {
        }
        
        return i;
    };

    var setTextureParams = function(intersection)
    {
        if (objects.settings.renderTextures()) {
            var wall = objects.Level.walls[intersection.levelObjectId],
                length = getHypotenuseLength(wall.x1 - wall.x2, wall.y1 - wall.y2),
                lengthToIntersection = getHypotenuseLength(wall.x1 - intersection.x, wall.y1 - intersection.y);

            intersection.resourceIndex = objects.Level.walls[intersection.levelObjectId].textureId;
            
            var textureWidth = objects.textures[intersection.resourceIndex].width,
                textureHeight = objects.textures[intersection.resourceIndex].height;
            
            if (wall.maxHeight != textureHeight) {
                lengthToIntersection *= textureHeight / wall.maxHeight;
            }
            
            intersection.textureX = parseInt(lengthToIntersection % objects.textures[intersection.resourceIndex].width);
        }
    };
    
    var setVSliceDrawParams = function(intersection)
    {   
        var scanlineOffsY = 0,                              
            distance =      intersection.distance * fishbowlFixValue, 
            rindex =        intersection.resourceIndex,     
            lindex =        intersection.levelObjectId,
            levelObject =   intersection.isSprite           
                                ? objects.Level.sprites[lindex] 
                                : objects.Level.walls[lindex],
            texture =       intersection.isSprite          
                                ? objects.sprites[rindex] 
                                : objects.textures[rindex],
            objHeight =     intersection.isSprite          
                                ? texture.height 
                                : getWallHeight(intersection),
            objMaxHeight =  intersection.isSprite 
                                ? objHeight 
                                : levelObject.maxHeight,
            objectZ =       intersection.isSprite         
                                ? levelObject.z
                                : getWallZ(intersection),
            height =        Math.floor(objHeight / distance * constants.distanceToViewport);    
        var eyeHeight = objects.player.height * 0.75,
            base = (eyeHeight + objects.player.z - objectZ) * 2,
            horizonOffset = (height - Math.floor(base / distance * constants.distanceToViewport)) / 2;
        
        var scanlineEndY = parseInt((constants.screenHeight / 2 - horizonOffset) + height / 2),
            scanlineStartY = scanlineEndY - height;
        
        intersection.drawParams = classes.VSliceDrawParams();
        intersection.drawParams.dy1 = scanlineStartY < 0 ? 0 : scanlineStartY;
        intersection.drawParams.dy2 = scanlineEndY > constants.screenHeight ? constants.screenHeight : scanlineEndY;
        intersection.drawParams.texture = texture;
        
        if (intersection.drawParams.dy2 < 0 || intersection.drawParams.dy1 > constants.screenHeight) {
            return false;
        }
        
        if ((!intersection.isSprite && objects.settings.renderTextures())
            || (intersection.isSprite && objects.settings.renderSprites()))        
        {
            var scale = height / texture.height, 
                srcStartY = 0,                   
                srcEndY = texture.height;       
            
            if (scanlineEndY > constants.screenHeight) {
                var remove = (scanlineEndY - constants.screenHeight) / scale;
                srcEndY -= remove;
            }
            
            if (scanlineStartY < 0) {
                var remove = Math.abs(scanlineStartY) / scale;
                srcStartY += remove;
            }
            
            
            intersection.drawParams.sy1 = srcStartY;
            intersection.drawParams.sy2 = srcEndY;
            
            if (intersection.drawParams.sy2 <= intersection.drawParams.sy1) {
                return false;
            }
        }
        
        return true;
    }
    
    var getWallHeight = function(intersection)
    {
        var wall = objects.Level.walls[intersection.levelObjectId];
        
        if (wall.h1 == wall.h2) {
            return wall.h1;
        }
        
        var length = getHypotenuseLength(wall.x1 - wall.x2, wall.y1 - wall.y2),
            slope = (wall.h2 - wall.h1) / length,
            lengthToIntersection = getHypotenuseLength(wall.x1 - intersection.x, wall.y1 - intersection.y),
            height = wall.h1 + (lengthToIntersection * slope);
        
        return height;
    }
    
    var getWallZ = function(intersection)
    {
        var wall = objects.Level.walls[intersection.levelObjectId];
        
        if (wall.z1 == wall.z2) {
            return wall.z1;
        }
        
        var length = getHypotenuseLength(wall.x1 - wall.x2, wall.y1 - wall.y2),
            slope = (wall.z2 - wall.z1) / length,
            lengthToIntersection = getHypotenuseLength(wall.x1 - intersection.x, wall.y1 - intersection.y),
            z = wall.z1 + (lengthToIntersection * slope);
        
        return z;
    }
    
    var findSprite = function(angle, spriteId)
    {
        var planeAngle = new classes.Angle(angle.degrees - 90),
            x = objects.Level.sprites[spriteId].x,
            y = objects.Level.sprites[spriteId].y,
            sprite = objects.sprites[objects.Level.sprites[spriteId].id],
            delta = getDeltaXY(planeAngle, (sprite.width - 1) / 2),
            plane = classes.Vector(x - delta.x, y + delta.y, 
                                   x + delta.x, y - delta.y);

        var intersection = getIntersection(plane, angle, true);
        
        if (intersection) {
            var lengthToIntersection = getHypotenuseLength(plane.x1 - intersection.x, plane.y1 - intersection.y);
            
            intersection.textureX = Math.floor(lengthToIntersection);
            intersection.resourceIndex = objects.Level.sprites[spriteId].id;
            intersection.levelObjectId = spriteId;
            intersection.isSprite = true;
            
            if (!setVSliceDrawParams(intersection)) {
                return false;
            }
        }
        
        return intersection;
    };
    
    var findWall = function(angle, wallId)
    {
        var intersection = getIntersection(objects.Level.walls[wallId], angle);
        
        if (intersection) {
            intersection.levelObjectId = wallId;
            setTextureParams(intersection);
            
            if (!setVSliceDrawParams(intersection)) {
                return false;
            }
        }
        
        return intersection;
    };
    
    
    var findObjects = function(angle, vscan)
    {
        var intersections = new Array();
        
        if (vscan) {
            setFishbowlFixValue(vscan);
        }
        
        for (var i = 0; i < objects.Level.walls.length; i++) {
            var intersection = findWall(angle, i);
            if (intersection) {
                intersections[intersections.length] = intersection;
            }
        }
        
        for (var i = 0; i < objects.Level.sprites.length; i++) {
            var intersection = findSprite(angle, i);
            if (intersection) {
                intersections[intersections.length] = intersection;
            }
        }
        
        intersections.sort(function(i1, i2) {
            return i2.distance - i1.distance;
        });
        
        return intersections;
    };
    
    var getDeltaXY = function(angle, distance) 
    {
        return classes.Point(
            Math.cos(angle.radians) * distance,
            Math.sin(angle.radians) * distance
        );
    }
    
    return {
        findObjects : findObjects,
        getDeltaXY: getDeltaXY,
    };
};
