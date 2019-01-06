import firebase from '~/service/firebase'
import axios from "axios"
import { firebaseMutations, firebaseAction } from 'vuexfire'
const db = firebase.database()
const tagsRef = repo => {
	return db.ref(`/tags/${repo}`)
}
const getRepoName = url => {
	return url.split("/").slice(-1)[0]
}

export const state = () => {
	return {
		user: null,
		repos: [],
		// tags: [],
		token: null,
		branches: [],
		tags_in_FBDB: []
	}
}

export const mutations = {
	...firebaseMutations,
	setUser(state, user) {
		state.user = user
	},
	setRepos(state, repos) {
		state.repos = repos
	},
	// setTags(state, tags) {
	// 	state.tags = tags
	// },
	setToken(state, token) {
		state.token = token
	},
	setBranches(state, branches) {
		state.branches = branches
	}
}

export const actions = {
	async loginWithUserName({dispatch, commit}) {
		const provider = new firebase.auth.GithubAuthProvider()
		provider.addScope('repo')
		const result = await firebase.auth().signInWithPopup(provider)
		const user = result.user
		const token = result.credential.accessToken
		commit("setUser", { name : user.displayName })
		commit("setToken", token)
		localStorage.setItem("token", token)
		axios.defaults.headers.common['Authorization'] = 'token ' + token
		dispatch("FETCH_REPOS")
	},
	async createTagAndRelease({dispatch, state, commit}, data) {
		const request = axios.create({
			method: 'POST',
			data: {
				"tag_name": data.tag,
				"target_commitish": data.target,
				"name": data.title,
				"body": data.description,
				"draft": data.isDraft,
				"prerelease": data.isPreRelease
			}
		})
		const response = await request(data.url + '/releases')
		const tag = response.data.tag_name
		const date = new Date()
		const repo = getRepoName(data.url)
		tagsRef(repo).push().set({
			tag,
			date: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
		})
	},
	FETCH_TAGS_IN_FBDB: firebaseAction(({ bindFirebaseRef }, repo) => {
		return new Promise( (resolve) => {
			bindFirebaseRef('tags_in_FBDB', tagsRef(repo), { resolve })
		} )
	}),
	async INIT_USERS({dispatch, commit}) {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				commit("setUser", { name: user.displayName})
				commit("setToken", localStorage.getItem('token'))
				axios.defaults.headers.common['Authorization'] = 'token ' + localStorage.getItem('token')
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
		})
		const response = await request('/user/repos?per_page=100')
		commit("setRepos", response.data)
	},
	async FETCH_TAGS({dispatch, state, commit}, url) {
		// const response = await axios(url + '/tags')
		// commit("setTags", response.data)
		const repo = getRepoName(url)
		dispatch("FETCH_TAGS_IN_FBDB", repo)
	},
	async FETCH_BRANCHES({state, commit}, url) {
		const response = await axios(url + '/branches')
		commit("setBranches", response.data)
	}
}