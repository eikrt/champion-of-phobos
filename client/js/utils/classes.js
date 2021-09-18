export let classes  = 
	{
		Point: function(x, y) {
			return {
				x: x,
				y: y
			};
		},

		Vector: function(x1, y1, x2, y2) {
			return {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			};
		},

		Sprite: function(x, y, z, velocity, angle, id, yoff, ownerId, type) {
			return {
				x: x,      
				y: y,
				z: z,
				velocity: velocity,
				angle: angle,
				yoff: yoff,
				id: id,
				ownerId: ownerId,
				type: type
			};
		},

		Wall: function(x1, y1, x2, y2, z1, z2, h1, h2, textureId) {
			return {
				x1: x1,  
				y1: y1,
				x2: x2,  
				y2: y2,
				z1: z1,  
				z2: z2,  
				h1: h1, 
				h2: h2,
				textureId: textureId,
				maxHeight: (h1 > h2 ? h1: h2)
			};
		},

		Elevation: function(height, area) {
			return {
				area: area,     

				height: height  
			};
		},

		VSliceDrawParams: function() {
			return {
				dy1: 0,         
				dy2: 0,         
				sy1: 0,       
				sy2: 0,         
				texture: null   
			};
		},

		Intersection: function() {
			return {
				x: 0,             
				y: 0,               
				distance: 0,      
				resourceId: 0,     
				levelObjectId: 0,   
				textureX: 0,       
				isSprite: false,   
				drawParams: null,
				type: '',
				ownerId: 0,
			};
		},

		KeyButton: function(code) {
			return {
				code: code,
				pressed: false
			};
		},

		Angle: function(degrees) {

			var self = this;
			this.degrees = degrees;
			this.radians = 0;

			this.setValue = function(v) {
				self.degrees = Number(v);

				if (self.degrees >= 360) {
					self.degrees -= 360;
				}
				if (self.degrees < 0) {
					self.degrees += 360;
				}

				self.radians = self.toRadians();
			};

			this.toRadians = function() {
				if (self.degrees == 90) {
					return Math.PI / 2;
				}
				else if (self.degrees == 270) {
					return 3 * Math.PI / 2;
				}
				return self.degrees * (Math.PI / 180);
			};

			this.turn = function(degrees) {
				self.setValue(self.degrees + degrees);
			};

			this.getQuadrant = function() {
				var rounded = ~~ (0.5 + self.degrees);

				if ((rounded >= 0 || rounded == 360) && rounded < 90) {
					return 1;
				}
				if (rounded >= 90 && rounded < 180) {
					return 2;
				}
				if (rounded >= 180 && rounded < 270) {
					return 3;
				}
				if (rounded >= 270 && rounded < 360) {
					return 4;
				}
			};

			this.setValue(degrees);
		}
	};
