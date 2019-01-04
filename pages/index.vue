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
        <input v-model="user.name" class="form-control" id="userForm" readonly>
      </div>

      <div class="form-group">
        <label>Repositories</label>
        <div>
          <select v-model="tags_url" @change="getTags(tags_url)" class="custom-select">
            <option v-for="(repo, index) in repos" :key="index" :value="repo.tags_url">{{ repo.name }}</option>
          </select>
        </div>
      </div>

      <div class="form-inline mb-3">
        <input v-model="form.tag" class="form-control">
        <button class="btn btn-outline-secondary ml-3">create tag</button>
      </div>

      <table class="table table-sm">
        <thead>
        <tr>
          <th scope="col">tag</th>
          <th scope="col">created_at</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(tag, index) in tags" :key="index">
          <td>{{ tag.name }}</td>
          <td>{{ tag.created_at }}</td>
        </tr>
        </tbody>
      </table>

      <div class="text-right">
        <button @click="logout" class="btn btn-danger">ログアウト</button>
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
      tags_url: null
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
    getTags(url) {
      this.$store.dispatch("FETCH_TAGS", url)
    }
  }
}
</script>

<style>
</style>
