<template>
  <v-app>
    <Navbar v-show="value" />
    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'App',
  components: {Navbar},
  data () {
    return {
      value:false,
    }
  }, 
  created(){
    this.validar()
  },
  methods:{
    validar(){
      if(localStorage.cookie != null){
       this.value=true;
      }else{
        this.value=false
        this.$router.push('/login')
      }
    }
  }
};
</script>
