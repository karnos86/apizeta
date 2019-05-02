<template>
  <div class="user">
    <h1 class="subheading grey--text ">Usuarios</h1>
      <v-container fluid class="my-5">
        <v-card>
        <v-layout row wrap justify-end>
          <v-flex  xs12 md4 class="pl-2">
            <v-text-field class="px-3" v-model="search"   label="ingrese usuario" single-line append-icon="search" clearable>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
        <v-card>
          <v-layout xd12 md9>
            <v-flex>
              <v-data-table :headers="headers"  :items="desserts" :search="search"  class="elevation-1" :key="username">
                <template v-slot:items="props">
                  <td class="text-xs-center"><v-chip small color="info" class="white--text" @click="show(props.item)">{{ props.item.idWordPress }}</v-chip></td>
                  <td class="text-xs-center">{{ props.item.username }}</td>
                  <td class="text-xs-center">{{ props.item.email }}</td>
                  <td class="text-xs-center">{{ props.item.idConekt }}</td>
                  <td class="text-xs-center">{{ props.item.createdAt}}</td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-card>
      </v-container>
  </div>
</template>
<script>
  import axios from 'axios'
  import {auth} from '../plugins/headers'
  import{backend} from'../plugins/url'


  export default {
    data(){
      return {
        search:'',
        options: { month: 'short', year: 'numeric', day: 'numeric' },
          headers: [
          { text: 'Id Wordpress', sortable: true, align: 'left',value: 'idWordPress'},
          { text: 'Usuario', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Id Conekta', value: 'idConekt' },
          { text: 'creado el', value: 'createdAt'},
        ],
      desserts: []
      }
    },
    computed:{
      filteredList() {
        return this.desserts.filter(element => {
          return element.username.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    }, 
    created: function(){
      this.index()
    },
    methods:{
      index(){
        let info =[];
        axios.get(backend+'/customer/findall', auth)
        .then((done)=>{
          done.data.forEach(element => {
            var today  = new Date(element.createdAt);
            element.createdAt = today.toLocaleDateString("pt-BR", this.options).toUpperCase();
            
            info.push(element);
          });
          this.desserts=info
        })
        .catch((error)=>{
          console.log(error)
        })
      },
      show(id){
        console.log(id)
        this.$router.push({name:'details_user', params:{info:id} });
      }
    } 
  }
</script>
