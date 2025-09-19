<template>
  <div v-if="visible" id="account" class="outer-container">
    <div class="main-content">
      <h1>Account</h1>
      <div>
          <!--display user information-->
          <img :src="imagePath(selectedAvatar)" height="256px">
          <img :src="imagePath(selectedSkin)" height="128px">
          <p> UserID: {{ user.userID }} </p>
          <p> Last Active Time: {{ user.lastActiveTime }} </p>
          <p> Highest Score: {{ user.highestScore }} </p>
          <p> Accumulated Score: {{ user.accumulatedScore }} </p>
          <p> Coins: {{ user.coins }} </p>
      </div>
      <!--selection for avatar-->
      <label for="avatar">Owned Avatars:</label>
      <select id="avatar" v-model="selectedAvatar">
        <option value="avatar_default.png">Null</option>
        <option v-for="(avatar, index) in ownedAvatar" v-bind:key="index" v-bind:value="avatar.itemImage">{{ avatar.itemName }}</option>
      </select>
      <!--selection for skin-->
      <label for="skin">  Owned Skins:</label>
      <select id="skin" v-model="selectedSkin">
        <option value="skin_default.svg">Null</option>
        <option v-for="(skin, index) in ownedSkin" v-bind:key="index" v-bind:value="skin.itemImage">{{ skin.itemName }}</option>
      </select>
      
      <br>
      <button v-on:click="equip">Equip</button>
      <br>
      <router-link to='/change_pw'><button>Change Password</button></router-link>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
        friendsID: [],
        ownedItems: []
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
    const urlItem = 'http://localhost:4040/itemsdata/'
    const responseItem = await axios.get(urlItem)
    const itemData = responseItem.data

    //Extracting useful information
    for(const item of itemData)
      for(const ownedItemID of this.user.ownedItems)
        if (item.itemID === ownedItemID) {
          if (item.itemType.localeCompare("Avatar") === 0) {
            this.ownedAvatar.push(item)
          }
          else if(item.itemType.localeCompare("Skin") === 0) {
            this.ownedSkin.push(item)
          }
        }

  },
  methods: {
    imagePath(path) {
      // for displaying images
      if (!path) {
        path = "avatar_default.png";
      }
      return require('../assets/' + path);
    },
    async equip(){
      //Update user object
      this.user.avatar = this.selectedAvatar
      this.user.skin = this.selectedSkin

      const newData = {
        avatar: this.user.avatar,
        skin: this.user.skin
      };

      //Update user database
      const url = 'http://localhost:4040/usersdata/update/' + this.user._id
      // console.log(url)
      try {
        const response = await axios.post(url, newData)
        console.log("Avatar/Skin updated", response)
      } catch (err) {
        console.log(err, "in Account.vue")
      }
      
    }
  }
}
</script>

<style scoped>
button {
  font-size: medium;
  font-family: Verdana, Arial, sans-serif;
  text-decoration: none;
  cursor: default;
  color: black;
  margin-top: 16px;
}
</style>
