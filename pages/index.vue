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
        <div class="list-group">
          <div v-for="(repo, index) in repositories" :key="index" class="list-group-item d-flex justify-content-between">
            <div>
              <a @click="getBranches">{{ repo.name }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Branch</label>
        <select class="custom-select">
          <option v-for="(branch, index) in branches" :key="index" value="1">{{ branch.name }}</option>
        </select>
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
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    repositories() {
      return [
        {
          name: "hoge"
        },
        {
          name: "piyo"
        },
        {
          name: "fuga"
        }
      ]
    },
    branches() {
      return [
        {
          name: "br1"
        },
        {
          name: "br2"
        },
        {
          name: "br3"
        }
      ]
    },
    tags() {
      return [
        {
          name: "tag1",
          created_at: "2018-01-03 00:00:00"
        },
        {
          name: "tag2",
          created_at: "2018-01-02 00:00:00"
        },
        {
          name: "tag3",
          created_at: "2018-01-01 00:00:00"
        }
      ]
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
      this.$store.commit("setUser", null)
    },
    getBranches() {
      console.log("ブランチ取得")
    }
  }
}
</script>

<style>
</style>
