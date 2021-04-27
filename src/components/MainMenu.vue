<template>
  <div v-if="visible" id = "MainMenu">
    <img src="../assets/logo.png" alt="Game logo">
    <h1>Title</h1>
    <p><button class="MenuButton" v-on:click="goto('Game')">Play</button></p>
    <p><button v-if="guest === false" class="MenuButton" v-on:click="goto('Shop')">Shop</button></p>
    <p><button class="MenuButton" v-on:click="goto('LeaderBoard')">LeaderBoard</button></p>
    <p><button v-if="guest === false" class="MenuButton" v-on:click="goto('Account')">Account</button></p>
    <p><button v-if="guest === false" class="MenuButton" v-on:click="goto('Friends')">Friends</button></p>
    <p><button class="MenuButton" v-on:click="goto('Login')">Logout</button></p>
  </div>
</template>

<script>

export default {
  name: "MainMenu",
  props: {
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
  data () {
    return {
      // guest: this.user.userID.localeCompare('LOGINASGUEST') === 0
    }
  },
  methods: {
    goto(section){
      console.log("In " + this.$options.name + ": goto " + section)
      this.exit(section)
    },
    exit(destination){
      this.$emit("exit", this.$options.name, destination)
    }
  }
}
</script>

<style scoped>
#MainMenu {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*!*color: #2c3e50;*!*/
  /*margin-top: 60px;*/
  /*background-image: url("../assets/background.png");*/
}
.MenuButton {
  border: none;
  color: black;
  /*padding: 15px 32px;*/
  text-align: center;
  text-decoration: none;
  /*display: inline-block;*/
  font-size: 16px;
  margin: 4px 2px;
  cursor: crosshair;
  background-color: transparent;
}
.MenuButton:hover {
  text-decoration:underline;
}

</style>