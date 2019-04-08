<template>
  <div>
    <div class="hero is-dark">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item">
                <img src="../assets/imagen/ZETA_Logo.png">
              </a>
            </div>
            <div class="navbar-menu" id="navbarMenuHeroA">
              <div class="navbar-end">
                <a class="navbar-item" v-if="loggedIn">
                  <router-link v-if="loggedIn" to="/logout">Log out</router-link>
                </a>
                <a class="navbar-item" v-if="!loggedIn">
                   <router-link v-if="!loggedIn" to="/login">Log in</router-link>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div class="hero-foot" v-if="loggedIn" >
        <nav class="tabs">
          <div class="container">
            <ul>
              <li class="is-active"><router-link to="/users">Usuarios</router-link></li>
              <li><router-link to="/membership">Membresía</router-link></li>
              <li><router-link to="/pay">Pagos</router-link></li>
              <li><router-link to="/newspaper">Ediciones</router-link></li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <template v-if="$route.matched.length">
      <div class="container">
        <div class="notification">
          <router-view></router-view>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loggedIn:false,
      }
    },
    created () {
     if(localStorage.token){
        this.loggedIn=true;
    }
  }
}
</script>
