<template>
  <div id="Signup">
    <div class="LoginBox">
      <h1>Change Password</h1>
      <form @submit.prevent="changePassword()">
        <label>Old Password:</label>
        <input type="password" v-model = "oldPassword" id="inputOldPassword" placeholder="Enter old password here" required>
        <label>New Password:</label>
        <input type="password" v-model = "password" id="inputPassword" placeholder="Enter password here" required>
        <label>Confirm Password:</label>
        <input type="password" v-model = "confirmPassword" id="inputConfirmPassword" placeholder="Enter the password again" required>
        <span class="toggle-pw">
          <input type="checkbox" id="toggleCheckbox" v-on:click="togglePassword()"><label> Show Password Input</label>
        </span>
        <button type="submit" class="button">Change</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChangePassword",
  props:{
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
    }
  },
  data() {
    return{
      oldPassword: "",
      password: "",
      confirmPassword: ""
    }
  },
  methods: {
    async changePassword(){

      //Check old password and current password
      if (this.oldPassword.localeCompare(this.user.password) !== 0){
        alert("Inputted password and current password do not match!")
        return
      }

      //Check new password and confirm password
      if (this.password.localeCompare(this.confirmPassword) !== 0){
        alert("Inputted password and confirm password do not match!")
        return
      }

      //Check new password and current password
      if (this.password.localeCompare(this.user.password) === 0){
        alert("New password is the same as current password!")
        return
      }

      //Update current Password
      this.user.password = this.password
      //Update user database
      const url = process.env.VUE_APP_BACKEND + '/usersdata/update/' + this.user._id
      await axios.post(url, {password: this.user.password})

      this.$emit("reload")
      await this.$router.push('/account') //Redirect to Login page

    },
    togglePassword() {
      let checkBox = document.getElementById("toggleCheckbox"); // Get the checkbox
      let fieldOld = document.getElementById("inputOldPassword");
      let field = document.getElementById("inputPassword");// Get the password field
      let fieldConfirm = document.getElementById("inputConfirmPassword");

      // If the checkbox is checked, display the password
      if (checkBox.checked === true) {
        fieldOld.type = "text";
        field.type = "text";
        fieldConfirm.type = "text";
      } else {
        fieldOld.type = "password";
        field.type = "password";
        fieldConfirm.type = "password";
      }
    }
  }
}
</script>

<style scoped>
div#Signup {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
}
div.LoginBox {
  border: 3px solid #eee;
  border-radius: 7px;
  width: 400px;
  margin: 0 auto;
  padding: 26px 40px 20px;
  background-color: white;
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
  background: lightskyblue;
  border-width: 1px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}
</style>