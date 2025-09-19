// test if two objects collide with each other
function isColliding( ax, ay, aw, ah,  bx,  by,  bw,  bh){ 
	if(ay > by + bh || by > ay + ah || ax > bx + bw || bx > ax + aw) 
		return false; 
	else
		return true; 
} 

// class Obj
class Obj {
	constructor(image, x, y, n) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.originX = x;
		this.originY = y;
		this.width = image.width / n;
		this.height = image.height;
		this.isCaught = false;
		this.frm = 0;
		this.dis = 0;
		this.n = n;
		this.speed = Math.floor((Math.random() * 100) + 1);
	}
	getCaught(bool) {
		this.isCaught = bool;
		if (bool == false) { // if not caught , move it
			this.originX = 0;
			this.originY = this.y;
		}
	}
	testPoint(x, y) {
		var betweenX = (x >= this.x) && (x <= this.x + this.width);
		var betweenY = (y >= this.y) && (y <= this.y + this.height);
		return betweenX && betweenY;
	}
	// move the position of this object
	move(dx, dy) {
		this.x += dx;
		if (this.y + dy > 0) {
			this.y += dy;
		}
	}
	// return y-coordinate of this object
	Y() {
		return this.y;
	}
	// draw enemy
	draw_enemy(ctx, floor, score) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.image, 0, 0, 50, 50);
		ctx.restore();
		this.x = this.x - 2 - score/50; // keep moving left
		var tryy = this.y + this.speed * 10;
		while (tryy < 0 || tryy > floor) {
			this.speed = Math.random() - 0.5;
			tryy = this.y + this.speed * 10;
		}
		this.y = tryy; // keep move randomly 

	}
	// draw the player character
	draw_me(ctx, floor) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.image, 0, 0, 75, 75);
		ctx.restore();
		this.dis++;
		if (this.y < floor) {
			// fall when on the sky
			this.y = this.y + 2.5;
		}

	}
	// test if this object collides with another obj
	hitTestObject(obj) {
		if (isColliding(this.x, this.y, this.width, this.height,
			obj.x, obj.y, obj.width, obj.height)) {
			return true;
		}
		else
			return false;
	}
}

export default Obj;