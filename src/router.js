import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './components/LoginPage'
import Signup from "./components/Signup";
import ChangePassword from "./components/ChangePassword";
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
        {path: '/change_pw', component: ChangePassword},
        {path: '/leaderboard', component: LeaderBoard},
        {path: '/shop', component: Shop},
        {path: '/game', component: Game},
        {path: '/account', component: Account},
        {path: '/friends', component: Friends},

    ]
})