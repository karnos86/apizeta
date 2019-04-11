<template>
  <div>
    <div class="hero is-dark">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item" v-on:click="goHome()">
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
              <!-- class="is-active" -->
              <li v-bind:class="{$route.path == '/users' ? 'active': '' }" ><router-link to="/users">Usuarios</router-link></li>
              <li><router-link to="/membership">Membresía</router-link></li>
              <!-- <li><router-link to="/pay">Pagos</router-link></li> -->
              <li><router-link to="/newspaper">Ediciones</router-link></li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <template v-if="$route.matched.length">
      <div class="container separador">
        <router-view></router-view>
      </div>
    </template>
  </div>
</template>

<script>
  import bus from '../bus.js'
  export default {
    data () {
      return {
        loggedIn:false,
        menu:[false, false, false],
      }
    },
    created () {
      this.dataLogin();
      this.resfreshLogin();
      this.resfreshLogout();
      console.log(this.$route)
    },
    methods:{
      dataLogin(){
        if(localStorage.cookie){
          this.loggedIn = true;
        }
      },
      resfreshLogin(){
        bus.$on("login", ($event) => {
          this.dataLogin();
          console.log('Evento...')
        })
      },
      resfreshLogout() {
        bus.$on("out", ($event) => {
          this.dataLogout();
          console.log('Evento...')
        })
      }, 
      dataLogout(){
        delete localStorage.cookie
        this.loggedIn = false;
        this.$forceUpdate()
        this.$router.push('/login')
      },
      goHome(){
        this.$router.push('/')
      }
    }
  };
</script>
<style>
  .separador{
    margin-top: 1rem;
  }
  .field{
    padding-bottom: 1rem;
  }
</style>
