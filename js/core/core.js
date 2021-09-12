
import { objects } from "../world/objects.js";

import { constants } from "../utils/constants.js";

import { levels } from "../world/levels.js";
import { movement } from "../utils/movement.js";

import { renderEngine } from "../utils/renderengine.js"
var Raycaster = function() 
{
    
    var engine = null;
    
    var start = function(canvasId) 
    {
        var res = objects.settings.selectedResolution();
        constants.screenWidth =   res.w;
        constants.screenHeight =  res.h;
        
        var canvas = document.getElementById(canvasId);
        canvas.width = constants.screenWidth;
        canvas.height = constants.screenHeight;
        objects.context = canvas.getContext("2d");
        objects.Level = levels;
        objects.Level.init();
        
        objects.loadResources();
        
        let engine = new renderEngine;
        movement().init();
        
        objects.gameloopInterval = setInterval(function() {
            movement().update();
            renderEngine().update();
        }, constants.glIntervalTimeout);
    }
    return {
        engine: engine,
        start: start
    };
}();
document.addEventListener("DOMContentLoaded", function() {
    Raycaster.start("raycaster");
}, true);

