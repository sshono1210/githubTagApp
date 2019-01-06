<template>
  <section class="container mt-3">
    <!--ログインしていない場合-->
    <div v-if="user === null">
      <p>
        利用するには、ログインしてください。
      </p>
      <button @click="login" class="btn btn-light btn-block mt-3 mb-3">ログイン</button>
    </div>

    <!--ログインしている場合-->
    <div v-if="user">
      <div class="form-group">
        <label for="userForm">User</label>
        <div class="form-inline">
          <input v-model="user.name" class="form-control" id="userForm" readonly>
          <button @click="logout" class="btn btn-secondary ml-3">ログアウト</button>
        </div>
      </div>

      <div class="form-group">
        <label>Repositories</label>
        <div>
          <select v-model="repo_url" @change="getRepoData(repo_url)" class="custom-select">
            <option v-for="(repo, index) in repos" :key="index" :value="repo.url">{{ repo.name }}</option>
          </select>
        </div>
      </div>

      <div>
        <label>Create Tag and Release</label>
        <div class="form-inline mb-2">
          <span class="mr-3">このページから登録したタグ</span>
          <select v-if="!hasTagsInFbdb" class="custom-select">
            <option value="">登録したタグはありません</option>
          </select>
          <select v-model="form.registeredTag" @change="inputFormTag()" v-if="hasTagsInFbdb" class="custom-select">
            <option v-for="(tag2, index) in tagsInFbdb" :key="index" class="list-group-item">{{ tag2.tag }}</option>
          </select>
        </div>

        <div class="form-inline mb-3">
          <input v-model="form.tag" class="form-control" placeholder="e.g. v1.0.0">
          <span class="ml-3 mr-3">@</span>
          <select v-if="!hasBranches" class="custom-select">
            <option value="">リポジトリを選択してください</option>
          </select>
          <select v-model="form.target" v-if="hasBranches" class="custom-select">
            <option v-for="(branch, index) in branches" :key="index" :value="branch.name">Target: {{ branch.name }}</option>
          </select>
        </div>
        <p v-if="is_invalid_semver" class="text-danger small">重複しないSEMVER形式で入力してください</p>

        <div class="form-group">
          <input v-model="form.title" class="form-control" placeholder="Release title">
          <textarea v-model="form.description" class="form-control mt-3" placeholder="Describe this release"></textarea>

          <div class="form-group form-check mt-3">
            <input v-model="form.preRelease" type="checkbox" class="form-check-input" id="pre_release">
            <label class="form-check-label" for="pre_release">This is a pre-release</label>
          </div>
          <div class="text-right">
            <button @click="createRelease()" class="btn btn-success mt-3" :disabled="!canCreateRelease">Publish release</button>
            <!--<button @click="createRelease('true')" class="btn btn-outline-secondary mt-3" :disabled="!canCreateRelease">Save draft</button>-->
          </div>
        </div>
      </div>

      <div>
        <label>Tags</label>
        <ul class="list-group mb-3">
          <li v-if="!hasTags" class="list-group-item">登録したタグはありません</li>
          <li v-for="(tag, index) in tags" :key="index" class="list-group-item">
            {{ tag.name }}
          </li>
        </ul>
      </div>
    </div>

  </section>
</template>

<script>
import semver from "semver"

export default {
  data() {
    return {
      form: {
      	target: "master"
      },
      repo_url: null,
      is_invalid_semver: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    repos() {
      return this.$store.state.repos
    },
    tags() {
      return this.$store.state.tags
    },
    tagsInFbdb() {
      return this.$store.state.tags_in_FBDB
    },
    branches() {
      return this.$store.state.branches
    },
    hasTags() {
      return this.tags.length > 0
    },
    hasTagsInFbdb() {
      return this.tagsInFbdb.length > 0
    },
    hasBranches() {
      return this.branches.length > 0
    },
    canCreateRelease() {
      return this.hasBranches && this.form.tag
    },
    isValidSEMVER() {
      return !!semver.valid(this.form.tag)
    }
  },
  async mounted() {
  	await this.$store.dispatch("INIT_USERS")
  },
  methods: {
    login() {
      this.$store.dispatch("loginWithUserName")
    },
    logout() {
      this.$store.dispatch("LOGOUT")
    },
    getRepoData(url) {
      this.$store.dispatch("FETCH_TAGS", url)
      this.$store.dispatch("FETCH_BRANCHES", url)
    },
    async createRelease(bool) {
      if (!this.isValidSEMVER) {
        this.is_invalid_semver = true
        return
      }
      this.$store.dispatch("createTagAndRelease", {
        url: this.repo_url,
        tag: semver.clean(this.form.tag),
        target: this.form.target,
        title: this.form.title,
        description: this.form.description,
        isDraft: !!bool,
        isPreRelease: !!this.form.preRelease
      }).catch((e) => {
      	this.is_invalid_semver = true
      })
      this.is_invalid_semver = false
    },
    inputFormTag() {
      this.form.tag = this.form.registeredTag
    }
  }
}
</script>

<style>
</style>
