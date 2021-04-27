<template>
  <div v-if="visible" id="LeaderBoard">
    <h1>Leader Board</h1>
    <label v-if="guest">Note that scores of Guest account are not recorded or displayed.<br><br></label>
    <label>Displaying:  </label>
    <button type="button" v-on:click="setMax()">Top {{ maxEntry }}</button><br><br>
    <table class="scrollable" style="margin-left: auto; margin-right: auto;">
      <tbody>
        <tr class="header">
          <th><button class="boardElement">Rank</button></th>
          <th><button class="boardElement">Avatar</button></th>
          <th><button class="boardElement">UserID</button></th>
          <th><button id="btn_hs" class="boardElement" v-on:click="sortList(userData, 'H')">HighestScore</button></th>
          <th><button id="btn_as" class="boardElement" v-on:click="sortList(userData, 'A')">AccumulatedScore</button></th>
        </tr>
        <tr v-for ="(userObject, index) in userData" v-bind:key="index">
          <td v-if="index < maxEntry || !guest && user.userID.localeCompare(userObject.userID) === 0">{{index+1}}</td>
          <td v-if="index < maxEntry || !guest && user.userID.localeCompare(userObject.userID) === 0"><img v-bind:src="imagePath(userObject.avatar)" v-bind:title="userObject.userID" alt="Blank Image" width="32px"></td>
          <td v-if="index < maxEntry || !guest && user.userID.localeCompare(userObject.userID) === 0">{{userObject.userID}}</td>
          <td v-if="index < maxEntry || !guest && user.userID.localeCompare(userObject.userID) === 0">{{userObject.highestScore}}</td>
          <td v-if="index < maxEntry || !guest && user.userID.localeCompare(userObject.userID) === 0">{{userObject.accumulatedScore}}</td>
        </tr>
      </tbody>
    </table>
<!--    <br><button type="button" v-on:click="exit()">Go Back</button>-->
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "LeaderBoard",
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    user:{
      default: {}
    },
    userData: {
      type: Array
    },
    guest: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      maxEntry: 50,
    }
  },
  mounted() {
    this.sortList(this.userData, 'H')
  },
  // async mounted(){
  //   const url = 'http://localhost:4040/userdata/'
  //   const response = await axios.get(url)
  //   this.userData = response.data
  //
  //   const currentID = sessionStorage.getItem('currentUserID')
  //   let found = this.userData.find(
  //       function (element) {
  //         return element.userID.localeCompare(currentID) === 0
  //       }
  //   )
  //   this.guest = found === undefined
  //   if (this.guest === false) this.user = found
  // },
  methods: {
    imagePath(path) {
      return require('../assets/' + path);
    },
    setMax(){
      if (this.maxEntry === 5) this.maxEntry = 50;
      else if (this.maxEntry === 50) this.maxEntry = 100;
      else if (this.maxEntry === 100) this.maxEntry = 500;
      else if (this.maxEntry === 500) this.maxEntry = 5;
    },
    sortList(list, target){
      let buttonH = document.getElementById("btn_hs");
      let buttonA = document.getElementById("btn_as");
      if (target === "H") {
        buttonH.style.textDecoration = "underline";
        buttonA.style.textDecoration = "none";
        list.sort(
            function (a, b) {
              return parseFloat(b.highestScore) - parseFloat(a.highestScore);
            }
        )
      } else if (target === "A"){
        buttonH.style.textDecoration = "none";
        buttonA.style.textDecoration = "underline";
        list.sort(
            function (a, b) {
              return parseFloat(b.accumulatedScore) - parseFloat(a.accumulatedScore);
            }
        )
      }
    }
  }
}
</script>

<style scoped>
#LeaderBoard {
  /*margin-top: 60px;*/
}
button.boardElement {
  border: none;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  /*display: inline-block;*/
  font-size: 16px;
  /*margin: -1px -1px;*/
  background-color: transparent;
}
table.scrollable{
  border: 1px solid black;
  /*border-spacing: 0px;*/
  border-collapse: collapse;
  /*margin: 32px 256px;*/
  padding: 32px 32px;
  /*alignment: center;*/
  text-align: center;
  background-color: ghostwhite;
}
table.scrollable tbody{
  display: block;
  /*height: 128px;*/
  max-height: 448px;
  overflow-y: scroll;
  overflow-x: hidden;

}
table.scrollable tbody tr.header{
  background-color: lightgray;
  position: sticky;
  top: 0px;
}
</style>