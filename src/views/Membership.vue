<template>
  <div class="membership">
    <h1 class="subheading grey--text">Membresías</h1>
      <v-container fluid class="my-5">
        <v-card>
            <v-alert v-model="alert"  dismissible  type="success">
              This is a success alert that is closable.
            </v-alert>
        </v-card>
        <v-card>
          <v-layout row wrap justify-end>
            <v-flex  xs12 md4 class="pl-2">
              <v-text-field class="px-3" v-model="search" label="Ingrese el usuario" single-line append-icon="search" clearable>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card>
          <v-data-table :headers="headers" :items="filteredList"  class="elevation-1" >
            <template v-slot:items="props">
              <td class="text-xs-center"><b>{{ props.item.reference }}</b></td>
              <td class="text-xs-center">{{ props.item.customer.username }}</td>
              <td class="text-xs-center">
                <v-img v-if="props.item.method=='OXXO'" class="my-1" :src="require('@/assets/oxxo.png')"  max-height="60" max-width="60"  position="center"></v-img>
                <v-img v-else class="my-1" :src="require('@/assets/mastercard.png')"  max-height="80" max-width="55"  position="center"></v-img> 
               </td>
              <td class="text-xs-center">{{ props.item.subscription }}</td>
              <td class="text-xs-center">{{ dataTimes(props.item.start) }}</td>
              <td class="text-xs-center"><span class="caption">{{ dataTimes(props.item.end) }}</span></td>
              <td class="text-xs-center"><v-chip  color="success white--text text-capitalize"> {{ props.item.status }} </v-chip></td>
            </template>
          </v-data-table>
        </v-card>
        
      </v-container>
  </div>
</template>

<script>
    import axios from 'axios'
    import {backend} from '../plugins/url'
    import {auth} from '../plugins/headers'
  export default {
    data(){
      return{
        options: { month: 'short', year: 'numeric', day: 'numeric' },
        search:'',
        alert:false,
        headers: [
          { text: 'Id Membresía', value: 'reference'},
          { text: 'Usuario', value: 'username' },
          { text: 'Metodo', value: 'method' },
          { text: 'Perido', value: 'subscription' },
          { text: 'Inicia', value: 'start' },
          { text: 'Finaliza', value: 'end' },
          { text: 'Estado', value: 'status'},
        ],
        desserts: [],
      }
    },
    created:function(){
      this.indexMemberships();
    },
    computed:{
      filteredList() {
        return this.desserts.filter(element => {
          return element.customer.username.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    },
    methods:{
      indexMemberships(){
				console.log(backend+'/memberships/index')
				axios.get(backend+'/memberships/index', auth)
				.then((done)=>{
          console.log(done.data)
          this.desserts=done.data
				})
				.catch((error)=>{
          console.log(error)
				})
      },
      dataTimes(times){
        var today = new Date((times*1000))
        return today.toLocaleDateString("es-MX", this.options).toUpperCase();
      }
    }
    
  
  };
</script>