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
        <div class="form-inline mb-3">
          <input v-model="form.tag" class="form-control" placeholder="Tag version">
          <span class="ml-3 mr-3">@</span>
          <select v-if="branches.length == 0" class="custom-select">
            <option value="">リポジトリを選択してください</option>
          </select>
          <select v-if="branches.length > 0" class="custom-select">
            <option v-for="(branch, index) in branches" :key="index" :value="branch.name">Target: {{ branch.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <input v-model="form.title" class="form-control" placeholder="Release title">
          <textarea class="form-control mt-3" placeholder="Describe this release"></textarea>

          <div class="form-group form-check mt-3">
            <input type="checkbox" class="form-check-input" id="pre_release">
            <label class="form-check-label" for="pre_release">This is a pre-release</label>
          </div>
          <div class="text-right">
            <button class="btn btn-success mt-3">Publish release</button>
            <button class="btn btn-outline-secondary mt-3">Save draft</button>
          </div>
        </div>
      </div>

      <div>
        <label>Tags</label>
        <ul class="list-group mb-3">
          <li v-if="tags.length == 0" class="list-group-item">登録されたタグはありません</li>
          <li v-for="(tag, index) in tags" :key="index" class="list-group-item">
            {{ tag.name }}
          </li>
        </ul>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        tag: ""
      },
      repo_url: null
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
    branches() {
      return this.$store.state.branches
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
    }
  }
}
</script>

<style>
</style>
