<template>
  <div v-if="visible" id="game">
    <h1>Game</h1>
    <div class="game-area">
      <canvas id="myCanvas" width="600" height="400" style="border:1px solid #d3d3d3;">
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <div id="message_txt" style="display:block;">Press &lt;space&gt; to jump, press &lt;Z&gt; to shoot.</div>
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
import Obj from '@/components/game_components/obj'
import Coin from '@/components/game_components/coin'
import Bullet from '@/components/game_components/bullet'
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
      finalCoinsEarned: 0,
      finalScore: 0,
    }
  },
  methods: {
    imagePath(path) {
      // for displaying images
      if (!path) {
        path = "skin_default.svg";
      }
      return require('../assets/' + path);
    },
    gameEndUpdate(score, coin) {
      // update scores and coins of user
      this.user.coins += coin;
      this.user.accumulatedScore += score;
      if (score > this.user.highestScore) {
        this.user.highestScore = score;
      }
      this.updateCurrentUser();
    },
    async updateCurrentUser(){
      //Update user database
      const url = process.env.VUE_APP_BACKEND + '/usersdata/update/' + this.user._id
      const newData = {
        coins: this.user.coins,
        highestScore: this.user.highestScore,
        accumulatedScore: this.user.accumulatedScore,

      }
      await axios.post(url, newData)
    }
  },
  mounted() {	
    var gameObject = this;

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
      // create hero object
      hero = new Obj(imageHero, 20, floor, 1);

      // create new monster objects every 2.5s
      var obj_interval = setInterval(function() {
        enemyArray.push(new Obj(imageMon, canvas.width, floor/2 , 1));
      }, 2500); 
      // create new coin objects every 3s
      setInterval(function() {
        coinArray.push(new Coin(imageCoin, canvas.width, floor*Math.random() , 1));
      }, 3000); 

      // main game
      var game = setInterval(function () {
        // clear canvas every interval
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        if(!gameOver) {
          // if game is not over

          // draw hero
          hero.draw_me(context, floor);
          // draw enemy
          for (var i = enemyArray.length - 1; i >= 0; i--) {
              enemyArray[i].draw_enemy(context, floor, score);
          }
          // draw coins
          for (i = coinArray.length - 1; i >= 0; i--) {
              coinArray[i].draw(context);
          }			
          // draw bullets
          for (i = bulletArray.length - 1; i >= 0; i--) {
              bulletArray[i].draw(context);
          }

          // test if hero collides with enemy
          for (i = enemyArray.length - 1; i >= 0; i--) {
            var enemy1 = enemyArray[i];
            if (enemy1 != null && hero != null && hero.hitTestObject(enemy1))
            {
                clearInterval(obj_interval); // clear the enemy interval and no more enemy 
                enemyArray.splice(i, 1); // clear the enemy				   
                
                message_txt.innerHTML = "Game Over";
                gameOver = true;				   
            }
          }
          // test if collide with coin
          for (i = coinArray.length - 1; i >= 0; i--) {
            var co = coinArray[i];
            if (co != null && hero != null && hero.hitTestObject(co))
            {
              coingett += 1;
              coinArray.splice(i, 1);
              coins_txt.innerHTML = "Coins：" + coingett + "";
              
            }
          }
      
          // judge whether a bullet hits an enemy
          for (var j = bulletArray.length - 1; j >= 0; j--) {
            var bullet1 = bulletArray[j];			
            for (i = enemyArray.length - 1; i >= 0; i--) {
              enemy1 = enemyArray[i];
              // if a bullet hits an enemy
              if (enemy1 != null && bullet1 != null && bullet1.hitTestObject(enemy1))
              {
                enemyArray.splice(i, 1); // delete enemy
                bulletArray.splice(j, 1); // delete bullet

                message_txt.innerHTML = "Hitted!!! + 20";
                score += 20;
                score_txt.innerHTML = "Score：" + score + "";			   
              }
            }
          }
        } else {
          // if game is over

          // do not draw objects on canvas
          clearInterval(game);

          // record the scores and coins earned from this game
          gameObject.finalCoinsEarned = coingett;
          gameObject.finalScore = score;
          
          // if the player is not a guest, update user database
          if (!gameObject.guest)
            gameObject.gameEndUpdate(gameObject.finalScore, gameObject.finalCoinsEarned);
        }
      }, 1000 / 60);
    };

    function onkeydown(e) {
      // press z to shoot
      if (e.key == "z" && curbullet > 0) {
        bulletArray.push(new Bullet(imageBul, hero.x + 50, hero.y));
        curbullet--;
        bullet_txt.innerHTML = "Bullet：" + curbullet + "";
      }
      // press space to jump
      if (e.keyCode == 32 ) {
        hero.move(0, -75);
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
