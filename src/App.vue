<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/login">login</router-link>
      <router-link to="/profile">profile</router-link>
      <v-btn @click="pushProfile()">asdf</v-btn>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {
    pushProfile() {
      this.$router.push({ path: "/profile", query: { employee: "1444044" } });
    }
  }
};
</script>
<style>
body,
html,
#app,
#dayspan {
  font-family: Roboto, sans-serif !important;
  width: 100%;
  height: 100%;
}

.v-btn--flat,
.v-text-field--solo .v-input__slot {
  background-color: #f5f5f5 !important;
  margin-bottom: 8px !important;
}
</style>
