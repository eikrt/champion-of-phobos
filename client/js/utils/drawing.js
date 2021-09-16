import { classes } from "./classes.js"
import { objects } from "../world/objects.js"
import { constants } from "./constants.js"

export let drawing =
{
    clear: function() 
    {
        var context = objects.context;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    
    colorRgb: function(r, g, b) 
    {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    },
    
    colorRgba: function(r, g, b, a) 
    {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    },
    
    circle: function(x, y, radius, color) 
    {
        var context = objects.context;
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, radius, 0, Math.PI*2, true);
        context.fill();
        context.closePath();
    },
    
    square: function(x, y, width, height, color)
    {
        var context = objects.context;
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.closePath();
    },
    
    filledPath: function(vectorArray, color, shrinkFactor)
    {
        var context = objects.context;
        context.beginPath();
        
        for (var i in vectorArray) {
            var vector = vectorArray[i],
                x1 = shrinkFactor ? vector.x1 / shrinkFactor : vector.x1,
                x2 = shrinkFactor ? vector.x2 / shrinkFactor : vector.x2,
                y1 = shrinkFactor ? vector.y1 / shrinkFactor : vector.y1,
                y2 = shrinkFactor ? vector.y2 / shrinkFactor : vector.y2;
            
            if (i == 0) {
                context.moveTo(x1, y1);
            }
            context.lineTo(x2, y2);
        }
        
        context.fillStyle = color;
        context.fill();
        
        context.closePath();
    },
    
    line: function(x, y, x2, y2, color)
    {
        var context = objects.context;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x2, y2);
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
    },
    
    lineSquare: function(x, y, x2, y2, color)
    {
        this.square(x, y, x2, y2 - y, color);
    },
    
    text: function(text, x, y, color, font)
    {
        var context = objects.context;
        context.fillStyle = color;
        context.font = font;
        context.textBaseline = "top";
        context.fillText(text, x, y);
    }
};
