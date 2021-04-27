<template>
  <div v-if="visible" id="manageFriend">
    <h1 style="">Friends</h1>
    <label>Current Friend List:<br></label>
    <div v-if="!guest">
      <label v-for="(ID, index) in this.user.friendsID" v-bind:key="index">
        {{index + 1}} {{ID}}<br>
      </label><br>
    <label v-if="this.user.friendsID.length <= 0">There is currently no one in your friend list.<br><br></label>
    </div>
    <ScrollableTable ref="table" v-bind:visible = true v-bind:maxEntry = 500 v-bind:arrayData = searchData></ScrollableTable>
    <label><br>{{ message }}</label><br><br>
    <input v-model = "inputString" v-on:input="updateArray(inputString)" id="inputID" placeholder="Enter User ID here"><br><br>
    <button type="button" id="buttonAdd" v-on:click="add(inputString)">Add Friend</button>
    <button type="button" id="buttonRemove" v-on:click="remove(inputString)">Remove Friend</button>
<!--    <button type="button" v-on:click="exit()">Go Back</button>-->
  </div>
</template>

<script>
import ScrollableTable from './reusable/ScrollableTable.vue'
import axios from "axios";
// import axios from "axios";

export default {
  name: "Friends",
  components:{
    ScrollableTable
  },
  props:{
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
    return{
      inputString: "",
      message: "",
      searchData: []
    }
  },
  // async mounted(){
  //   const url = 'http://localhost:4040/userdata/'
  //   const response = await axios.get(url)
  //   this.userData = response.data
  //
  //   const currentID = sessionStorage.getItem('currentUserID')
  //   let found = this.userData.find(element => element.userID.localeCompare(currentID) === 0)
  //   if (found !== undefined) this.user = found
  // },
  methods: {
    // exit() {
    //   console.log("Exited: " + this.$options.name)
    //   this.$emit("exit", this.$options.name, "MainMenu")
    // },
    add(input){
      // Check if input is the same as ID of current user
      // Note that empty string would be be true
      if(this.user.userID.localeCompare(input) === 0){
        this.message = "User ID: \"" + input + "\" is the user's current ID."
        return
      }
      // Check if input can already be found in user.friendID
      let duplicate = this.user.friendsID.filter(
          function (element) {
            return element.localeCompare(input) === 0
          }
      )
      if (duplicate.length > 0){
        this.message = "User ID: \"" + input + "\" is found in current user's friend list."
        return
      }
      // Check if input exists in userData or not
      let validEntry = this.userData.filter(
          function (element) {
            return element.userID.localeCompare(input) === 0
          }
      )
      if (validEntry.length > 0) {
        this.message = "User ID: \"" + input + "\" is added into the friend list."
        this.user.friendsID.push(input)
        this.inputString = ""
        // this.display()
        this.updateArray(this.inputString)
        this.updateCurrentUser()
      }
      else
        this.message = "User ID: \"" + input + "\" is not found!"
    },
    remove(input){
      // Check if input is the same as ID of current user
      if(this.user.userID.localeCompare(input) === 0){
        this.message = "You cannot unfriend yourself."
        return
      }
      // Check if user.friendsID is empty or not
      if (this.user.friendsID.length <= 0) {
        this.message = "This user currently has no friend in friend list."
        return
      }
      // Check if input exists in user.friendsID or not
      let validEntry = this.user.friendsID.filter(
          function (element){
            return element.localeCompare(input) === 0
          }
      )
      if (validEntry.length > 0) {
        this.message = "User ID: \"" + input + "\" is removed from friend list."
        this.user.friendsID.splice(this.user.friendsID.indexOf(validEntry[0]), 1)
        this.inputString = ""
        // this.display()
        this.updateArray(this.inputString)
        this.updateCurrentUser()
      }
      else
        this.message = "User ID: \"" + input + "\" is not found in the friend list!"
    },
    display(){
      console.log("Current user: " + this.user.userID)
      console.log("Current user: " + this.user.password)
      console.log("Current user: " + this.user.coins)
      console.log(this.user.friendsID.length)
      this.user.friendsID.forEach(function (element){console.log(element)})
    },
    updateArray(input){
      //Get array of elements with input as sub string, if empty string then empty array???
      let currentUserID = this.user.userID
      this.searchData = this.userData.filter(
          function (element) {
            return element.userID.localeCompare(currentUserID) !== 0 && element.userID.indexOf(input) >= 0
          }
      )
      //Empty table if input is empty
      if (input.localeCompare("") === 0) this.searchData = []
      //Resort the elements of child array
      let tableScroll = this.$refs.table
      tableScroll.sortArray(this.searchData)
    },
    async updateCurrentUser(){
      //Update user database
      const url = 'http://localhost:4040/userdata/update/' + this.user._id
      const response = await axios.post(url, this.user)
      console.log("User database updating... Response:")
      console.log(response)
    }
  }
}
</script>

<style scoped>

</style>