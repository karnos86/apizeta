<template>
    <div class="pay">
    <h1 class="subheading grey--text ">Pagos</h1>
      <v-container fluid class="my-5">
        <v-card>
            <v-alert v-model="alert"  dismissible  type="success">
              This is a success alert that is closable.
            </v-alert>
        </v-card>
        <v-card>
          <v-layout row wrap justify-center class="py-3">
            <v-flex  xs12 md4 class="pl-2">
              <v-text-field class="px-3" v-model="search" clearable  label="Ingrese email del usuario" single-line>
              </v-text-field>
            </v-flex>
            <v-flex xs12 md2>
              <v-btn flat color="info" :loading="loading"  :disabled="loading" @click="searchCustomer">
                <v-icon class="pr-1 font-weight-thin">search</v-icon>
                <span class="font-weight-thin">Buscar</span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="desserts"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <tr @click="select(props.item)">
                <td class="text-xs-center"><b>{{ props.item.reference }}</b></td>
                <td class="text-xs-center">{{ props.item.idConekt }}</td>
                <td class="text-xs-center">
                  <v-img v-if="props.item.method=='OXXO'" class="my-1" :src="require('@/assets/oxxo.png')"  max-height="60" max-width="60"  position="center"></v-img>
                  <v-img v-else class="my-1" :src="require('@/assets/mastercard.png')"  max-height="80" max-width="55"  position="center"></v-img> 
                 </td>
                <td class="text-xs-center">{{ props.item.subscription }}</td>
                <td class="text-xs-center">{{ dataTimes(props.item.start) }}</td>
                <td class="text-xs-center"><span class="caption">{{ dataTimes(props.item.end) }}</span></td>
                <td class="text-xs-center"><v-chip  color="success white--text text-capitalize"> {{ props.item.status }} </v-chip></td>
              </tr>
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
  props:['info'],
  data(){
    return{
      alert:false,
      loading:false,
      options: { month: 'short', year: 'numeric', day: 'numeric' },
      search:'',
          headers: [
          { text: 'Id Membresía', value: 'reference'},
          { text: 'Id Conekta', value: 'idConekt'},
          { text: 'Metodo', value: 'method' },
          { text: 'Perido', value: 'subscription' },
          { text: 'Inicia', value: 'start' },
          { text: 'Finaliza', value: 'end' },
          { text: 'Estado', value: 'status'},
        ],
      desserts: [
      ],
    }
  },
  created(){
    if(this.info != null){
      this.search=this.info
      this.searchCustomer();
     
    }
  },
  methods:{
    searchCustomer(){
      this.loading = true
       this.desserts=[]
      axios.post(backend+'/payIndex/customer',{username:this.search}, auth)
      .then((done)=>{
        console.log(done.data)
        this.memory=done.data
        this.loading = false
        done.data.subcriptions.forEach(element => {
          element['idConekt']=done.data.idConekt
          this.desserts.push(element)
        });
      })
      .catch((error)=>{
        this.loading = false
        console.log(error.message)
      })
    },
    dataTimes(times){
      var today = new Date((times*1000))
      return today.toLocaleDateString("es-MX", this.options).toUpperCase();
    },
    select(data){
      console.log(data)
      console.log(this.memory)
      this.$router.push({name:'details_pay', params:{info:data, search:this.search}});
    },
  }
    
};
</script>