// test if two objects collide with each other
function isColliding( ax, ay, aw, ah,  bx,  by,  bw,  bh){ 
	if(ay > by + bh || by > ay + ah || ax > bx + bw || bx > ax + aw) 
		return false; 
	else
		return true; 
} 

// class Bullet
class Bullet {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.width = image.width;
        this.height = image.height;
        this.isCaught = false;
        this.frm = 0;
        this.dis = 0;
    }
    testPoint(x, y) {
        var betweenX = (x >= this.x) && (x <= this.x + this.width);
        var betweenY = (y >= this.y) && (y <= this.y + this.height);
        return betweenX && betweenY;
    }
    // move the position of this object
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    // return the y-coordinate of this object
    Y() {
        return this.y;
    }
    // draw this object on canvas
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.image, 0, 0, 50, 50);
        ctx.restore();
        this.x = this.x + 10;

    }
    // test if this object collides with another obj
    hitTestObject(obj) {
        if (isColliding(this.x, this.y, this.width, this.height,
            obj.x, obj.y, obj.width, obj.height)) // collison occurs 
            return true;

        else
            return false;

    }
}

export default Bullet;