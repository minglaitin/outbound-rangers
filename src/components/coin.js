//class obstuct
//class coin or reward
class Coin {
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
    }
    getCaught(bool) {
        this.isCaught = bool;
        if (bool == false) { // if not caught , move it
            this.originX = 0;
            this.originY = this.y;
        }
    }
    Y() {
        return this.y;
    }
    //draw coin
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.image, 0, 0, 50, 50);
        ctx.restore();
        this.x = this.x - 2; //keep moving left

    }
}

export default Coin;