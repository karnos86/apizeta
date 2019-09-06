<template>
    <div class="details">
    <h1 class="subheading grey--text ">Details</h1>
      <v-container fluid class="my-3">
        <v-layout class="my-3">
          <v-flex>
            <v-btn flat class="info--text" @click="back">
              <v-icon class="pr-2">keyboard_arrow_left</v-icon>
              <span class="subheading text-none">Ir atras</span>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-card class="pb-4">
          <v-layout class=" pa-2">
            <v-flex>
              <span class="title">Información de Usuario</span>
            </v-flex>
          </v-layout>
          <v-layout >
            <v-flex class="xs12 md-2 pl-1"> 
              <div class="caption grey--text mb-2">Id Worpress</div>
              <span class="body-1">{{info.idWordPress}}</span> 
            </v-flex>
            <v-flex class="xs12 md-2 pl-1"> 
              <div class="caption grey--text mb-2">Id Conekta</div>
              <span class="body-1">{{info.idConekt}}</span> 
            </v-flex>
            <v-flex class="xs12 md-2 pl-1"> 
              <div class="caption grey--text mb-2">Usuario App</div>
              <span class="body-1">{{info.username}}</span> 
            </v-flex>
            <v-flex class="xs12 md-2 pl-1"> 
              <div class="caption grey--text mb-2">Email</div>
              <span class="body-1">{{info.email}}</span> 
            </v-flex>
            <v-flex class="xs12 md-2"> 
              <div class="caption grey--text">Activo</div> 
              <v-chip  v-bind:class="`user-${info.active}`" small>
                <span class="body-1 text-capitalize white--text">
                  {{info.active}}
                </span>
              </v-chip>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card  class="scroll my-4" max-height="400px" >
          <v-layout class=" pa-2">
            <v-flex>
              <span class="title">Membresias</span>
            </v-flex>
          </v-layout>
          <v-card  class="my-2" v-for="subscription in subscriptions" :key="subscription.reference" color="grey lighten-4">
            <v-layout >
              <v-flex class="xs12 md-2 pl-1"> 
                <div class="caption grey--text mb-2">Membresía</div>
                <span class="body-1">{{subscription.reference}}</span> 
              </v-flex>
              <v-flex class="xs12 md-2 ml-2"> 
                <div class="caption grey--text">Metodo de pago</div> 
                <v-img v-if="subscription.method=='OXXO'" class="my-1" :src="require('@/assets/oxxo.png')"  max-height="60" max-width="60"  position="center"></v-img>
                <v-img v-else class="my-1" :src="require('@/assets/mastercard.png')"  max-height="80" max-width="55"  position="center"></v-img>
              </v-flex>
              <v-flex class="xs12 md-2"> 
                <div class="caption grey--text mb-2">tipo de membresía</div>
                  <span class="body-1">{{subscription.subscription}}</span>
              </v-flex>
              <v-flex class="xs12 md-2"> 
                <div class="caption grey--text mb-2">Inicia</div> 
                <span class="caption">{{dataTimes(subscription.start)}}</span>
              </v-flex>
              <v-flex class="xs12 md-2 "> 
                <div class="caption grey--text mb-2">Finaliza</div> 
                <span class="caption">{{dataTimes(subscription.end)}}</span>
              </v-flex>
              <v-flex class="xs12 md-2"> 
                <div class="caption grey--text">Estatus</div> 
                <v-chip  v-bind:class="`memb-${subscription.status}`">
                  <span class="body-1 text-capitalize white--text">
                    {{subscription.status}}
                  </span>
                </v-chip>
              </v-flex>
              <v-flex class="xs12 md-2 "> 
                <div class="caption grey--text mb-2">Ultimo cambio</div> 
                <span class="caption">{{dateFormat(subscription.updatedAt)}}</span>
              </v-flex>
            </v-layout>
          </v-card>
        </v-card>
        <v-layout>
          <v-flex class="xs12 md6">
          <v-card  class="scroll my-4 mr-1" max-height="300px">
            <v-layout class=" pa-2">
              <v-flex>
                <span class="title">Lista de Emails</span>
              </v-flex>
            </v-layout>
            <v-card class="my-2" v-for="email in emails" :key="email.id" color="grey lighten-4">
              <v-layout>
                <v-flex class="xs12 md-5 pl-1"> 
                  <div class="caption grey--text mb-2">Id</div>
                  <span class="body-1">{{email.id}}</span> 
                </v-flex>
                <v-flex class="xs12 md-2 pl-1"> 
                  <div class="caption grey--text mb-2">Respuesta Servicio</div>
                  <span class="body-1">{{email.status}}</span> 
                </v-flex>
                <v-flex class="xs12 md-2 "> 
                  <div class="caption grey--text mb-2">Fecha de envio</div> 
                  <span class="caption">{{dateFormat(email.updatedAt)}}</span>
                </v-flex>
              </v-layout>
            </v-card>
          </v-card>
          </v-flex>
          <v-flex class="xs12 md6">
            <v-card  class="scroll my-4 ml-1" max-height="300px" >
              <v-layout class=" pa-2">
                <v-flex>
                  <span class="title">Ingresos a la App</span>
                </v-flex>
              </v-layout>
              <v-card class="my-2 px-1" v-for="access in accesses" :key="access.id" color="grey lighten-4">
                <v-layout >
                  <v-flex class="xs12 md-2 pl-1"> 
                    <div class="caption grey--text mb-2">App</div>
                    <span class="body-1">{{access.uuii}}</span> 
                  </v-flex>
                  <v-flex class="xs12 md-2"> 
                    <div class="caption grey--text">Autorizado</div> 
                    <v-chip  v-bind:class="`acc-${access.authorized}`" small>
                      <span class="body-1 text-capitalize white--text">
                        {{access.authorized}}
                      </span>
                    </v-chip>
                  </v-flex>
                  <v-flex class="xs12 md-2 "> 
                    <div class="caption grey--text mb-2">Primer login</div> 
                    <span class="caption">{{dateFormat(access. createdAt)}}</span>
                  </v-flex>
                  <v-flex class="xs12 md-2 "> 
                    <div class="caption grey--text mb-2">Ultimo login</div> 
                    <span class="caption">{{dateFormat(access.updatedAt)}}</span>
                  </v-flex>
                </v-layout >
              </v-card>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  </div>
</template>
<script>
 import axios from 'axios'
 import {auth} from '../plugins/headers'
 import {backend} from '../plugins/url'
export default {
  props:['info'],
    data(){
      return{
        options: { month: 'short', year: 'numeric', day: 'numeric' },
        subscriptions:this.info.subcriptions,
        accesses:this.info.accesses,
        emails:this.info.mails,

      }
    },
    created: function(){
      if(this.info==null){
        this.$router.back()
      }
      this.searchWordpress()
    },
    methods:{
      back(){
        this.$router.back()
      },
      dataTimes(times){
        var today = new Date((times*1000))
        return today.toLocaleDateString("es-MX", this.options).toUpperCase();
      },
      dateFormat(times){
        var today = new Date(times)
        return today.toLocaleDateString("es-MX", this.options).toUpperCase();
      }
    }

};
</script>
<style>
  .scroll {
      overflow-y: auto;
    }
  .v-chip.memb-active{
    background:#4caf50;
  }
  .v-chip.memb-pending_payment{
    background:#FFEB3B;
  }
  .v-chip.memb-expired{
    background:#F44336;
  }
  .v-chip.user-true{
    background:#2196F3;
  }
  .v-chip.acc-true{
    background:#4caf50;
  }
  .v-chip.acc-false{
    background:#F44336;
  }

</style>


