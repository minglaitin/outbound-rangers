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
        <input type="password" v-model = "confirmPassword" placeholder="Enter the password again" required>
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
    const url = 'http://localhost:4040/userdata/'
    const response = await axios.get(url)
    console.log(response)
    console.log("Data mounted successfully.")
    this.userData = response.data
  },
  methods: {
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
      const url = 'http://localhost:4040/userdata/create'
      const response = await axios.post(url, {
        userID: this.accountID,
        password: this.password
      });
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
.LoginBox input {
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
  /*background: #41b883;*/
  background: lightcoral;
  /*border: none;*/
  border-width: 1px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  /*transition-duration: 0.4s;*/
}
</style>