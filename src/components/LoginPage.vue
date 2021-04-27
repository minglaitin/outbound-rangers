<template>
  <div v-if="visible" id = "LoginPage">
    <div class="LoginBox">
      <h1>Login</h1>
      <form v-on:submit.prevent="login()">
        <label>Account ID</label>
        <input v-model = "accountID" id="inputID" placeholder="Enter account id here" required>
        <label>Password</label>
        <input type="password" v-model = "password" id="inputPassword" placeholder="Enter password here" required>
        <span class="toggle-pw">
          <input type="checkbox" id="toggleCheckbox" v-on:click="togglePassword()"><label> Show Password Input</label>
        </span>
        <button type="submit" class="button" id="buttonID">Login</button>
      </form>
<!--      <button type="submit" class="button" id="buttonPassword" v-on:click="loginGuest();">Login as guest</button>-->
      <p>Do not have an account? <router-link to='/signup'>Create one</router-link> now!</p>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "LoginPage",
  props:{
    visible: {
      type: Boolean,
      default: true
    },
    userData : {
      type: Array
    },
  },
  data () {
    return {
      accountID: "",
      password: ""
    }
  },
  // async mounted(){
  //   const url = 'http://localhost:4040/userdata/'
  //   const response = await axios.get(url)
  //   this.userData = response.data
  // },
  methods: {
    async login(){
      console.log("Attempt to login as user")

      //Checking
      const inputID = this.accountID
      const inputPW = this.password
      let found = this.userData.find(
          function (element) {
            return element.userID.localeCompare(inputID) === 0 && element.password.localeCompare(inputPW) === 0
          }
      )
      if (found === undefined){
        alert("The input userID or password is not found.")
        return
      }

      //Only support string
      //https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
      sessionStorage.setItem('currentUserID', found.userID)
      this.$emit("login", this.accountID)

      await this.$router.push('/account') //Redirect to Account page
    },
    togglePassword() {
      var checkBox = document.getElementById("toggleCheckbox"); // Get the checkbox
      var field = document.getElementById("inputPassword"); // Get the password field

      // If the checkbox is checked, display the password
      if (checkBox.checked == true) {
        field.type = "text";
      } else {
        field.type = "password";
      }
    }
  }
}

</script>

<style scoped>
div#LoginPage {
  /*margin-top: 128px;*/
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
div.LoginBox {
  border: 3px solid #eee;
  border-radius: 7px;
  width: 400px;
  margin: 0 auto;
  /*margin: 16px 512px;*/
  padding: 26px 40px 20px;
  background-color: white;
}
div.buttons {
  text-align: right;
}
.button {
  color: black;
  font-size: inherit;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  margin: 10px 0px;
  padding: 9px 10px;
  /*padding: 16px 32px;*/
  background: #41b883;
  /*border: none;*/
  border-width: 1px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  /*transition-duration: 0.4s;*/
}

.LoginBox h1 {
  text-align: center;
  margin: 0px 0px 20px;
}

.LoginBox input:not([type="checkbox"]) {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 5px auto 15px;
  padding: 10px;
  background:#ecf0f1;
  border: #ccc 1px solid;
  border-radius: 3px;
  border-bottom: #ccc 2px solid;
}

.toggle-pw {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
}

.LoginBox input[type="checkbox"] {
  display: inline;
}

</style>