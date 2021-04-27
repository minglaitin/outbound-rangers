<template>
  <nav>
    <img src="../../assets/projLogo.jpeg" alt="Game logo">
    <ul>
      <li v-if="Object.keys(this.user).length === 0"><router-link to='/'>Login</router-link></li>
      <li><router-link to='/game'>Game</router-link></li>
      <li v-if="Object.keys(this.user).length !== 0"><router-link to='/account'>Account</router-link></li>
      <li><router-link to='/leaderboard'>Leader Board</router-link></li>
      <li v-if="Object.keys(this.user).length !== 0"><router-link to='/friends'>Friends</router-link></li>
      <li v-if="Object.keys(this.user).length !== 0"><router-link to='/shop'>Shop</router-link></li>
      <li v-if="Object.keys(this.user).length !== 0"><router-link to='/' v-on:click.native="logout">Logout</router-link></li>
    </ul>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  name: "navigationBar",
  props: {
    user: {
      default: {}
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('currentUserID')
      this.updateTime()
      this.$emit("logout")
    },
    async updateTime(){
      this.user.lastActiveTime = new Date().toISOString()
      console.log(this.user.lastActiveTime)
      //Update user database
      const url = 'http://localhost:4040/userdata/update/' + this.user._id
      const response = await axios.post(url, this.user);
      console.log(response);
    }
  }
}
</script>

<style scoped>
nav {
  margin: 0;
  padding: 0;
  border-right: 2px solid #eee;
  height: 100%;
  width: 200px;
  position: fixed;
  background-color: #fff;
}

nav img {
  width: 150px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li a {
  display: block;
  color: #000;
  text-decoration: none;
  padding: 16px 32px;
  font-size: large;
  font-family: Verdana, Arial, sans-serif;
}

li a:hover {
  background-color: #bbb;
  color: white;
}
</style>