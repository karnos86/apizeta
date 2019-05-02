<template>
  <nav>
    <v-toolbar flat app >
      <v-toolbar-side-icon class="grey--text" @click=" drawer = !drawer" ></v-toolbar-side-icon>
        <v-toolbar-title class="text-uppercase grey--text">
          <span class="title">Zeta</span>
          <span class="font-weight-thin caption">Libre como el viento</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat class="grey lighten-2" @click="logout">
          <span>Sign Out</span>
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
    </v-toolbar>
    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{link.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <V-list-tile-title class="white--text">{{link.text}}</V-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
  export default {
    data() {
      return{
        drawer:false,
        links:[
          {icon:'contacts', text:'Usuarios', route:'/user'},
          {icon:'card_membership', text:'Membresías', route:'/membership'},
          {icon:'attach_money', text:'Pagos', route:'/pay'},
          {icon:'import_contacts', text:'Ediciones', route:'/Edition'},
          {icon:'exit_to_app', text:'Salir', route:'/logout'}
        ]
      }
    },
    methods:{
      logout(){
        delete localStorage.cookie
        location.reload();
        this.$router.push('/')
      }
    }
  };
</script>