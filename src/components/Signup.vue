<template>
  <div id="Signup">
    <div class="LoginBox">
      <h1>Sign Up</h1>
      <form @submit.prevent="signup()">
        <label>New Account ID:</label>
        <input v-model = "accountID" id="inputID" placeholder="Enter account id here" required>
        <label>New Password:</label>
        <input type="password" v-model = "password" id="inputPassword" placeholder="Enter password here" required>
        <label>Confirm Password:</label>
        <input type="password" v-model = "confirmPassword" id="inputConfirmPassword" placeholder="Enter the password again" required>
        <span class="toggle-pw">
          <input type="checkbox" id="toggleCheckbox" v-on:click="togglePassword()"><label> Show Password Input</label>
        </span>
        <p id="warn">This project was created for learning purpose. Do <strong>NOT</strong> enter any important data in this site.</p>
        <button type="submit" class="button">Signup</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signup",
  data() {
    return{
      accountID: "",
      password: "",
      confirmPassword: "",
      userData: []
    }
  },
  async mounted(){
    const url = 'http://localhost:4040/usersdata/'
    const response = await axios.get(url)
    console.log(response)
    console.log("Data mounted successfully.")
    this.userData = response.data
  },
  methods: {
    togglePassword() {
      let checkBox = document.getElementById("toggleCheckbox"); // Get the checkbox
      let field = document.getElementById("inputPassword"); // Get the password field
      let fieldConfirm = document.getElementById("inputConfirmPassword");


      // If the checkbox is checked, display the password
      if (checkBox.checked === true) {
        field.type = "text";
        fieldConfirm.type = "text";
      } else {
        field.type = "password";
        fieldConfirm.type = "password";
      }
    },
    async signup(){
      console.log("Requested signup procedure.");

      //Check password and confirm password
      if (this.password.localeCompare(this.confirmPassword) !== 0){
        alert("Inputted password and confirm password do not match!")
        return
      }
      //Check if the ID is taken already
      const currentInputID = this.accountID
      let duplicate = this.userData.filter(
          function (element) {
            return element.userID.localeCompare(currentInputID) === 0
          }
      )
      if (duplicate.length !== 0){
        alert("The input ID: \"" + currentInputID + "\" is already taken.")
        return
      }
      //Post data to database
      const url = 'http://localhost:4040/usersdata/create'
      const newUser = {
        userID: this.accountID,
        password: this.password,
        lastActiveTime: new Date().toISOString(),
        highestScore: 0,
        accumulatedScore: 0,
        coins: 0,
        avatar: "avatar_default.png",
        skin: "skin_default.svg",
        friendsID: [],
        ownedItems: [],
      }
      const response = await axios.post(url, newUser);
      console.log(response);

      this.$emit("reload")
      await this.$router.push('/') //Redirect to Login page

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
  font-size: inherit;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  margin: 10px 0px;
  padding: 9px 10px;
  background: lightcoral;
  border-width: 1px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}
#warn {
  margin: 25px 0 0;
  padding: 5px 10px;
  font-size: 14px;
  background-color: mistyrose;
  border: 1px solid lightpink;
  border-radius: 2px;
}
</style>