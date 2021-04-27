<template>
  <div v-if="visible" id="game">
    <h1>Game</h1>
    <div class="game-area">
      <canvas id="myCanvas" width="600" height="400" style="border:1px solid #d3d3d3;">
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <div id="message_txt" style="display:block;">OUTBOUND RANGERS</div>
      <table style="width:100%">
        <tr>
          <td><div id="score_txt" style="display:block;">Scores：0</div></td>
          <td><div id="coins_txt" style="display:block;">Coins：0</div></td>
          <td><div id="bullet_txt" style="display:block;">Bullets：10</div></td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
import Obj from '@/components/obj'
import Coin from '@/components/coin'
import Bullet from '@/components/bullet'
import axios from "axios"

export default {
  name: "Game",
  props:{
    visible: {
      type: Boolean,
      default: true
    },
    user:{
      default: {
        userID: "",
        password: "",
        lastActiveTime: "",
        highestScore: 0,
        accumulatedScore: 0,
        coins: 0,
        avatar: "avatar_default.png",
        skin: "skin_default.svg",
        friendsID: []
      }
    },
    guest:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      started: false,
      ended: false,
      finalCoinsEarned: 0,
      finalScore: 0,
      startBtnLabel: 'Start',
    }
  },
  methods: {
    exit() {
      console.log("Exited: " + this.$options.name)
      this.$emit("exit", this.$options.name, "MainMenu")
    },
    start(){
      this.started = true
      this.ended = false
      this.startBtnLabel = 'Game Started'
		},
    regenerate(){
      if (this.started == true && this.coinsEarned < 10) {
        this.coinsEarned += 1
      } else {
        this.ended = true;
      }
    },
    restart() {
      this.startBtnLabel = 'Start'
      this.started = false
      this.ended = false
      this.finalCoinsEarned = 0
    },
    imagePath(path) {
      if (!path) {
        path = "skin_default.svg";
      }
      return require('../assets/' + path);
    },
    gameEndUpdate(score, coin) {
      this.user.coins += coin * 10;
      this.user.accumulatedScore += score;
      if (score > this.user.highestScore) {
        this.user.highestScore = score;
      }
      this.updateCurrentUser();
    },
    async updateCurrentUser(){
      //Update user database
      const url = 'http://localhost:4040/userdata/update/' + this.user._id
      const response = await axios.post(url, this.user)
      console.log("User database updating... Response:")
      console.log(response)
    }
  },
  mounted() {	
    var gameObject = this;

    console.log("final score: " + gameObject.finalScore);
    console.log("final coins: " + gameObject.finalCoinsEarned);

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    document.addEventListener("keydown", onkeydown);
    document.addEventListener("keydown", onkeyup);

    // create image object
    var imageHero = new Image(75, 75);
    var imageCoin = new Image(50, 50);
    var imageMon = new Image(50, 50);
    var imageBul = new Image(50, 50);
    
    var enemyArray=[];
    var bulletArray = [];
    var coinArray = [];

    var floor = canvas.height - 75;
    var score = 0;
    var coingett = 0;
    var maxbullet = 10;
    var curbullet = 10;
    var gameOver = false;
    var hero;

    var bullet_txt = document.getElementById("bullet_txt");
    var message_txt = document.getElementById("message_txt");
    var coins_txt = document.getElementById("coins_txt");
    var score_txt = document.getElementById("score_txt");

    // bullet interval
    setInterval(function () {
      if(curbullet < maxbullet) {
        curbullet += 1;
        bullet_txt.innerHTML = "Bullet：" + curbullet + "";
      }
    },800);
    
    // load image src
    imageHero.src = this.imagePath(this.user.skin);
    imageHero.onload = function() {};
    imageCoin.src = this.imagePath("coin.svg");
    imageBul.src = this.imagePath("bullet.svg");
    imageBul.onload = function() {};
    imageMon.src = this.imagePath("monster.svg");
    imageMon.onload = function() {
        
        hero = new Obj(imageHero, 20, floor, 1);
        //create a monster in depending on the score
        var obj_interval = setInterval(function() {
          enemyArray.push(new Obj(imageMon, canvas.width, floor/2 , 1));
        }, 2500); 
        // coin interval
        setInterval(function() {
          coinArray.push(new Coin(imageCoin, canvas.width, floor*Math.random() , 1));
        }, 3000); 
        var game = setInterval(function () {
          context.clearRect(0, 0, canvas.width, canvas.height);
          //draw hero
          if(!gameOver) {
              hero.draw_me(context, floor);
            
            //draw enemy
            for (var i = enemyArray.length - 1; i >= 0; i--) {
                enemyArray[i].draw_enemy(context, floor, score);
            }
            //draw coins
            for (i = coinArray.length - 1; i >= 0; i--) {
                coinArray[i].draw(context);
            }			
            //draw bullets
            for (i = bulletArray.length - 1; i >= 0; i--) {
                bulletArray[i].draw(context);
            }
            //collison test
            for (i = enemyArray.length - 1; i >= 0; i--) {
              var enemy1=enemyArray[i];
              if (enemy1!=null && hero!=null && hero.hitTestObject(enemy1))
              {
                  clearInterval(obj_interval);//clean the interval and no more enemy 
                  enemyArray.splice(i, 1); //clear the enemy				   
                  
                  message_txt.innerHTML="Game Over";
                  gameOver = true;				   
              }
            }
            for (i = coinArray.length - 1; i >= 0; i--) {
              var co=coinArray[i];
              if (co!=null && hero!=null && hero.hitTestObject(co))
              {
                coingett+=1;
                coinArray.splice(i, 1);
                coins_txt.innerHTML="Coins：" + coingett + "";
                
              }
            }
        
            //judge bullet hit enemy
            for (var j = bulletArray.length - 1; j >= 0; j--) {
              var bullet1 = bulletArray[j];			
              for (i = enemyArray.length - 1; i >= 0; i--) {
                enemy1 = enemyArray[i];
                if (enemy1 != null && bullet1 != null && bullet1.hitTestObject(enemy1))//hited!
                {
                  enemyArray.splice(i, 1); //del enemy
                  bulletArray.splice(j, 1); //del bullet

                  message_txt.innerHTML = "Hitted!!! + 20";
                  score += 20;
                  score_txt.innerHTML = "Score：" + score + "";			   
                }
              }
            }
          } else {
            // if game is over
            clearInterval(game);
            gameObject.ended = true;
            gameObject.finalCoinsEarned = coingett;
            gameObject.finalScore = score;
            console.log("final score: " + gameObject.finalScore);
            console.log("final coins: " + gameObject.finalCoinsEarned);
            
            if (!gameObject.guest)
              gameObject.gameEndUpdate(gameObject.finalScore, gameObject.finalCoinsEarned);
          }
        }, 1000 / 60);
    };

    function onkeydown(e) {
      // press z to shoot
      if (e.key == "z" && curbullet > 0) {
        bulletArray.push(new Bullet(imageBul, hero.x+50, hero.y));
        curbullet--;
        bullet_txt.innerHTML = "Bullet：" + curbullet + "";
      }
      if (e.keyCode==32 ) {// press space to jump
        hero.move(0,-75);
      }
    }
  }
}
</script>

<style scoped>

div.game-area {
  width: 600px;
  display: block;
  margin: auto;
}

canvas { 
  background:url("../assets/game_bg.png");
  background-size: 100% 100%;
}

</style>
