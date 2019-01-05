import firebase from '~/service/firebase'
import axios from "axios"
import { firebaseMutations, firebaseAction } from 'vuexfire'

//<<どんなデータを使うのかを定義>>
export const state = () => {
	return {
		user: null,
		repos: [],
		tags: [],
		token: null,
		branches: [],
	}
}

/**
 * << データに対する操作を定義する（単純な処理） >>
 * setを様々なところで呼び出してしまうと、
 * どこでデータを書き換えられたのかがわからなくなってしまうのを防ぐため、
 * mutations経由で行うことにする。
 * mutations経由で変更していれば、mutationsを使用している場所を調べればいいので楽
 * */
export const mutations = {
	...firebaseMutations,
	setUser(state, user) {
		state.user = user
	},
	setRepos(state, repos) {
		state.repos = repos
	},
	setTags(state, tags) {
		state.tags = tags
	},
	setToken(state, token) {
		state.token = token
	},
	setBranches(state, branches) {
		state.branches = branches
	}
}

/**
 * <<mutationにロジックを加えることができる（制御などが行える）>>
 * commit関数を使って mutations を呼び出す
 * */
export const actions = {
	async loginWithUserName({dispatch, commit}) {
		const provider = new firebase.auth.GithubAuthProvider()
		const result = await firebase.auth().signInWithPopup(provider)
		const user = result.user
		const token = result.credential.accessToken
		commit("setUser", { name : user.displayName })
		commit("setToken", token)
		localStorage.setItem("token", token)
		dispatch("FETCH_REPOS")
	},
	async INIT_USERS({dispatch, commit}) {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				commit("setUser", { name: user.displayName})
				commit("setToken", localStorage.getItem('token'))
				dispatch("FETCH_REPOS")
			} else {
				commit("setUser", null)
			}
		})
	},
	LOGOUT() {
		firebase.auth().signOut()
	},
	async FETCH_REPOS({state, commit}) {
		const request = axios.create({
			baseURL: 'https://api.github.com',
			headers: {
				Authorization: 'token ' + state.token
			}
		})
		const response = await request('/user/repos?per_page=100')
		commit("setRepos", response.data)
	},
	async FETCH_TAGS({state, commit}, url) {
		const request = axios.create({
			headers: {
				Authorization: 'token ' + state.token
			}
		})
		const response = await request(url + '/tags')
		commit("setTags", response.data)
	},
	async FETCH_BRANCHES({state, commit}, url) {
		const request = axios.create({
			headers: {
				Authorization: 'token ' + state.token
			}
		})
		const response = await request(url + '/branches')
		commit("setBranches", response.data)
	}
}