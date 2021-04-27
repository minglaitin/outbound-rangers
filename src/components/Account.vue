<template>
  <div v-if="visible" id="account" class="outer-container">
<!--    <NavBar></NavBar>-->
    <div class="main-content">
      <h1>Account</h1>
      <div>
          <img :src="imagePath(selectedAvatar)" height="256px">
          <img :src="imagePath(selectedSkin)" height="128px">
          <p> UserID: {{ user.userID }} </p>
          <p> Last Active Time: {{ user.lastActiveTime }} </p>
          <p> Highest Score: {{ user.highestScore }} </p>
          <p> Accumulated Score: {{ user.accumulatedScore }} </p>
          <p> Coins: {{ user.coins }} </p>
      </div>

      <label for="avatar">Owned Avatars:</label>
      <select id="avatar" v-model="selectedAvatar">
        <option value="avatar_default.png">Null</option>
        <option v-for="(avatar, index) in ownedAvatar" v-bind:key="index" v-bind:value="avatar.itemImage">{{ avatar.itemName }}</option>
      </select>

      <label for="skin">  Owned Skins:</label>
      <select id="skin" v-model="selectedSkin">
        <option value="skin_default.svg">Null</option>
        <option v-for="(skin, index) in ownedSkin" v-bind:key="index" v-bind:value="skin.itemImage">{{ skin.itemName }}</option>
      </select>

      <br><br><button v-on:click="equip">Equip</button>

    </div>
  </div>
</template>

<script>
// import NavBar from '../components/reusable/navigationBar.vue'
import axios from "axios";
// import '../../assets/style.css'
export default {
  // components: { NavBar },
  name: "Account",
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
    userData : {
      type: Array
    },
  },
  data(){
    return{
      ownedAvatar: [],
      ownedSkin: [],
      selectedAvatar: this.user.avatar,
      selectedSkin: this.user.skin
    }
  },
  async mounted() {
    //Load item data from database
    const urlItem = 'http://localhost:4040/itemdata/'
    const responseItem = await axios.get(urlItem)
    const itemData = responseItem.data
    console.log("Item database loading... Response:")
    console.log(responseItem)

    //Load ownership data from database
    const url = 'http://localhost:4040/ownership/'
    const response = await axios.get(url)

    //Get relations that are related to current user only
    const currentUserID = this.user.userID
    const ownershipData = response.data.filter(
        function (element) {
          return element.userID.localeCompare(currentUserID) === 0
        }
    )
    console.log("Ownership database loading... Response:")
    console.log(response)

    //Extracting useful information
    for(const item of itemData)
      for(const ownedItem of ownershipData)
        if (item.itemID === ownedItem.itemID) {
          if (item.itemType.localeCompare("Avatar") === 0)
            this.ownedAvatar.push(item)
          else if(item.itemType.localeCompare("Skin") === 0)
            this.ownedSkin.push(item)
        }

  },
  methods: {
    exit() {
      console.log("Exited: " + this.$options.name)
      this.$emit("exit", this.$options.name, "MainMenu")
    },
    imagePath(path) {
      if (!path) {
        path = "avatar_default.png";
      }
      return require('../assets/' + path);
    },
    async equip(){
      //Update user object
      this.user.avatar = this.selectedAvatar
      this.user.skin = this.selectedSkin

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
