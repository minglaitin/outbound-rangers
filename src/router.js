import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './components/LoginPage'
import Signup from "./components/Signup";
// import MainMenu from "./components/MainMenu";
import LeaderBoard from "./components/LeaderBoard";
import Shop from "./components/Shop";
import Game from "./components/Game";
import Account from "./components/Account";
import Friends from "./components/Friends";

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', component: LoginPage},
        {path: '/signup', component: Signup},
        {path: '/leaderboard', component: LeaderBoard},
        {path: '/shop', component: Shop},
        {path: '/game', component: Game},
        {path: '/account', component: Account},
        {path: '/friends', component: Friends},

    ]
})