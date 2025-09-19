<template>
  <div v-if="visible" id="shop">
    <h1>Shop</h1>

    <!-- user info: avatar, userID, coins -->
    <div>
      <div class="user-info">
        <img :src="imagePath( user.avatar )" >
        <span>UserID: {{ user.userID }}</span>
      </div>
      
      <div class="user-coin">
        Coin: {{ user.coins }}
      </div>
    </div>
    <div class="clear-float"></div>

    <!-- tabs: switching between avatars and skins -->
    <div class="tab">
      <button v-for="(tab, index) in tabs"
      :key="index"
      @click="selectedTab = tab"
      :class="{selected: selectedTab === tab}">{{tab}}</button>
    </div>
    
    <!-- shop items -->
    <div class="shop-item-container">

      <!-- avatar items -->
      <div v-show="selectedTab === 'Avatar'">
        <ul><li v-for="(avatar, index) in avatars" 
                :key="index"
                class="shop-item-list">
              <div class="shop-item">
                <div class="item-card">
                  <p style="text-align: center">{{avatar.itemType}}: {{avatar.itemName}}</p>
                  <img :src="imagePath(avatar.itemImage)" class="item-image">
                  <p class="cost">Cost: {{avatar.cost}}</p>
                  <button @click="buyItem(avatar)"
                          :disabled="checkOwned(avatar) || user.coins < avatar.cost"
                          >{{ buyButtonLabel(avatar) }}</button>
                  <div class="clear-float"></div>
                </div>
              </div>
            </li></ul>
      </div>

      <!-- skin items -->
      <div v-show="selectedTab === 'Skin'">
        <ul><li v-for="(skin, index) in skins" 
                :key="index"
                class="shop-item-list">
            <div class="shop-item">
              <div class="item-card">
                <p style="text-align: center">{{skin.itemType}}: {{skin.itemName}}</p>
                <img :src="imagePath(skin.itemImage)" class="item-image">
                <p class="cost">Cost: {{skin.cost}}</p>
                <button @click="buyItem(skin)"
                        :disabled="checkOwned(skin) || user.coins < skin.cost"
                        >{{ buyButtonLabel(skin) }}</button>
                <div class="clear-float"></div>
              </div>
            </div>
          </li></ul>
      </div>

    </div>

  </div>

</template>

<script>
import axios from "axios";

export default {
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
  },
  name: "Shop",
  async mounted() {
    await this.loadDatabase()
  },
  data() {
    return {
      avatars: [
        {
          itemID: 1001,
          itemType: 'Avatar',
          itemName: 'Cat',
          itemImage: 'cat.png',
          cost: 150,
          owned: false
        },
        {
          itemID: 1002,
          itemType: 'Avatar',
          itemName: 'Dog',
          itemImage: 'dog.png',
          cost: 100,
          owned: false
        },
        {
          itemID: 1003,
          itemType: 'Avatar',
          itemName: 'Mouse',
          itemImage: 'mouse.png',
          cost: 50,
          owned: false
        }
      ],
      skins: [
        {
          itemID: 2001,
          itemType: 'Skin',
          itemName: 'Knight',
          itemImage: 'skin_knight.svg',
          cost: 50,
          owned: false
        },
        {
          itemID: 2002,
          itemType: 'Skin',
          itemName: 'Magician',
          itemImage: 'skin_magician.svg',
          cost: 100,
          owned: false
        },
        {
          itemID: 2003,
          itemType: 'Skin',
          itemName: 'Warrior',
          itemImage: 'skin_warrior.svg',
          cost: 150,
          owned: false
        }
      ],
      ownership: [],
      tabs: ['Avatar', 'Skin'],
      selectedTab: 'Avatar'
    }
  },
  methods: {
    async buyItem(item) {
      // Update user object (direct mutation of parent's object!)
      this.user.coins -= item.cost
      this.user.ownedItems.push(item.itemID)

      const newData = {
        coins: this.user.coins,
        ownedItems: this.user.ownedItems
      }

      const url = 'http://localhost:4040/usersdata/update/' + this.user._id
      const response = await axios.post(url, newData);
      console.log("User coins & items updated", response);
    },
    imagePath(path) {
      // for displaying image files
      if (!path) {
        path = "avatar_default.png";
      }
      return require('../assets/' + path);
    },
    buyButtonLabel(item) {
      // change the label of buy button according to ownership and coins
      const owned = this.checkOwned(item)
      if (owned === true) {
        return 'Owned'
      }
      else if (this.user.coins < item.cost) {
        return 'Not enough coins'
      }
      else {
        return 'Buy'
      }
    },
    checkOwned(item){
      // Check if item is owned
      const owned = this.user.ownedItems.find(element => {
            return element === item.itemID
          }
      )

      return owned !== undefined
    },
    async loadDatabase(){
      // Load item database when page is loaded
      const url = 'http://localhost:4040/itemsdata/'
      const response = await axios.get(url)
      this.avatars = response.data.filter(
          function (element) {
            return element.itemType.localeCompare("Avatar") === 0
          }
      )
      this.skins = response.data.filter(
          function (element) {
            return element.itemType.localeCompare("Skin") === 0
          }
      )
      console.log("Item database loaded", response)
    },
  }
}
</script>

<style scoped>
  * {
    box-sizing: border-box;
    font-family: Verdana, Arial, sans-serif;
  }
  .clear-float {
    clear: both;
  }
  .user-info {
    float: left;
    border-radius: 3px;
    padding: 10px;
  }
  .user-info span {
    display: inline-block;
    margin-left: 10px;
  }
  .user-info img {
    width: 40px;
  }
  .user-coin {
    float: right;
    border-radius: 3px;
    padding: 15px;
  }
  .shop-item-container {
    border: 1px solid #bbb;
    border-radius: 2px;
    width: 100%;
  }
  .shop-item-container ul {
    padding: 0px;
  }
  .shop-item-list {
    display: inline;
  }
  .shop-item {
    display: inline-block;
    border: 1px solid white;
    padding: 5px 20px;
    width: 33.33%;
    margin: auto;
  }
  @media (max-width: 990px) {
    .shop-item {
      width: 50%;
    }
  }
  @media (max-width: 768px) {
    .shop-item {
      width: 100%;
    }
  }  
  .item-card {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    width: 100%;
    padding: 0px 20px 15px;
  }
  .shop-item img {
    display: block;
    margin: 10px auto;
  }
  .tab {
    margin-top: 20px;
    text-align: left;
  }
  .tab button{
    border: 1px solid #bbb;
    width: 10%;
    min-width: 80px;
    padding: 8px 10px;
    font-size: 16px;
    outline: none;
  }
  .selected {
    border: 1px solid #858585;
    background-color: #aaa;
    color: white;
  }
  .shop-item button {
    padding: 5px 10px;
    float: right;
  }
  .cost {
    margin: 5px;
    float:left;
  }
  button:hover {
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
  }
  .item-image {
    height: 200px;
  }
</style>