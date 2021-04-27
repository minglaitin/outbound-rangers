<template>
  <table v-if="visible" class="scrollable" style="margin-left: auto; margin-right: auto;">
    <tbody>
    <tr class="header">
      <th><button id="buttonNumber" class="boardElement">Number</button></th>
      <th><button id="buttonAvatar" class="boardElement" v-on:click="sortArray(arrayData, $event)">Avatar</button></th>
      <th><button id="buttonID" class="boardElement" v-on:click="sortArray(arrayData, $event)">UserID</button></th>
      <th><button id="buttonHighScore" class="boardElement" v-on:click="sortArray(arrayData, $event)">HighestScore</button></th>
      <th><button id="buttonAccumScore" class="boardElement" v-on:click="sortArray(arrayData, $event)">AccumulatedScore</button></th>
      <th><button id="buttonActiveTime" class="boardElement" v-on:click="sortArray(arrayData, $event)">LastActiveTime</button></th>
    </tr>
    <tr v-for ="(Object, index) in arrayData" v-bind:key="index">
      <td v-if="index < maxEntry">{{index+1}}</td>
      <td v-if="index < maxEntry"><img v-bind:src="imagePath(Object.avatar)" v-bind:title="Object.userID" alt="Blank Image" width="32px"></td>
      <td v-if="index < maxEntry">{{Object.userID}}</td>
      <td v-if="index < maxEntry">{{Object.highestScore}}</td>
      <td v-if="index < maxEntry">{{Object.accumulatedScore}}</td>
      <td v-if="index < maxEntry">{{Object.lastActiveTime}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ScrollableTable",
  props:{
    visible:{
      type: Boolean,
      default: true
    },
    maxEntry: {
      type: Number,
      default: 50
    },
    arrayData:{
      type: Array
    }
  },
  data(){
    return{
      sortTarget: "buttonID",
      DESCENDING: 1
    }
  },
  methods:{
    imagePath(path) {
      return require('../../assets/' + path);
    },
    highlight(targetName){
      let buttonA = document.getElementById("buttonAvatar");
      let buttonID = document.getElementById("buttonID");
      let buttonHS = document.getElementById("buttonHighScore");
      let buttonAS = document.getElementById("buttonAccumScore");
      let buttonAT = document.getElementById("buttonActiveTime");
      let targetObj = document.getElementById(targetName);

      buttonA.style.textDecoration = "none";
      buttonID.style.textDecoration = "none";
      buttonHS.style.textDecoration = "none";
      buttonAS.style.textDecoration = "none";
      buttonAT.style.textDecoration = "none";
      targetObj.style.textDecoration = "underline";
    },
    sortArray(array = [], event = null){
      let objectID;
      if (event === null) {
        //If the function is not called by clicking the button
        objectID = this.sortTarget;
      }else {
        objectID = event.currentTarget.id;
        if (objectID.localeCompare(this.sortTarget) === 0) this.DESCENDING *= -1;
        else this.DESCENDING = 1;
      }

      let DESCENDING = this.DESCENDING; //Alternating the sorting order
      this.sortTarget = objectID;
      this.highlight(objectID);

      //Sort according to caller / selected col
      switch (objectID) {
        case "buttonAvatar":
          array.sort(
              function (a, b) {
                let stringA = a.avatar.toUpperCase();
                let stringB = b.avatar.toUpperCase();
                if (stringA >= stringB) return 1 * DESCENDING;
                else if (stringA < stringB) return -1 * DESCENDING;
              }
          )
          break;
        case "buttonID":
          array.sort(
              function (a, b) {
                let stringA = a.userID.toUpperCase();
                let stringB = b.userID.toUpperCase();
                if (stringA >= stringB) return 1 * DESCENDING;
                else if (stringA < stringB) return -1 * DESCENDING;
              }
          )
          break;
        case "buttonHighScore":
          array.sort(
              function (a, b) {
                return (parseFloat(b.highestScore) - parseFloat(a.highestScore)) * DESCENDING;
              }
          )
          break;
        case "buttonAccumScore":
          array.sort(
              function (a, b) {
                return (parseFloat(b.accumulatedScore) - parseFloat(a.accumulatedScore)) * DESCENDING;
              }
          )
          break;
        case "buttonActiveTime":
          array.sort(
              function (a, b) {
                let stringA = a.lastActiveTime.toUpperCase();
                let stringB = b.lastActiveTime.toUpperCase();
                if (stringA > stringB) return -1 * DESCENDING;
                else if (stringA < stringB) return 1 * DESCENDING;
                else return 0;
              }
          )
          break;
      }
    }
  }
}
</script>

<style scoped>
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